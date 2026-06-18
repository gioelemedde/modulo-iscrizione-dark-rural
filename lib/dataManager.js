// Firebase Data Manager
import { database } from '@/lib/firebase';
import { ref, get, set, onValue, off } from 'firebase/database';

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
    console.log('Dati salvati su Firebase con successo');
    return true;
  } catch (error) {
    console.error('Errore salvataggio Firebase:', error);
    throw error;
  }
}

// Ascolta i cambiamenti in tempo reale
export function listenToScheduleChanges(callback) {
  const unsubscribe = onValue(scheduleRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.val());
    }
  });
  
  // Ritorna la funzione per fermare l'ascolto
  return () => off(scheduleRef, 'value', unsubscribe);
}

// Carica i dati iniziali dal JSON locale (solo la prima volta)
export async function initializeFirebaseData() {
  try {
    // Importa i dati dal JSON locale
    const initialData = await import('@/lib/scheduleData.json');
    
    // Salva su Firebase
    await saveScheduleData(initialData.default);
    
    console.log('Dati iniziali caricati su Firebase');
    return true;
  } catch (error) {
    console.error('Errore inizializzazione Firebase:', error);
    throw error;
  }
}

// Aggiunge una nuova persona allo schedule esistente su Firebase
export async function addPersonToSchedule(name) {
  try {
    const currentData = await readScheduleData();
    
    if (!currentData) {
      throw new Error('Nessun dato trovato su Firebase. Esegui prima l\'inizializzazione.');
    }
    
    // Controlla se la persona esiste già
    const exists = currentData.schedule.some(p => p.name.toLowerCase() === name.toLowerCase());
    if (exists) {
      throw new Error(`La persona "${name}" esiste già nello schedule.`);
    }
    
    // Aggiungi la nuova persona con tasks vuoti
    currentData.schedule.push({
      name: name,
      tasks: []
    });
    
    // Salva su Firebase
    await saveScheduleData(currentData);
    
    console.log(`Persona "${name}" aggiunta con successo`);
    return true;
  } catch (error) {
    console.error('Errore aggiunta persona:', error);
    throw error;
  }
}

// Rimuove una persona dallo schedule su Firebase
export async function removePersonFromSchedule(name) {
  try {
    const currentData = await readScheduleData();
    
    if (!currentData) {
      throw new Error('Nessun dato trovato su Firebase.');
    }
    
    const personIndex = currentData.schedule.findIndex(p => p.name === name);
    if (personIndex === -1) {
      throw new Error(`La persona "${name}" non esiste nello schedule.`);
    }
    
    // Rimuovi la persona
    currentData.schedule.splice(personIndex, 1);
    
    // Salva su Firebase
    await saveScheduleData(currentData);
    
    console.log(`Persona "${name}" rimossa con successo`);
    return true;
  } catch (error) {
    console.error('Errore rimozione persona:', error);
    throw error;
  }
}