import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
    
      {/* Colonna sinistra - Contenuto con sfondo nero */}
      <div className="w-full lg:w-2/5 bg-black flex flex-col justify-center px-6 md:px-12 relative">
  
        {/* Logo in alto */}
        <div className="absolute top-4 left-[50%] md:top-6 translate-x-[-50%]">
          <Image
            src="/img/logo.png"
            alt="logo"
            width={150}
            height={150}
      
          />
        </div>

        <div className="text-white mt-28 lg:mt-0 py-10">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
            Benvenuto in<br/>OBRESCENDI
          </h1>
          
          <p className="text-lg md:text-xl text-gray-300 mb-6 md:mb-8 leading-relaxed">
           lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>

          <div className="space-y-4">
            <Link
              href="/iscrizione"
              className="block w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 md:py-4 px-6 md:px-8 rounded-lg transition-colors text-center text-base md:text-lg"
            >
              Inizia Iscrizione
            </Link>
            
            {/* <Link
              href="/schedule"
              className="block w-full border-2 border-violet-600 hover:bg-violet-600 text-violet-400 hover:text-white font-bold py-3 md:py-4 px-6 md:px-8 rounded-lg transition-colors text-center text-base md:text-lg"
            >
              Vedi Programma
            </Link> */}
          </div>
        </div>
      </div>

      {/* Colonna destra - Immagine grande */}
      <div className="w-full lg:w-3/5 relative min-h-[60vh] lg:min-h-screen overflow-hidden">
        <Image
          src="/img/bizio.jpg"
          alt="Immagine principale"
          fill
          className="object-cover object-center"
          priority
        />
        
        {/* Overlay gradiente */}
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-black/20 rounded-none lg:rounded-bl-3xl"></div>
      </div>
    </div>
  );
}
