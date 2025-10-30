"use client";
import { useState } from "react";
import PersonalInfo from "../../components/PersonalInfo";
import SignatureCanvas from "../../components/SignatureCanvas";
import ReviewForm from "../../components/ReviewForm";
import EmailCheck from "../../components/EmailCheck";
import { useRouter } from "next/navigation";

export default function IscrizionePage() {
  const [step, setStep] = useState(0); // Inizia con step 0 per verifica email
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

  const [loading, setLoading] = useState(false); 

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  // Funzione chiamata dopo la verifica email
  const handleEmailVerified = (verifiedEmail) => {
    setFormData({ ...formData, email: verifiedEmail });
    setStep(1); // Vai al primo step del form
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
    setLoading(true);
  
    try {
      const response = await fetch("/api/submit-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        router.push("/iscrizione/success");
      } else {
        router.push("/iscrizione/error"); 
      }
    } catch (error) {
      console.error("Errore:", error);
      router.push("/iscrizione/error"); 
    } finally {
      setLoading(false);
    }
  };
  

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <EmailCheck onEmailVerified={handleEmailVerified} />
        );
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
            loading={loading}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 text-white">
      {step === 0 ? (
        // Step 0: Solo verifica email, layout semplice
        <div className="flex justify-center items-center min-h-screen">
          {renderStep()}
        </div>
      ) : (
        // Steps 1-3: Layout completo con progress bar
        <div className="max-w-md mx-auto bg-gray-100/10 backdrop-blur-lg rounded-lg shadow-md p-6 shadow-violet-400 min-h-screen">
          <h1 className="text-2xl font-bold text-center mb-6 text-white">
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
          {renderStep()}
        </div>
      )}
    </div>
  );
}