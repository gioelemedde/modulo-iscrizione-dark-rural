"use client"

import Image from "next/image";

// app/not-found.tsx
export default function NotFound() {
    return (
      <div className="text-center p-10 h-screen flex justify-center items-center flex-col">
        <h1 className="text-6xl font-bold text-violet-700">404</h1>
        <h2 className="text-2xl font-bold">Pagina non trovata!</h2>
        <Image
                  src="/img/404.gif" 
                  alt="locandina" 
                  width={400} 
                  height={400} 
        />
         <p className="mt-4">Hey la pagina che stai cercando non esiste </p>
      </div>
    );
  }
  