'use client';
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";
import { useFirebaseSchedule } from "@/hooks/useFirebaseSchedule";


const DAY_START_THRESHOLD_MINUTES = 6 * 60; // 06:00


const getSortableMinutes = (timeRange) => {
  if (!timeRange || typeof timeRange !== "string") return 0;

  const startTime = timeRange.split("-")[0]?.trim(); 
  if (!startTime) return 0;

  const [hoursStr, minutesStr] = startTime.split(":");
  const hours = parseInt(hoursStr, 10);
  const minutes = parseInt(minutesStr, 10);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) return 0;

  let totalMinutes = hours * 60 + minutes;

  if (totalMinutes < DAY_START_THRESHOLD_MINUTES) {
    totalMinutes += 24 * 60;
  }

  return totalMinutes;
};


const sortTasksByTime = (tasks) => {
  return [...tasks]
    .map((task, originalIndex) => ({ task, originalIndex }))
    .sort((a, b) => {
      const diff = getSortableMinutes(a.task.time) - getSortableMinutes(b.task.time);
      if (diff !== 0) return diff;
      return a.originalIndex - b.originalIndex;
    })
    .map(({ task }) => task);
};

const PersonSchedule = () => {
  const params = useParams();
  const name = params.name;

  const {
    scheduleData,
    loading,
    error
  } = useFirebaseSchedule();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 p-8 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-violet-500 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold">Caricamento da Firebase...</h2>
        </div>
      </div>
    );
  }

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

  if (!scheduleData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 p-8 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-yellow-500 mb-4">Nessun dato trovato</h2>
          <p className="text-gray-300 mb-4">Il database Firebase è vuoto.</p>
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

  const person = scheduleData.schedule.find((p) => p.name === name);

  if (!person) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 p-8 flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-4xl font-bold mb-4">Persona non trovata</h1>
          <Link
            href="/schedule"
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
          >
            Torna alla vista completa
          </Link>
        </div>
      </div>
    );
  }

  // Persona trovata ma senza task
  if (!person.tasks || person.tasks.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-6">📭</div>
          <h1 className="text-3xl font-bold text-white mb-2">{person.name}</h1>
          <p className="text-gray-400 text-lg mb-6">
            Nessun turno associato a questa persona.
          </p>
          <Link
            href="/schedule"
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
          >
            ← Torna alla vista completa
          </Link>
        </div>
      </div>
    );
  }

  // Fix: ordino i turni in ordine cronologico reale prima di renderizzarli,
  // gestendo correttamente i turni che attraversano la mezzanotte
  // (es. 23:00-00:00, 00:00-01:00, 02:00-03:00 vanno dopo 20:00-21:00).
  const sortedTasks = sortTasksByTime(person.tasks);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link
            href="/schedule"
            className="text-gray-300 hover:text-white flex items-center gap-2 mb-4"
          >
            ← Torna alla vista completa
          </Link>
          <h1 className="text-4xl font-bold text-white">
            Turni di {person.name}
          </h1>
        </div>

        <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[425px]">
              <thead>
                <tr className="bg-violet-800">
                  <th className="border border-gray-500 px-6 py-4 text-white font-bold text-left">
                    Orario
                  </th>
                  <th className="border border-gray-500 px-6 py-4 text-white font-bold text-left">
                    Attività
                  </th>
                  <th className="border border-gray-500 px-6 py-4 text-white font-bold text-left">
                    Categoria
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedTasks.map((task, index) => {
                  const categoryInfo = scheduleData.categories[task.category];
                  return (
                    <tr
                      key={`${task.time}-${task.category}-${index}`}
                      className="hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="border border-gray-500 px-6 py-4 text-white font-semibold">
                        {task.time}
                      </td>
                      <td
                        className="border border-gray-500 px-6 py-4 text-white font-bold"
                        style={{ backgroundColor: categoryInfo?.color }}
                      >
                        {task.activity}
                      </td>
                      <td className="border border-gray-500 px-6 py-4">
                        <Link
                          href={`/schedule/category/${task.category}`}
                          className="text-gray-300 hover:text-white underline"
                        >
                          {categoryInfo?.label}
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Statistiche */}
        <div className="mt-8 bg-gray-800/80 backdrop-blur-sm rounded-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Riepilogo</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-gray-700/70 rounded p-4">
              <p className="text-gray-300 text-sm">Totale Turni</p>
              <p className="text-white text-2xl font-bold">{person.tasks.length}</p>
            </div>
            {Object.entries(
              person.tasks.reduce((acc, task) => {
                acc[task.category] = (acc[task.category] || 0) + 1;
                return acc;
              }, {})
            ).map(([category, count]) => (
              <div
                key={category}
                className="rounded p-4"
                style={{ backgroundColor: scheduleData.categories[category]?.color }}
              >
                <p className="text-white text-sm">
                  {scheduleData.categories[category]?.label}
                </p>
                <p className="text-white text-2xl font-bold">{count}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonSchedule;