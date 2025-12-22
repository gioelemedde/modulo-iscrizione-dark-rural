import React from 'react';
import Link from 'next/link';

export default function IscrizioneSuccess() {
  return (
    <div className="container mx-auto px-4 h-screen flex items-center justify-center">
      <div className="max-w-md bg-gray-100/10 shadow-violet-600 backdrop-blur-md rounded-lg shadow-md px-8 py-12 text-center success-animation">
        <div className="mb-8">
          <svg className="w-20 h-20 mx-auto text-green-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <h1 className="text-3xl font-bold mb-4 text-violet-600">Invio Completato!</h1>
          <p className="text-white text-lg mb-2">La tua iscrizione è stata inviata con successo.</p>
          <p className="text-gray-300">Riceverai una conferma via email a breve.</p>
        </div>
        <Link 
          href="/"
          className="inline-block bg-violet-600 hover:bg-violet-700 text-white font-semibold px-6 py-3 rounded-lg transition duration-300"
        >
          Torna alla Home
        </Link>
      </div>
    </div>
  );
}