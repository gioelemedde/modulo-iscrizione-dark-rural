'use client';
import Link from "next/link";
import React, { useState } from "react";
import { useFirebaseSchedule } from "@/hooks/useFirebaseSchedule";
import EditableScheduleCell from "@/components/EditableScheduleCell";

const ScheduleOverview = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const { 
    scheduleData, 
    loading, 
    error, 
    saving,
    updatePersonTask,
    getTaskForTimeSlot 
  } = useFirebaseSchedule();

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 p-8 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-violet-500 mx-auto mb-4"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 p-8 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Errore Firebase</h2>
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

  // No data state
  if (!scheduleData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 p-8 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-yellow-500 mb-4">Nessun dato trovato</h2>
          <p className="text-gray-300 mb-4">Il database Firebase è vuoto. Carica i dati iniziali.</p>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 p-8">
      <div className=" mx-auto">
        {/* Header con controlli */}
        <div className="mb-6 flex justify-between items-center flex-wrap gap-8">
          <h1 className="text-3xl font-bold text-white"> Gestione Turni</h1>
          
          <div className="flex items-center gap-4">
            {/* Toggle modalità editing */}
            <label className="flex items-center gap-3 cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={isEditMode}
                  onChange={(e) => setIsEditMode(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-14 h-8 rounded-full transition-all duration-300 ${
                  isEditMode ? 'bg-violet-600' : 'bg-gray-600'
                }`}>
                  <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-lg transition-all duration-300 transform ${
                    isEditMode ? 'translate-x-6' : 'translate-x-0'
                  }`}>
                    
                  </div>
                </div>
              </div>
              <span className={`font-medium transition-colors ${
                isEditMode ? 'text-violet-300' : 'text-white'
              }`}>
                {isEditMode ? ' Modalità Editor' : 'Modalità Visualizzazione'}
              </span>
            </label>
            
            {/* Indicatore Firebase attivo */}
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            
            {/* Indicatore salvataggio */}
            {saving && (
              <span className="text-violet-400 text-sm font-medium">
                💾 Sincronizzando...
              </span>
            )}
          </div>
        </div>

   
        <div className="overflow-x-auto shadow-2xl rounded-lg ">
          <table className="w-full bg-gray-800/80 backdrop-blur-sm border-collapse ">
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
              {scheduleData.schedule.map((person) => (
                <tr key={person.name} className="hover:bg-gray-700/50 transition-colors">
                  <td className="border border-gray-500 px-4 py-2 font-bold text-white sticky left-0 bg-gray-700/80 z-10">
                    {isEditMode ? (
                      <span>{person.name}</span>
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
              ))}
            </tbody>
          </table>
        </div>

        {/* Legenda */}
        <div className="mt-8 bg-gray-800/80 backdrop-blur-sm rounded-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Legenda Categorie</h2>
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