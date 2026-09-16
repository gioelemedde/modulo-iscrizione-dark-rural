import { getMembersSheetDoc, registraAccesso } from "@/lib/googleSheets";
import { isWithinEventWindow } from "@/lib/eventWindow";
import { isValidEmail } from "@/lib/validation";

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email || !isValidEmail(email)) {
      return new Response(
        JSON.stringify({ message: "Email non valida" }),
        { status: 400 }
      );
    }

    const doc = await getMembersSheetDoc();
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

    const emailExists = rows.some(row => {
      const rowEmail = row.get('Email') || row.get('email') || '';
      return rowEmail.toLowerCase().trim() === email.toLowerCase().trim();
    });

    if (emailExists) {
      if (isWithinEventWindow()) {
        try {
          await registraAccesso(doc, email);
        } catch (accessError) {
          console.error("Errore durante la registrazione dell'accesso:", accessError);
        }
      }

      return new Response(
        JSON.stringify({
          exists: true,
          message: "Email già registrata nell'associazione"
        }),
        { status: 200 }
      );
    } else {
      return new Response(
        JSON.stringify({
          exists: false,
          message: "Email disponibile per la registrazione"
        }),
        { status: 200 }
      );
    }

  } catch (error) {
    console.error("Errore nel controllo email:", error);
    return new Response(
      JSON.stringify({
        message: "Errore durante il controllo dell'email",
        error: error.message
      }),
      { status: 500 }
    );
  }
}
