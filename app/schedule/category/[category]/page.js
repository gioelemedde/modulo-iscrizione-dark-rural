
'use client';
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";
import scheduleData from "../../../lib/scheduleData.json";


const CategorySchedule = () => {
  const params = useParams();
  const category = params.category;

    const categoryInfo = scheduleData.categories[category];

  const peopleWithCategory = scheduleData.schedule
    .map((person) => ({
      name: person.name,
      tasks: person.tasks.filter((task) => task.category === category),
    }))
    .filter((person) => person.tasks.length > 0);

  if (!categoryInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 p-8 flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-4xl font-bold mb-4">Categoria non trovata</h1>
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

  const tasksByTime = {};
  peopleWithCategory.forEach((person) => {
    person.tasks.forEach((task) => {
      if (!tasksByTime[task.time]) {
        tasksByTime[task.time] = [];
      }
      tasksByTime[task.time].push({
        name: person.name,
        activity: task.activity,
      });
    });
  });


  const timeToMinutes = (timeStr) => {

    const startTime = timeStr.split('-')[0];
    const [hours, minutes] = startTime.split(':').map(Number);
    let totalMinutes = hours * 60 + minutes;
    

    if (hours >= 0 && hours < 6) {
      totalMinutes += 24 * 60;
    }
    
    return totalMinutes;
  };

  const sortedTimes = Object.keys(tasksByTime).sort((a, b) => {
    return timeToMinutes(a) - timeToMinutes(b);
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Link
            href="/schedule"
            className="text-gray-300 hover:text-white flex items-center gap-2 mb-4"
          >
            ← Torna alla vista completa
          </Link>
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-lg"
              style={{ backgroundColor: categoryInfo.color }}
            />
            <h1 className="text-4xl font-bold text-white">
              {categoryInfo.label}
            </h1>
          </div>
        </div>

        {/* Vista per orario */}
        <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-2xl overflow-hidden mb-8">
          <div className="bg-violet-800 px-6 py-4">
            <h2 className="text-2xl font-bold text-white">
              Persone per Orario
            </h2>
          </div>
          <table className="w-full">
            <thead>
              <tr className="bg-gray-600">
                <th className="border border-gray-500 px-6 py-4 text-white font-bold text-left">
                  Orario
                </th>
                <th className="border border-gray-500 px-6 py-4 text-white font-bold text-left">
                  Persone Assegnate
                </th>
                <th className="border border-gray-500 px-6 py-4 text-white font-bold text-center">
                  N° Persone
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedTimes.map((time) => (
                <tr key={time} className="hover:bg-gray-700/50 transition-colors">
                  <td className="border border-gray-500 px-6 py-4 text-white font-semibold">
                    {time}
                  </td>
                  <td className="border border-gray-500 px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {tasksByTime[time].map((person, idx) => (
                        <Link
                          key={idx}
                          href={`/schedule/person/${person.name}`}
                          className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-full text-sm font-semibold transition-colors"
                        >
                          {person.name}
                        </Link>
                      ))}
                    </div>
                  </td>
                  <td className="border border-gray-500 px-6 py-4 text-white text-center font-bold text-lg">
                    {tasksByTime[time].length}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Vista per persona */}
        <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-2xl overflow-hidden">
          <div className="bg-violet-800 px-6 py-4">
            <h2 className="text-2xl font-bold text-white">
              Riepilogo per Persona
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
            {peopleWithCategory.map((person) => (
              <div
                key={person.name}
                className="bg-gray-700/70 rounded-lg p-4 hover:bg-gray-600/70 transition-colors"
              >
                <Link
                  href={`/schedule/person/${person.name}`}
                  className="text-xl font-bold text-white hover:text-gray-300 mb-2 block"
                >
                  {person.name}
                </Link>
                <p className="text-gray-300 text-sm mb-2">
                  {person.tasks.length} turni in {categoryInfo.label}
                </p>
                <div className="space-y-1">
                  {person.tasks.map((task, idx) => (
                    <div
                      key={idx}
                      className="text-white text-xs bg-gray-600/70 rounded px-2 py-1"
                    >
                      {task.time}: {task.activity}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Statistiche */}
        <div className="mt-8 bg-gray-800/80 backdrop-blur-sm rounded-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Statistiche</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-700/70 rounded p-4">
              <p className="text-gray-300 text-sm">Totale Persone</p>
              <p className="text-white text-3xl font-bold">
                {peopleWithCategory.length}
              </p>
            </div>
            <div className="bg-gray-700/70 rounded p-4">
              <p className="text-gray-300 text-sm">Totale Turni</p>
              <p className="text-white text-3xl font-bold">
                {peopleWithCategory.reduce(
                  (acc, person) => acc + person.tasks.length,
                  0
                )}
              </p>
            </div>
            <div className="bg-gray-700/70 rounded p-4">
              <p className="text-gray-300 text-sm">Fasce Orarie</p>
              <p className="text-white text-3xl font-bold">
                {sortedTimes.length}
              </p>
            </div>
            <div className="bg-gray-700/70 rounded p-4">
              <p className="text-gray-300 text-sm">Media Persone/Ora</p>
              <p className="text-white text-3xl font-bold">
                {(
                  peopleWithCategory.reduce(
                    (acc, person) => acc + person.tasks.length,
                    0
                  ) / sortedTimes.length
                ).toFixed(1)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategorySchedule;