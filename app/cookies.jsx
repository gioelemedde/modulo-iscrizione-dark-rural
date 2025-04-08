"use client";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Link from "next/link";

const CookieBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = Cookies.get("cookie_consent");
    if (!accepted) setVisible(true);
  }, []);

  const handleAccept = () => {
    Cookies.set("cookie_consent", "accepted", { expires: 365 });
    setVisible(false);
  };

  const handleReject = () => {
    Cookies.set("cookie_consent", "rejected", { expires: 365 });
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 z-50 shadow-xl">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm">
          Usiamo cookie tecnici e di terze parti (Google reCAPTCHA) per proteggere il modulo. Nessun dato viene salvato. 
          <Link
            href="/cookie-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="underline ml-1 text-violet-500"
          >
            Scopri di più
          </Link>
        </p>
        <div className="flex gap-2">
          <button
            onClick={handleReject}
            className="bg-transparent text-violet-400 border border-violet-400 px-4 py-1 rounded cursor-pointer transition"
          >
            Rifiuta
          </button>
          <button
            onClick={handleAccept}
            className="text-white bg-violet-800 px-4 py-1 rounded font-bold cursor-pointer  transition"
          >
            Accetta
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
