'use client';
import { useState, useEffect, useCallback } from 'react';
import { readScheduleData, saveScheduleData, listenToScheduleChanges, addPersonToSchedule, removePersonFromSchedule, updatePersonTaskInSchedule } from '@/lib/dataManager';

export function useFirebaseSchedule() {
  const [scheduleData, setScheduleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  // Il listener onValue emette subito il valore corrente: non serve un
  // readScheduleData() separato dopo (era ridondante e in corsa con il
  // listener stesso, con esito imprevedibile su quale dei due vincesse).
  useEffect(() => {
    const unsubscribe = listenToScheduleChanges(
      (data) => {
        setScheduleData(data);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  // Aggiorna un task di una persona
  const updatePersonTask = useCallback(async (personName, timeSlot, newTask) => {
    try {
      setSaving(true);
      await updatePersonTaskInSchedule(personName, timeSlot, newTask);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }, []);

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
    if (!personTasks || !Array.isArray(personTasks)) return undefined;
    return personTasks.find(task => task.time === timeSlot);
  }, []);

  // Aggiunge una nuova persona allo schedule
  const addPerson = useCallback(async (name) => {
    try {
      setSaving(true);
      await addPersonToSchedule(name);
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setSaving(false);
    }
  }, []);

  // Rimuove una persona dallo schedule
  const removePerson = useCallback(async (name) => {
    try {
      setSaving(true);
      await removePersonFromSchedule(name);
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setSaving(false);
    }
  }, []);

  return {
    scheduleData,
    loading,
    error,
    saving,
    updatePersonTask,
    saveAllData,
    getTaskForTimeSlot,
    addPerson,
    removePerson
  };
}
