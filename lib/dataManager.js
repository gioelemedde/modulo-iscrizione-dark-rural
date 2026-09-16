// Firebase Data Manager
import { database } from '@/lib/firebase';
import { ref, get, set, onValue, runTransaction } from 'firebase/database';

// Reference al nodo scheduleData nel database
const scheduleRef = ref(database, 'scheduleData');


export async function readScheduleData() {
  try {
    const snapshot = await get(scheduleRef);
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      console.log('Nessun dato trovato');
      return null;
    }
  } catch (error) {
    console.error('Errore lettura dati Firebase:', error);
    throw error;
  }
}

// Salva i dati su Firebase
export async function saveScheduleData(data) {
  try {
    await set(scheduleRef, data);
    return true;
  } catch (error) {
    console.error('Errore salvataggio Firebase:', error);
    throw error;
  }
}

// Ascolta i cambiamenti in tempo reale. Ritorna direttamente la funzione di
// unsubscribe di onValue: NON avvolgerla in off(scheduleRef, 'value', unsubscribe),
// off() si aspetta la callback originale passata a onValue, non la funzione di
// unsubscribe che onValue restituisce — altrimenti non stacca mai il listener.
export function listenToScheduleChanges(onData, onError) {
  return onValue(
    scheduleRef,
    (snapshot) => onData(snapshot.exists() ? snapshot.val() : null),
    (error) => onError?.(error)
  );
}

// Carica i dati iniziali dal JSON locale (solo la prima volta)
export async function initializeFirebaseData() {
  try {
    // Importa i dati dal JSON locale
    const initialData = await import('@/lib/scheduleData.json');

    // Salva su Firebase
    await saveScheduleData(initialData.default);

    return true;
  } catch (error) {
    console.error('Errore inizializzazione Firebase:', error);
    throw error;
  }
}

// Aggiorna/rimuove il task di una persona in uno slot orario. Usa una
// transazione Firebase (invece di leggere+mutare+set sull'intero blob) così
// due modifiche concorrenti (stesso client o client diversi) non si
// sovrascrivono a vicenda: Firebase ritenta la funzione con il valore più
// recente se rileva una scrittura in conflitto.
export async function updatePersonTaskInSchedule(personName, timeSlot, newTask) {
  const { committed } = await runTransaction(scheduleRef, (currentData) => {
    if (!currentData) return currentData;

    const personIndex = currentData.schedule.findIndex(p => p.name === personName);
    if (personIndex === -1) return currentData;

    const person = currentData.schedule[personIndex];
    if (!Array.isArray(person.tasks)) {
      person.tasks = [];
    }

    const taskIndex = person.tasks.findIndex(t => t.time === timeSlot);

    if (newTask) {
      const taskData = {
        time: timeSlot,
        category: newTask.category,
        activity: newTask.activity
      };
      if (taskIndex >= 0) {
        person.tasks[taskIndex] = taskData;
      } else {
        person.tasks.push(taskData);
      }
    } else if (taskIndex >= 0) {
      person.tasks.splice(taskIndex, 1);
    }

    return currentData;
  });

  if (!committed) {
    throw new Error('Impossibile salvare la modifica, riprova.');
  }
}

// Aggiunge una nuova persona allo schedule esistente su Firebase
export async function addPersonToSchedule(name) {
  let outcome = null;

  const { committed } = await runTransaction(scheduleRef, (currentData) => {
    if (!currentData) {
      outcome = 'no-data';
      return;
    }
    const exists = currentData.schedule.some(p => p.name.toLowerCase() === name.toLowerCase());
    if (exists) {
      outcome = 'exists';
      return;
    }
    currentData.schedule.push({ name, tasks: [] });
    return currentData;
  });

  if (outcome === 'no-data') {
    throw new Error('Nessun dato trovato su Firebase. Esegui prima l\'inizializzazione.');
  }
  if (outcome === 'exists') {
    throw new Error(`La persona "${name}" esiste già nello schedule.`);
  }
  if (!committed) {
    throw new Error(`Impossibile aggiungere "${name}", riprova.`);
  }
  return true;
}

// Rimuove una persona dallo schedule su Firebase
export async function removePersonFromSchedule(name) {
  let outcome = null;

  const { committed } = await runTransaction(scheduleRef, (currentData) => {
    if (!currentData) {
      outcome = 'no-data';
      return;
    }
    const personIndex = currentData.schedule.findIndex(
      p => p.name.toLowerCase() === name.toLowerCase()
    );
    if (personIndex === -1) {
      outcome = 'not-found';
      return;
    }
    currentData.schedule.splice(personIndex, 1);
    return currentData;
  });

  if (outcome === 'no-data') {
    throw new Error('Nessun dato trovato su Firebase.');
  }
  if (outcome === 'not-found') {
    throw new Error(`La persona "${name}" non esiste nello schedule.`);
  }
  if (!committed) {
    throw new Error(`Impossibile rimuovere "${name}", riprova.`);
  }
  return true;
}
