import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function IscrizioneSuccess() {
  return (
    <div className="container mx-auto px-4 py-16 h-screen overflow-hidden ">
      <div className="max-w-md mx-auto bg-gray-100/10 shadow-violet-600 backdrop-blur-md rounded-lg shadow-md p-6 text-center success-animation">

        <h1 className="text-2xl font-bold mb-5 text-violet-600">Invio completato!</h1>

        <Image 
          src="/img/locandina.jpg" 
          alt="locandina" 
          width={400} 
          height={300} 
          className="mx-auto rounded-md mb-4"
        />
        
        <div className="mt-6">
          <Link 
            href="/" 
            className="inline-block bg-violet-600 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            Torna alla Home
          </Link>
        </div>
      </div>
    </div>
  );
}