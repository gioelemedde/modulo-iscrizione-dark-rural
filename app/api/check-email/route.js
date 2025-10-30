import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";

export async function POST(req) {
  console.log("=== INIZIO DEBUG CHECK EMAIL ===");
  
  try {
    const { email } = await req.json();


    if (!email) {
      return new Response(
        JSON.stringify({ message: "Email è richiesta" }),
        { status: 400 }
      );
    }


    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const doc = new GoogleSpreadsheet(
      "1lffxEufNHZu6bH1b-Pw5ZHMU43B_oYMVdRgowjdx20s",
      serviceAccountAuth
    );
    await doc.loadInfo();


    let sheet = doc.sheetsByTitle["Iscritti"];
  

    if (!sheet) {
   
      return new Response(
        JSON.stringify({ 
          exists: false, 
          message: "Email non trovata" 
        }),
        { status: 200 }
      );
    }

    await sheet.loadHeaderRow();
    const rows = await sheet.getRows();
  

    const allEmails = rows.map(row => {
      const rowEmail = row.get('Email') || row.get('email') || '';
      return rowEmail.trim();
    }).filter(email => email !== ''); 

    console.log("11. Controllo esistenza email...");
    const emailExists = rows.some(row => {
      const rowEmail = row.get('Email') || row.get('email') || '';
      return rowEmail.toLowerCase().trim() === email.toLowerCase().trim();
    });


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

    return new Response(
      JSON.stringify({ 
        message: "Errore durante il controllo dell'email",
        error: error.message 
      }),
      { status: 500 }
    );
  }
}