'use client';
import { useState, useEffect, useCallback } from 'react';
import { readScheduleData, saveScheduleData, listenToScheduleChanges } from '@/lib/dataManager';

export function useFirebaseSchedule() {
  const [scheduleData, setScheduleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  // Carica i dati iniziali e imposta listener
  useEffect(() => {
    let unsubscribe = null;

    const initializeData = async () => {
      try {
        setLoading(true);
        
        // Imposta listener per cambiamenti in tempo reale
        unsubscribe = listenToScheduleChanges((newData) => {
          setScheduleData(newData);
          setLoading(false);
        });

        // Carica dati iniziali
        const data = await readScheduleData();
        if (data) {
          setScheduleData(data);
        }
        
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    initializeData();

    // Cleanup listener when component unmounts
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  // Aggiorna un task di una persona
  const updatePersonTask = useCallback(async (personName, timeSlot, newTask) => {
    if (!scheduleData) return;

    try {
      setSaving(true);
      
      const updatedData = { ...scheduleData };
      const personIndex = updatedData.schedule.findIndex(p => p.name === personName);
      
      if (personIndex === -1) return;

      const person = updatedData.schedule[personIndex];
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
      } else {
        // Rimuovi task
        if (taskIndex >= 0) {
          person.tasks.splice(taskIndex, 1);
        }
      }

      // Salva su Firebase (il listener aggiornerà automaticamente lo stato locale)
      await saveScheduleData(updatedData);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }, [scheduleData]);

  // Salva tutto il dataset
  const saveAllData = useCallback(async (newData) => {
    try {
      setSaving(true);
      await saveScheduleData(newData);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }, []);

  // Utilità per ottenere un task specifico
  const getTaskForTimeSlot = useCallback((personTasks, timeSlot) => {
    return personTasks.find(task => task.time === timeSlot);
  }, []);

  return {
    scheduleData,
    loading,
    error,
    saving,
    updatePersonTask,
    saveAllData,
    getTaskForTimeSlot
  };
}