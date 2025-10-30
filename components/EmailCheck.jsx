"use client";
import { useState } from "react";

export default function EmailCheck({ onEmailVerified }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); 

  const handleEmailCheck = async (e) => {
    e.preventDefault();
    
    if (!email || !email.includes("@")) {
      setMessage("Inserisci un'email valida");
      setMessageType("error");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/check-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Errore server:", data);
        setMessage(`❌ Errore del server: ${data.message || 'Riprova più tardi'}`);
        setMessageType("error");
        return;
      }

      if (data.exists) {
        setMessage("✅ Email già registrata");
        setMessageType("success");
      } else {
        setMessage("⚠️  Email non registrata! Procedere con l'iscrizione.");
        setMessageType("warning");
        setTimeout(() => {
          onEmailVerified(email);
        }, 1500);
      }
    } catch (error) {
      console.error("Errore catch:", error);
      setMessage("❌ Errore di connessione. Verifica la tua connessione internet e riprova.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-gray-100/10 backdrop-blur-lg rounded-lg shadow-md p-6 shadow-violet-400">
      <h2 className="text-2xl font-bold text-center mb-6 text-white">
        Verifica Email
      </h2>
      
      <div className="mb-6">
        <p className="text-gray-300 text-sm mb-4 text-center">
          Prima di procedere con l'iscrizione, verifichiamo se sei già registrato nella nostra associazione.
        </p>
      </div>

      <form onSubmit={handleEmailCheck}>
        <div className="mb-4">
          <label className="block text-white text-sm font-bold mb-2">
            Inserisci la tua email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:border-violet-500 bg-gray-800 text-white"
            placeholder="tua.email@esempio.com"
            required
            disabled={loading}
          />
        </div>

        {message && (
          <div className={`mb-4 p-3 rounded-lg text-sm ${
            messageType === "success" 
              ? "bg-green-500/20 text-green-300 border border-green-500/30" 
              : messageType === "warning"
              ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
              : "bg-red-500/20 text-red-300 border border-red-500/30"
          }`}>
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !email}
          className="w-full bg-violet-600 hover:bg-violet-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Verificando...
            </div>
          ) : (
            "Verifica Email"
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-400 text-xs">
          Se riscontri problemi, contattaci a: 
          <span className="text-violet-400 block mt-1">darkrural.fest@gmail.com</span>
        </p>
      </div>
    </div>
  );
}