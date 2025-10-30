import React from 'react';

const ReviewForm = ({ prevStep, values, handleSubmit, loading }) => {
  const torna = (e) => {
    e.preventDefault();
    prevStep();
  };
  
  return (
    <div >
      <h2 className="text-lg font-semibold mb-4">Rivedi i tuoi dati</h2>
      
      <div className="mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div className='col-span-2'>
            <p className="text-sm text-gray-400">Nome:</p>
            <p className="font-medium">{values.nome}</p>
          </div>
          
          <div className='col-span-2'>
            <p className="text-sm text-gray-400">Cognome:</p>
            <p className="font-medium">{values.cognome}</p>
          </div>

          <div className='col-span-2'>
            <p className="text-sm text-gray-400">Luogo Nascita:</p>
            <p className="font-medium">{values.luogoNascita}</p>
          </div>

          <div className='col-span-2'>
            <p className="text-sm text-gray-400">Data Nascita:</p>
            <p className="font-medium">{values.dataNascita}</p>
          </div>
          
          <div className='col-span-2'>
            <p className="text-sm text-gray-400">Email:</p>
            <p className="font-medium">{values.email}</p>
          </div>

          <div className='col-span-2'>
            <p className="text-sm text-gray-400">Comune di Residenza:</p>
            <p className="font-medium">{values.comune || 'Non specificato'}</p>
          </div>
          
          
          <div className='col-span-2'>
            <p className="text-sm text-gray-400">Telefono Cellulare:</p>
            <p className="font-medium">{values.cellulare || 'Non specificato'}</p>
          </div>

          <div className='col-span-2'>
            <p className="text-sm text-gray-400">Professione:</p>
            <p className="font-medium">{values.professione || 'Non specificato'}</p>
          </div>
          
          
          <div className="col-span-2">
            <p className="text-sm text-gray-400">Indirizzo:</p>
            <p className="font-medium">{values.indirizzo || 'Non specificato'}</p>
          </div>
        </div>
      </div>
      
      {values.firma && (
        <div className="mb-6">
          <p className="text-sm text-gray-400 mb-2">Firma:</p>
          <img
            src={values.firma}
            alt="Firma"
            className="border border-gray-300 p-2 max-h-32 bg-gray-300"
          />
        </div>
      )}
      
      <div className="flex justify-between">
        <button
          type="button"
          onClick={torna}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          disabled={loading}
        >
          Indietro
        </button>
        
        <button
          type="button"
          onClick={handleSubmit}
          className="bg-violet-600 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center justify-center"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="mr-2">Invio in corso...</span>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </>
          ) : (
            'Invia'
          )}
        </button>
      </div>
    </div>
  );
};

export default ReviewForm;