import Link from "next/link";
import React, { useState, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";

const PersonalInfo = ({ nextStep, handleChange, values }) => {
  const [captchaValue, setCaptchaValue] = useState(null);
  const recaptchaRef = useRef(null);

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isFormValid = () => {
    const { nome, email, consensoDati } = values;
    return nome && email && isValidEmail(email) && consensoDati && captchaValue;
  };

  const continua = (e) => {
    e.preventDefault();
    if (isFormValid()) {
      nextStep();
    } else {
      if (!captchaValue) {
        alert(
          "Per continuare è necessario completare il captcha e compilare tutti i campi obbligatori"
        );
      } else {
        alert(
          "Inserisci il tuo nome e acconsenti al trattamento dei miei dati personali per poter continuare"
        );
      }
    }
  };

  const handleCaptchaChange = (value) => {
    setCaptchaValue(value);
  };

  const handleCaptchaExpired = () => {
    setCaptchaValue(null);
  };

  return (
    <form>
      <p className="mb-5">Prima di compilare i campi ti consigliamo di visonare il documento <Link className="text-violet-500" href={'/docAdesione'}>cliccando qui</Link>  </p>
      <div className="mb-4">
        <label
          className="block text-white text-sm font-bold mb-2"
          htmlFor="nome"
        >
          Nome *
        </label>
        <input
          type="text"
          id="nome"
          name="nome"
          value={values.nome}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-violet-500 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Inserisci il tuo nome "
          required
        />
      </div>
      <div className="mb-4">
        <label
          className="block text-white text-sm font-bold mb-2"
          htmlFor="nome"
        >
          Cognome
        </label>
        <input
          type="text"
          id="cognome"
          name="cognome"
          value={values.cognome}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-violet-500 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Inserisci il tuo cognome"
          required
        />
      </div>
      <div className="mb-4">
        <label
          className="block text-white text-sm font-bold mb-2"
          htmlFor="luogoNascita"
        >
          Luogo di Nascita
        </label>
        <input
          type="text"
          id="luogoNascita"
          name="luogoNascita"
          value={values.luogoNascita}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-violet-500 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Inserisci il tuo luogo di nascita"
          required
        />
      </div>

      <div className="mb-4">
        <label
          className="block text-white text-sm font-bold mb-2"
          htmlFor="dataNascita"
        >
          Data di Nascita
        </label>
        <input
          type="date"
          id="dataNascita"
          name="dataNascita"
          value={values.dataNascita}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-violet-500 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>

      <div className="mb-4">
        <label
          className="block text-white text-sm font-bold mb-2"
          htmlFor="comune"
        >
          Comune di Residenza
        </label>
        <input
          type="text"
          id="comune"
          name="comune"
          value={values.comune}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-violet-500 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Inserisci il tuo comune di residenza"
          required
        />
      </div>

      <div className="mb-4">
        <label
          className="block text-white text-sm font-bold mb-2"
          htmlFor="indirizzo"
        >
          Indirizzo
        </label>
        <input
          type="text"
          id="indirizzo"
          name="indirizzo"
          value={values.indirizzo}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-violet-500 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Inserisci il tuo indirizzo"
          required
        />
      </div>

      <div className="mb-4">
        <label
          className="block text-white text-sm font-bold mb-2"
          htmlFor="cellulare"
        >
          Cellulare
        </label>
        <input
          type="tel"
          id="cellulare"
          name="cellulare"
          value={values.cellulare}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-violet-500 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Inserisci il tuo numero di cellulare"
        />
      </div>

      <div className="mb-4">
        <label
          className="block text-white text-sm font-bold mb-2"
          htmlFor="email"
        >
          Email *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={values.email}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-violet-500 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Inserisci la tua email"
          required
        />
        {values.email && !isValidEmail(values.email) && (
          <p className="text-red-500 text-xs italic mt-1">
            Inserisci un'email valida.
          </p>
        )}
      </div>

      <div className="mb-6">
        <label
          className="block text-white text-sm font-bold mb-2"
          htmlFor="professione"
        >
          Professione
        </label>
        <input
          type="text"
          id="professione"
          name="professione"
          value={values.professione}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-violet-500 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Inserisci la tua professione"
        />
      </div>

      <div className="mb-4">
        <label
          className="block text-white text-sm font-bold mb-2"
          htmlFor="luogoFirma"
        >
          Luogo (per la firma)
        </label>
        <input
          type="text"
          id="luogoFirma"
          name="luogoFirma"
          value={values.luogoFirma}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-violet-500 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Inserisci il luogo per la firma"
        />
      </div>

      <div className="mb-6">
        <label
          className="block text-white text-sm font-bold mb-2"
          htmlFor="dataFirma"
        >
          Data (per la firma)
        </label>
        <input
          type="date"
          id="dataFirma"
          name="dataFirma"
          value={values.dataFirma}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-violet-500 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>

      {/* Checkbox per il consenso al trattamento dei dati personali */}
      <div className="mb-6">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="consensoDati"
            name="consensoDati"
            checked={values.consensoDati || false}
            onChange={(e) =>
              handleChange({
                target: {
                  name: "consensoDati",
                  value: e.target.checked,
                },
              })
            }
            className="mr-2 accent-violet-500"
            required
          />
          <label className="text-white text-sm" htmlFor="consensoDati">
            Acconsento al trattamento dei miei dati personali ai sensi del GDPR
            (Regolamento UE 2016/679)
          </label>
        </div>
      </div>

      {/* reCAPTCHA */}
      <div className="mb-6">
        <label className="block text-white text-sm font-bold mb-2">
          Verifica che sei umano
        </label>
        <ReCAPTCHA
          ref={recaptchaRef}
          sitekey="6LflIg4rAAAAAMqvBbUrPAa1I6Ufwmf2yFIhCkBF"
          onChange={handleCaptchaChange}
          onExpired={handleCaptchaExpired}
          theme="dark"
          className="mb-4"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={continua}
          className="bg-violet-500 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
          disabled={!isFormValid()}
        >
          Avanti
        </button>
      </div>
    </form>
  );
};

export default PersonalInfo;
