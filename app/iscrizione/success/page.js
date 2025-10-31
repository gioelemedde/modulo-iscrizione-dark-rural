import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function IscrizioneSuccess() {
  return (
    <div className="container mx-auto px-4 pt-10 h-screen overflow-hidden ">
      <div className="max-w-md mx-auto mb-0 bg-gray-100/10 shadow-violet-600 backdrop-blur-md rounded-lg shadow-md px-4 py-4 text-center success-animation">

        <h1 className="text-2xl font-bold mb-5 text-violet-600">Invio completato</h1>

        <Image 
          src="/img/locandina.webp" 
          alt="locandina" 
          width={400} 
          height={300} 
          className="mx-auto rounded-md mb-2"
        />
      </div>
    </div>
  );
}