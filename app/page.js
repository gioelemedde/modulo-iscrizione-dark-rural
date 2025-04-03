"use client";
import { useState } from "react";
import PersonalInfo from "./components/PersonalInfo";
import SignatureCanvas from "./components/SignatureCanvas";
import ReviewForm from "./components/ReviewForm";
import { useRouter } from "next/navigation";

export default function Home() {
  const [step, setStep] = useState(1);
  const router = useRouter();
  const [formData, setFormData] = useState({
    nome: "",
    cognome: "",
    luogoNascita: "",
    dataNascita: "",
    comune: "",
    indirizzo: "",
    cellulare: "",
    email: "",
    professione: "",
    luogoFirma: "",
    dataFirma: "",
    firma: null,
  });

  const [loading, setLoading] = useState(false); // Stato per il caricamento

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSignature = (signatureData) => {
    setFormData({ ...formData, firma: signatureData });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true); // Imposta loading a true quando inizia l'invio

    try {
      const response = await fetch("/api/submit-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/success");
      } else {
        console.error("Errore nell'invio del form");
      }
    } catch (error) {
      console.error("Errore:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <PersonalInfo
            nextStep={nextStep}
            handleChange={handleChange}
            values={formData}
          />
        );
      case 2:
        return (
          <SignatureCanvas
            nextStep={nextStep}
            prevStep={prevStep}
            handleSignature={handleSignature}
          />
        );
      case 3:
        return (
          <ReviewForm
            prevStep={prevStep}
            values={formData}
            handleSubmit={handleSubmit}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto bg-gray-100/10 backdrop-blur-lg rounded-lg shadow-md p-6 shadow-violet-400 min-h-screen">
        <h1 className="text-2xl font-bold text-center mb-6">
          Iscrizione OBRESCENDI
        </h1>
        <div className="mb-6">
          <div className="flex items-center">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex-1">
                <div
                  className={`h-2 ${
                    item <= step ? "bg-violet-500" : "bg-gray-300"
                  }`}
                ></div>
                <div className="text-center mt-2 text-sm">
                  {item === 1 && "Dati"}
                  {item === 2 && "Firma"}
                  {item === 3 && "Revisione"}
                </div>
              </div>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center">
            <div role="status">
              <svg
                aria-hidden="true"
                className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-violet-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ) : (
          renderStep()
        )}
      </div>
    </div>
  );
}
