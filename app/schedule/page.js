"use client";
import Link from "next/link";
import React, { useState } from "react";
import { useFirebaseSchedule } from "@/hooks/useFirebaseSchedule";
import EditableScheduleCell from "@/components/EditableScheduleCell";

const ScheduleOverview = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [showPersonManager, setShowPersonManager] = useState(false);
  const [newPersonName, setNewPersonName] = useState("");
  const [personError, setPersonError] = useState(null);
  const {
    scheduleData,
    loading,
    error,
    saving,
    updatePersonTask,
    getTaskForTimeSlot,
    addPerson,
    removePerson,
  } = useFirebaseSchedule();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 p-8 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-violet-500 mx-auto mb-4"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 p-8 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">
            Errore Firebase
          </h2>
          <p className="text-gray-300 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded"
          >
            Ricarica pagina
          </button>
        </div>
      </div>
    );
  }

  if (!scheduleData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 p-8 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-yellow-500 mb-4">
            Nessun dato trovato
          </h2>
          <p className="text-gray-300 mb-4">
            Il database Firebase è vuoto. Carica i dati iniziali.
          </p>
          <a
            href="/init"
            className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded inline-block"
          >
            🚀 Carica Dati Iniziali
          </a>
        </div>
      </div>
    );
  }

  const handleTaskChange = (personName, timeSlot, newTask) => {
    updatePersonTask(personName, timeSlot, newTask);
  };

  const handleAddPerson = async (e) => {
    e.preventDefault();
    if (!newPersonName.trim()) return;
    setPersonError(null);
    try {
      await addPerson(newPersonName.trim());
      setNewPersonName("");
    } catch (err) {
      setPersonError(err.message);
    }
  };

  const handleRemovePerson = async (name) => {
    if (
      !confirm(
        `Sei sicuro di voler rimuovere "${name}" dai turni? I suoi turni verranno persi.`,
      )
    )
      return;
    setPersonError(null);
    try {
      await removePerson(name);
    } catch (err) {
      setPersonError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 p-8">
      <div className="mx-auto">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center flex-wrap gap-8">
          <h1 className="text-3xl font-bold text-white">Gestione Turni</h1>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={isEditMode}
                  onChange={(e) => setIsEditMode(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className={`w-14 h-8 rounded-full transition-all duration-300 ${
                    isEditMode ? "bg-violet-600" : "bg-gray-600"
                  }`}
                >
                  <div
                    className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-lg transition-all duration-300 transform ${
                      isEditMode ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </div>
              </div>
              <span
                className={`font-medium transition-colors ${
                  isEditMode ? "text-violet-300" : "text-white"
                }`}
              >
                {isEditMode ? "Modalità Editor" : "Modalità Visualizzazione"}
              </span>
            </label>

            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>

            {saving && (
              <span className="text-violet-400 text-sm font-medium">
                💾 Sincronizzando...
              </span>
            )}

            <button
              onClick={() => setShowPersonManager(!showPersonManager)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                showPersonManager
                  ? "bg-violet-600 text-white"
                  : "bg-gray-600 hover:bg-gray-500 text-white"
              }`}
            >
              👥 Gestisci Persone
            </button>
          </div>
        </div>

        {/* Pannello gestione persone */}
        {showPersonManager && (
          <div className="mb-6 bg-gray-800/80 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-4">
              👥 Aggiungi/Rimuovi Persone
            </h2>

            <form onSubmit={handleAddPerson} className="flex flex-wrap gap-3 mb-4">
              <input
                type="text"
                value={newPersonName}
                onChange={(e) => setNewPersonName(e.target.value)}
                placeholder="Nome della persona..."
                className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-violet-500"
              />
              <button
                type="submit"
                disabled={!newPersonName.trim() || saving}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
              >
                Aggiungi
              </button>
            </form>

            {personError && (
              <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-lg">
                <p className="text-red-300 text-sm">{personError}</p>
              </div>
            )}

            <div className="border-t border-gray-700 pt-4">
              <p className="text-gray-400 text-sm mb-3">
                Persone attuali ({scheduleData?.schedule?.length || 0}):
              </p>
              <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                {scheduleData?.schedule?.map((person) => (
                  <div
                    key={person.name}
                    className="flex items-center gap-2 px-3 py-1 bg-gray-700 rounded-full text-sm"
                  >
                    <span className="text-white">{person.name}</span>
                    <button
                      onClick={() => handleRemovePerson(person.name)}
                      className="text-red-400 hover:text-red-300 font-bold"
                      title={`Rimuovi ${person.name}`}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tabella */}
        <div className="overflow-x-auto shadow-2xl rounded-lg">
          <table className="w-full bg-gray-800/80 backdrop-blur-sm border-collapse">
            <thead>
              <tr className="bg-gray-700">
                <th className="border border-gray-500 px-4 py-3 text-white font-bold sticky left-0 bg-gray-700 z-10">
                  Nome
                </th>
                {scheduleData.timeSlots.map((slot) => (
                  <th
                    key={slot}
                    className="border border-gray-500 px-2 py-3 text-white text-xs font-semibold min-w-[100px]"
                  >
                    {slot}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {scheduleData.schedule.map((person) => {
                const hasTasks = person.tasks && person.tasks.length > 0;

                return (
                  <tr
                    key={person.name}
                    className="hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="border border-gray-500 px-4 py-2 font-bold text-white sticky left-0 bg-gray-700/80 z-10">
                      {/* In edit mode: solo testo. In view mode: link solo se ha task */}
                      {isEditMode || !hasTasks ? (
                        <span className={!hasTasks ? "text-gray-400" : ""}>
                          {person.name}
                        </span>
                      ) : (
                        <Link
                          href={`/schedule/person/${person.name}`}
                          className="hover:text-gray-300 underline"
                        >
                          {person.name}
                        </Link>
                      )}
                    </td>
                    {scheduleData.timeSlots.map((slot) => {
                      const task = getTaskForTimeSlot(person.tasks, slot);
                      return (
                        <EditableScheduleCell
                          key={slot}
                          person={person}
                          timeSlot={slot}
                          currentTask={task}
                          categories={scheduleData.categories}
                          scheduleData={scheduleData}
                          onTaskChange={handleTaskChange}
                          isEditMode={isEditMode}
                        />
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Legenda */}
        <div className="mt-8 bg-gray-800/80 backdrop-blur-sm rounded-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-4">
            Legenda Categorie
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {Object.entries(scheduleData.categories).map(([key, cat]) => (
              <div key={key} className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded"
                  style={{ backgroundColor: cat.color }}
                />
                <span className="text-white text-sm">{cat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleOverview;
