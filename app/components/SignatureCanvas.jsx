import React, { useRef, useState } from 'react';
import SignaturePad from 'react-signature-canvas';

const SignatureCanvas = ({ nextStep, prevStep, handleSignature }) => {
  const sigCanvas = useRef({});
  const [imageURL, setImageURL] = useState(null);
  
  const clear = () => {
    sigCanvas.current.clear();
    setImageURL(null);
  };
  
  const save = () => {
    const signatureData = sigCanvas.current.toDataURL('image/png');
    setImageURL(signatureData);
    handleSignature(signatureData);
  };
  
  const continua = (e) => {
    e.preventDefault();
    if (!imageURL) {
      alert('Per favore, inserisci la tua firma prima di continuare.');
      return;
    }
    nextStep();
  };
  
  const torna = (e) => {
    e.preventDefault();
    prevStep();
  };
  
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4 text-white">Inserisci la tua firma</h2>
      
      <div className="border border-gray-300 rounded mb-4">
        <SignaturePad
          ref={sigCanvas}
          canvasProps={{
            className: 'w-full h-64 bg-gray-300'
          }}
        />
      </div>
      
      <div className="flex justify-between mb-6">
        <button
          type="button"
          onClick={clear}
          className="bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Cancella
        </button>
        
        <button
          type="button"
          onClick={save}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Salva firma
        </button>
      </div>
      
      {imageURL && (
        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-2">Anteprima firma:</p>
          <img
            src={imageURL}
            alt="Firma"
            className="border border-gray-300 p-2 max-h-32 bg-gray-300"
          />
        </div>
      )}
      
      <div className="flex justify-between">
        <button
          type="button"
          onClick={torna}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Indietro
        </button>
        
        <button
          type="button"
          onClick={continua}
          className="bg-violet-500 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Avanti
        </button>
      </div>
    </div>
  );
};

export default SignatureCanvas;