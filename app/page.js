import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col lg:flex-row bg-home">
    
      <div className="w-full backdrop-blur-sm lg:w-2/5 min-h-screen bg-gradient-to-br from-[#06000d]/85 via-gray-950/85 to-gray-900/85 flex flex-col justify-center px-6 md:px-12 relative ">

        <div className="absolute top-8 left-[50%] md:top-6 translate-x-[-50%]">
          <Image
            src="/img/logo.png"
            alt="logo"
            width={200}
            height={200}
            className="white-filter"
            
          />
        </div>
 
        <div className="text-white mt-2 lg:mt-0 py-10">
          <h1 className="text-4xl  lg:text-5xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-violet-600 to-violet-400 bg-clip-text text-transparent">
            Benvenuto in<br/>OBRESCENDI
          </h1>

          <p className="text-lg md:text-xl text-gray-300 mb-6 md:mb-8 leading-relaxed">
            Diventa membro della nostra associazione per poter partecipare ai nostri eventi .
          </p>

          <div className="space-y-4">
           
            
            <Link
              href="/iscrizione"
              className="block w-full border-2 border-violet-600 hover:bg-transparent bg-violet-600 hover:text-violet-600 text-white font-bold py-3 md:py-4 px-6 md:px-8 rounded-lg transition-colors text-center text-base md:text-lg"
            >
              Iscrizione
            </Link> 
          </div>
        </div>
      </div>

      
    </div>
  );
}
