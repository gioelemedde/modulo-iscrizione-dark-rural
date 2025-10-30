import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";

export async function POST(req) {
  console.log("=== INIZIO DEBUG CHECK EMAIL ===");
  
  try {
    const { email } = await req.json();
    console.log("1. Email ricevuta:", email);

    if (!email) {
      console.log("2. Email mancante");
      return new Response(
        JSON.stringify({ message: "Email è richiesta" }),
        { status: 400 }
      );
    }

    console.log("3. Configurazione JWT...");
    
    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    console.log("4. Connessione a Google Sheet...");
    const doc = new GoogleSpreadsheet(
      "1lffxEufNHZu6bH1b-Pw5ZHMU43B_oYMVdRgowjdx20s",
      serviceAccountAuth
    );
    await doc.loadInfo();
    console.log("5. Google Sheet caricato, titolo:", doc.title);

    let sheet = doc.sheetsByTitle["Iscritti"];
    console.log("6. Foglio 'Iscritti' trovato:", !!sheet);

    if (!sheet) {
      console.log("7. Foglio non trovato, ritorno email disponibile");
      return new Response(
        JSON.stringify({ 
          exists: false, 
          message: "Email non trovata" 
        }),
        { status: 200 }
      );
    }

    console.log("8. Caricamento righe...");
    await sheet.loadHeaderRow();
    const rows = await sheet.getRows();
    console.log("9. Numero righe caricate:", rows.length);

    // Estrai tutte le email e logga per debug
    const allEmails = rows.map(row => {
      const rowEmail = row.get('Email') || row.get('email') || '';
      return rowEmail.trim();
    }).filter(email => email !== ''); 

    console.log('10. === DEBUG: Tutte le email degli iscritti ===');

    console.log('===========================================');

    console.log("11. Controllo esistenza email...");
    const emailExists = rows.some(row => {
      const rowEmail = row.get('Email') || row.get('email') || '';
      return rowEmail.toLowerCase().trim() === email.toLowerCase().trim();
    });

    console.log("12. Email exists:", emailExists);

    if (emailExists) {
      console.log("13. Email già registrata");
      return new Response(
        JSON.stringify({ 
          exists: true, 
          message: "Email già registrata nell'associazione" 
        }),
        { status: 200 }
      );
    } else {
      console.log("14. Email disponibile");
      return new Response(
        JSON.stringify({ 
          exists: false, 
          message: "Email disponibile per la registrazione" 
        }),
        { status: 200 }
      );
    }

  } catch (error) {
    console.error("=== ERRORE CATCH ===");
    console.error("Errore nel controllo email:", error);
    console.error("Stack trace:", error.stack);
    console.error("===================");
    return new Response(
      JSON.stringify({ 
        message: "Errore durante il controllo dell'email",
        error: error.message 
      }),
      { status: 500 }
    );
  }
}