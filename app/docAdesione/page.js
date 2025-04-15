import Image from "next/image";
import Link from "next/link";

function Doc() {
  return (
    <div className="w-full min-h-screen flex justify-center items-center flex-col p-5">
      <Image
        src="/img/adesione.jpg"
        alt="locandina"
        width={500}
        height={500}
        className=" rounded-2xl shadow-md shadow-violet-600"
      />
      <a href="doc/statuto.pdf" download className="mt-2 text-center">
        Se desideri visionare e scaricare lo statuto <span className="text-violet-600">clicca qui</span> 
      </a>

      <button className="bg-violet-600 mt-8 md:mt-5 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline cursor-pointer disabled:cursor-not-allowed disabled:opacity-40">
        <Link href={"/"}>Torna alla Firma</Link>
      </button>
    </div>
  );
}

export default Doc;
