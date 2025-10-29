'use client';
import { useState } from 'react';
import { initializeFirebaseData } from '@/lib/dataManager';

export default function InitPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleInitialize = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await initializeFirebaseData();
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg p-8 border border-gray-700">
          <h1 className="text-3xl font-bold text-white mb-6">
            🔥 Inizializza Firebase Database
          </h1>
          
          {!success ? (
            <>
              <p className="text-gray-300 mb-6">
                Clicca il pulsante qui sotto per caricare i dati iniziali dei turni 
                dal file JSON locale nel database Firebase.
              </p>
              
              <p className="text-yellow-400 text-sm mb-6">
                ⚠️ <strong>Attenzione:</strong> Questa operazione sovrascriverà 
                tutti i dati esistenti nel database Firebase.
              </p>
              
              <button
                onClick={handleInitialize}
                disabled={loading}
                className="bg-violet-600 hover:bg-violet-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Caricamento dati...
                  </span>
                ) : (
                  '🚀 Carica Dati Iniziali'
                )}
              </button>
              
              {error && (
                <div className="mt-4 p-4 bg-red-900/50 border border-red-700 rounded-lg">
                  <p className="text-red-300">
                    <strong>Errore:</strong> {error}
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center">
              <div className="text-6xl mb-4">✅</div>
              <h2 className="text-2xl font-bold text-green-400 mb-4">
                Dati caricati con successo!
              </h2>
              <p className="text-gray-300 mb-6">
                Il database Firebase è stato inizializzato con i dati dei turni.
                Ora puoi andare alla pagina schedule per vedere il sistema collaborativo in azione.
              </p>
              
              <div className="flex gap-4 justify-center">
                <a
                  href="/schedule"
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  🗓️ Vai ai Turni
                </a>
                
                <button
                  onClick={() => setSuccess(false)}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  🔄 Reinizializza
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Istruzioni */}
        <div className="mt-8 bg-gray-800/80 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-4">📋 Cosa succede dopo?</h2>
          
          <div className="space-y-3 text-gray-300">
            <div className="flex items-start gap-3">
              <span className="text-violet-400 font-bold">1.</span>
              <span>I dati vengono caricati su Firebase Realtime Database</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-violet-400 font-bold">2.</span>
              <span>Tutti gli utenti vedranno gli stessi dati in tempo reale</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-violet-400 font-bold">3.</span>
              <span>Le modifiche vengono sincronizzate istantaneamente</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-violet-400 font-bold">4.</span>
              <span>Condividi il link del sito per collaborazione multi-utente</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}