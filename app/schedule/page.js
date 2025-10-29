import Link from "next/link";
import React from "react";
import scheduleData from "../lib/scheduleData.json";

const ScheduleOverview = () => {
  const getTaskForTimeSlot = (personTasks, timeSlot) => {
    return personTasks.find((task) => task.time === timeSlot);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 p-8">
      <div className=" mx-auto">
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
                    <Link
                      href={`/schedule/person/${person.name}`}
                      className="hover:text-gray-300 underline"
                    >
                      {person.name}
                    </Link>
                  </td>
                  {scheduleData.timeSlots.map((slot) => {
                    const task = getTaskForTimeSlot(person.tasks, slot);
                    if (!task) {
                      return (
                        <td
                          key={slot}
                          className="border border-gray-500 px-2 py-2"
                        />
                      );
                    }
                    const categoryInfo = scheduleData.categories[task.category];
                    return (
                      <td
                        key={slot}
                        className="border border-gray-500 px-2 py-2 text-center"
                        style={{ backgroundColor: categoryInfo?.color }}
                      >
                        <Link
                          href={`/schedule/category/${task.category}`}
                          className="text-white text-xs font-semibold hover:underline block"
                        >
                          {task.activity}
                        </Link>
                      </td>
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