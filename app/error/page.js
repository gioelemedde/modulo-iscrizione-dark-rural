"use client"

import Image from "next/image";

export default function Error() {
    return (
      <div className="text-center p-10 h-screen flex justify-center items-center flex-col">
        <h1 className="text-6xl font-bold text-violet-700">OPS</h1>
        <h2 className="text-2xl font-bold mb-2">Qualcosa e' andato storto </h2>
        <Image
                  src="/img/bizio2.jpg" 
                  alt="locandina" 
                  width={400} 
                  height={400} 
        />
         <p className="mt-4">Consolati con un'immagine del presidente </p>
      </div>
    );
  }
  