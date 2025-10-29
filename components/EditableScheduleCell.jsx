'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const EditableScheduleCell = ({ 
  person, 
  timeSlot, 
  currentTask, 
  categories, 
  scheduleData,
  onTaskChange,
  isEditMode 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedActivity, setSelectedActivity] = useState('');
  const [availableActivities, setAvailableActivities] = useState([]);

  // Estrai tutte le attività per ogni categoria dal dataset
  const getCategoryActivities = () => {
    const categoryActivities = {};
    
    scheduleData.schedule.forEach(person => {
      person.tasks.forEach(task => {
        if (!categoryActivities[task.category]) {
          categoryActivities[task.category] = new Set();
        }
        categoryActivities[task.category].add(task.activity);
      });
    });

    // Converti Set in Array e ordina
    Object.keys(categoryActivities).forEach(cat => {
      categoryActivities[cat] = Array.from(categoryActivities[cat]).sort();
    });

    return categoryActivities;
  };

  const categoryActivities = getCategoryActivities();

  // Aggiorna le attività disponibili quando cambia la categoria
  useEffect(() => {
    if (selectedCategory && categoryActivities[selectedCategory]) {
      setAvailableActivities(categoryActivities[selectedCategory]);
    } else {
      setAvailableActivities([]);
    }
  }, [selectedCategory]);

  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isEditMode) return;
    
    if (currentTask) {
      setSelectedCategory(currentTask.category);
      setSelectedActivity(currentTask.activity);
    } else {
      setSelectedCategory('');
      setSelectedActivity('');
    }
    setIsEditing(true);
  };

  const handleSave = () => {
    if (selectedCategory && selectedActivity) {
      // Salva il task selezionato
      onTaskChange(person.name, timeSlot, {
        category: selectedCategory,
        activity: selectedActivity
      });
    } else {
      // Rimuovi task se categoria vuota o nessuna attività selezionata
      onTaskChange(person.name, timeSlot, null);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSelectedCategory('');
    setSelectedActivity('');
    setAvailableActivities([]);
  };

  const handleRemove = () => {
    onTaskChange(person.name, timeSlot, null);
    setIsEditing(false);
  };

  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;
    setSelectedCategory(newCategory);
    setSelectedActivity(''); // Reset attività quando cambia categoria
  };

  const categoryInfo = currentTask ? categories[currentTask.category] : null;

  if (isEditing) {
    return (
      <td className="border border-gray-500 px-2 py-2 bg-gray-600">
        <div className="space-y-2">
          {/* Selezione categoria */}
          <select 
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="w-full text-xs bg-gray-700 text-white border border-gray-500 rounded px-1 py-1"
          >
            <option value="">-- Nessun turno (vuoto) --</option>
            {Object.entries(categories).map(([key, cat]) => (
              <option key={key} value={key}>{cat.label}</option>
            ))}
          </select>

          {/* Selezione attività (appare solo dopo aver scelto categoria) */}
          {selectedCategory && availableActivities.length > 0 && (
            <select 
              value={selectedActivity}
              onChange={(e) => setSelectedActivity(e.target.value)}
              className="w-full text-xs bg-gray-700 text-white border border-gray-500 rounded px-1 py-1"
            >
              <option value="">-- Attività --</option>
              {availableActivities.map((activity) => (
                <option key={activity} value={activity}>{activity}</option>
              ))}
            </select>
          )}

          {/* Messaggio se non ci sono attività */}
          {selectedCategory && availableActivities.length === 0 && (
            <div className="text-xs text-gray-400 p-1">
              Nessuna attività disponibile
            </div>
          )}

          {/* Pulsanti azione */}
          <div className="flex gap-1">
            <button 
              onClick={handleSave}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs px-1 py-1 rounded"
              title={!selectedCategory ? "Salva cella vuota" : "Salva turno"}
            >
              ✓
            </button>
            <button 
              onClick={handleCancel}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white text-xs px-1 py-1 rounded"
            >
              ✕
            </button>
            {currentTask && (
              <button 
                onClick={handleRemove}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs px-1 py-1 rounded"
                title="Rimuovi turno"
              >
                🗑️
              </button>
            )}
          </div>
        </div>
      </td>
    );
  }

  // Modalità visualizzazione
  if (!currentTask) {
    return (
      <td 
        className={`border border-gray-500 px-2 py-2 text-center ${
          isEditMode ? 'cursor-pointer hover:bg-gray-600' : ''
        }`}
        onClick={handleEdit}
      >
        {isEditMode && (
          <span className="text-gray-400 text-xs">+ Aggiungi</span>
        )}
      </td>
    );
  }

  return (
    <td
      className={`border border-gray-500 px-2 py-2 text-center ${
        isEditMode ? 'cursor-pointer hover:opacity-80' : ''
      }`}
      style={{ backgroundColor: categoryInfo?.color }}
      onClick={isEditMode ? handleEdit : undefined}
    >
      {isEditMode ? (
        <div className="text-white text-xs font-semibold">
          {currentTask.activity}
          <div className="text-xs opacity-75 mt-1">
            ✏️ Modifica
          </div>
        </div>
      ) : (
        <Link
          href={`/schedule/category/${currentTask.category}`}
          className="text-white text-xs font-semibold hover:underline block"
          onClick={(e) => e.stopPropagation()}
        >
          {currentTask.activity}
        </Link>
      )}
    </td>
  );
};

export default EditableScheduleCell;