import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";

// Funzione per registrare l'accesso nella tab "Accessi"
async function registraAccesso(doc, email) {
  console.log("Registrazione accesso per:", email);
  
  // Cerca il foglio "Accessi" o crealo se non esiste
  let accessiSheet = doc.sheetsByTitle["Accessi"];
  
  if (!accessiSheet) {
    console.log("Creazione foglio 'Accessi'...");
    accessiSheet = await doc.addSheet({
      title: "Accessi",
      headerValues: ["Email", "Data", "Timestamp"],
    });
  } else {
    await accessiSheet.loadHeaderRow();
  }
  
  const oggi = "23/12/2025"; // Data fissa evento
  const timestamp = new Date().toISOString();
  
  // Carica le righe esistenti per verificare se l'email è già presente
  const rows = await accessiSheet.getRows();
  
  // Controlla se esiste già un record per questa email
  const accessoOggi = rows.some(row => {
    const rowEmail = (row.get('Email') || '').toLowerCase().trim();
    return rowEmail === email.toLowerCase().trim();
  });
  
  // Se non esiste già, aggiungilo
  if (!accessoOggi) {
    await accessiSheet.addRow({
      Email: email,
      Data: oggi,
      Timestamp: timestamp,
    });
    console.log("Accesso registrato per:", email, "del giorno:", oggi);
  } else {
    console.log("Accesso già registrato oggi per:", email);
  }
}

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
      
      // Registra l'accesso nella tab "Accessi"
      try {
        await registraAccesso(doc, email);
      } catch (accessError) {
        console.error("Errore durante la registrazione dell'accesso:", accessError);
        // Non blocchiamo il flusso principale se fallisce la registrazione dell'accesso
      }
      
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