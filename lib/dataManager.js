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
    const initialData = await import('@/app/lib/scheduleData.json');
    
    // Salva su Firebase
    await saveScheduleData(initialData.default);
    
    console.log('Dati iniziali caricati su Firebase');
    return true;
  } catch (error) {
    console.error('Errore inizializzazione Firebase:', error);
    throw error;
  }
}