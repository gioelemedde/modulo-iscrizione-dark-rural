"use client"

import Image from "next/image";
import Link from "next/link";

export default function Error() {
    return (
      <div className="text-center p-10 h-screen flex justify-center items-center flex-col">
        <h1 className="text-5xl font-bold text-violet-700">OPS</h1>
        <h2 className="text-xl mb-2 ">Qualcosa e' andato storto </h2>
        <Image
                  src="/img/bizio2.jpg" 
                  alt="locandina" 
                  width={400} 
                  height={400} 
                  className=" rounded-2xl shadow-md shadow-violet-600"
        />
         <p className="mt-4">Consolati con un'immagine del presidente, oppure <Link className=" underline text-violet-600" href={'/'}>Torna alla Home</Link> </p>
      </div>
    );
  }
  