import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Success() {
  return (
    <div className="container mx-auto px-4 py-16 h-screen">
      <div className="max-w-md mx-auto bg-gray-100/10 shadow-violet-600 backdrop-blur-md rounded-lg shadow-md p-6 text-center">

        <h1 className="text-2xl font-bold mb-5 text-violet-600">Invio completato!</h1>

        <Image 
          src="/img/locandina.jpg" 
          alt="locandina" 
          width={400} 
          height={300} 
          className="mx-auto rounded-md mb-4"
        />
      </div>
    </div>
  );
}
