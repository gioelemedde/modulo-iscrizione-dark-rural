
'use client';
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";
import scheduleData from "../../../lib/scheduleData.json";

const PersonSchedule = () => {
  const params = useParams();
  const name = params.name;

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
          <table className="w-full">
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
              {person.tasks.map((task, index) => {
                const categoryInfo = scheduleData.categories[task.category];
                return (
                  <tr
                    key={index}
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