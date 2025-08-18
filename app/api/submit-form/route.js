import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import nodemailer from "nodemailer";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";

// Funzione per salvare i dati su Google Sheets
async function saveToGoogleSheets(formData, matricola) {
  try {
    // Verifica che le variabili d'ambiente siano configurate
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL) {
      throw new Error("GOOGLE_SERVICE_ACCOUNT_EMAIL non configurata");
    }
    if (!process.env.GOOGLE_PRIVATE_KEY) {
      throw new Error("GOOGLE_PRIVATE_KEY non configurata");
    }
    if (!process.env.GOOGLE_SHEET_ID) {
      throw new Error("GOOGLE_SHEET_ID non configurata");
    }

    console.log("Tentativo di autenticazione con:", process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL);

    // Configurazione JWT per l'autenticazione
    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    // Test dell'autenticazione prima di procedere
    try {
      await serviceAccountAuth.authorize();
      console.log("Autenticazione JWT riuscita");
    } catch (authError) {
      console.error("Errore di autenticazione JWT:", authError);
      throw new Error(`Autenticazione fallita: ${authError.message}`);
    }

    // Connessione al Google Sheet
    const doc = new GoogleSpreadsheet(
      process.env.GOOGLE_SHEET_ID,
      serviceAccountAuth
    );
    
    try {
      await doc.loadInfo();
      console.log(`Connesso al documento: ${doc.title}`);
    } catch (loadError) {
      console.error("Errore nel caricamento del documento:", loadError);
      throw new Error(`Impossibile accedere al foglio di calcolo: ${loadError.message}`);
    }

    // Cerca il foglio "Iscritti" o crealo se non esiste
    let sheet = doc.sheetsByTitle["Iscritti"];

    // Definisci le intestazioni necessarie
    const requiredHeaders = [
      "Matricola",
      "Data Iscrizione",
      "Nome",
      "Cognome",
      "Genere",
      "Data di Nascita",
      "Luogo di Nascita",
      "Comune di Residenza",
      "Indirizzo",
      "Cellulare",
      "Email",
      "Professione",
      "Luogo Firma",
      "Data Firma",
      "Timestamp",
    ];

    // Se il foglio non esiste, crealo
    if (!sheet) {
      console.log("Creazione nuovo foglio 'Iscritti'");
      sheet = await doc.addSheet({
        title: "Iscritti",
        headerValues: requiredHeaders,
      });
    } else {
      // Carica le intestazioni esistenti
      await sheet.loadHeaderRow();

      // Se il foglio esiste ma è vuoto, aggiungi le intestazioni
      if (
        sheet.rowCount === 0 ||
        !sheet.headerValues ||
        sheet.headerValues.length === 0
      ) {
        console.log("Aggiunta intestazioni al foglio esistente");
        await sheet.setHeaderRow(requiredHeaders);
      } else {
        // Controlla se mancano delle colonne e aggiungile se necessario
        const existingHeaders = sheet.headerValues;
        const missingHeaders = requiredHeaders.filter(
          (header) => !existingHeaders.includes(header)
        );

        if (missingHeaders.length > 0) {
          // Aggiungi le colonne mancanti
          const newHeaders = [...existingHeaders, ...missingHeaders];
          await sheet.setHeaderRow(newHeaders);
          console.log(
            `Aggiunte colonne mancanti: ${missingHeaders.join(", ")}`
          );
        }
      }
    }

    // Prepara i dati da inserire
    const rowData = {
      Matricola: matricola,
      "Data Iscrizione": new Date().toLocaleDateString("it-IT"),
      Nome: formData.nome || "",
      Cognome: formData.cognome || "",
      Genere: formData.genere || "",
      "Data di Nascita": formData.dataNascita
        ? formatDate(formData.dataNascita)
        : "",
      "Luogo di Nascita": formData.luogoNascita || "",
      "Comune di Residenza": formData.comune || "",
      Indirizzo: formData.indirizzo || "",
      Cellulare: formData.cellulare || "",
      Email: formData.email || "",
      Professione: formData.professione || "",
      "Luogo Firma": formData.luogoFirma || formData.comune || "",
      "Data Firma": formData.dataFirma
        ? formatDate(formData.dataFirma)
        : formatDate(new Date().toISOString().split("T")[0]),
      Timestamp: new Date().toISOString(),
    };

    // Aggiungi la riga al foglio
    await sheet.addRow(rowData);

    console.log(`Dati salvati su Google Sheets per matricola: ${matricola}`);
    return { success: true, matricola };
  } catch (error) {
    console.error("Errore nel salvataggio su Google Sheets:", error);
    throw new Error(`Errore Google Sheets: ${error.message}`);
  }
}

// Funzione di utilità per formattare le date
function formatDate(dateString) {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  } catch (e) {
    return dateString;
  }
}

// Versione aggiornata della funzione POST con migliore gestione degli errori
export async function POST(req) {
  try {
    const formData = await req.json();

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]);
    const { width, height } = page.getSize();

    const now = new Date();
    const dateStr = now.toISOString().slice(2, 10).replace(/-/g, "");
    const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
    const matricola = `${dateStr}-${randomStr}`;

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    page.drawText(`Matricola: ${matricola}`, {
      x: 50,
      y: height - 30,
      size: 8,
      font: boldFont,
      color: rgb(0.2, 0.2, 0.2),
    });

    page.drawText(
      "MODULO PER LA RICHIESTA DI ADESIONE IN QUALITÀ DI ADERENTE",
      {
        x: 50,
        y: height - 50,
        size: 9,
        font: boldFont,
      }
    );

    page.drawText("Al Presidente", { x: 50, y: height - 70, size: 8, font });
    page.drawText("FABRIZIO SANNA", { x: 50, y: height - 85, size: 8, font });
    page.drawText("dell'Associazione OBRESCENDI", {
      x: 50,
      y: height - 100,
      size: 8,
      font,
    });

    let genere = formData.genere || "o";

    const getValueOrUnderscore = (value, length = 15) =>
      value && value.trim() !== "" ? value : "_".repeat(length);

    let y = height - 130;
    page.drawText(
      `Il sottoscritto/a ${getValueOrUnderscore(
        formData.nome
      )} ${getValueOrUnderscore(formData.cognome)},`,
      { x: 50, y, size: 8, font }
    );
    y -= 15;
    page.drawText(
      `nato/a a ${getValueOrUnderscore(
        formData.luogoNascita
      )}, il ${getValueOrUnderscore(formatDate(formData.dataNascita), 10)}`,
      { x: 50, y, size: 8, font }
    );
    y -= 15;
    page.drawText(
      `Residente a ${getValueOrUnderscore(
        formData.comune
      )}, Via ${getValueOrUnderscore(formData.indirizzo)},`,
      { x: 50, y, size: 8, font }
    );
    y -= 15;
    page.drawText(
      `Cellulare: ${getValueOrUnderscore(formData.cellulare, 10)},`,
      { x: 50, y, size: 8, font }
    );
    y -= 15;
    page.drawText(`Email: ${getValueOrUnderscore(formData.email, 20)},`, {
      x: 50,
      y,
      size: 8,
      font,
    });
    y -= 15;
    page.drawText(
      `Professione: ${getValueOrUnderscore(formData.professione, 15)}`,
      { x: 50, y, size: 8, font }
    );

    // Dichiarazioni
    const bulletPoints = [
      "avendo preso visione dello Statuto e dei Regolamenti dell'Associazione;",
      "condividendo la democraticità della struttura e la gratuità delle cariche associative;",
      "consapevole della gratuità delle prestazioni fornite dagli aderenti;",
      "dichiarando di assumersi responsabilità civile e penale per eventuali danni causati;",
    ];

    y -= 20;
    bulletPoints.forEach((point) => {
      page.drawText(`- ${point}`, { x: 50, y, size: 8, font });
      y -= 15;
    });

    // Richiesta di adesione
    y -= 10;
    page.drawText("CHIEDE", { x: 250, y, size: 9, font: boldFont });
    y -= 20;
    page.drawText(
      "Di essere iscritto/a all'associazione di volontariato OBRESCENDI.",
      { x: 50, y, size: 8, font }
    );
    y -= 15;
    page.drawText("Distinti saluti", { x: 50, y, size: 8, font });

    // Luogo, Data e Firma
    y -= 20;
    page.drawText(
      `Luogo: ${getValueOrUnderscore(
        formData.luogoFirma || formData.comune,
        15
      )}`,
      { x: 50, y, size: 8, font }
    );
    page.drawText("Firma:", { x: 400, y, size: 8, font });
    y -= 15;
    page.drawText(
      `Data: ${getValueOrUnderscore(
        formData.dataFirma ||
          formatDate(new Date().toISOString().split("T")[0]),
        10
      )}`,
      { x: 50, y, size: 8, font }
    );

    // Firma dell'utente
    if (formData.firma) {
      const imgData = formData.firma.split(",")[1];
      const signatureImage = await pdfDoc.embedPng(
        Buffer.from(imgData, "base64")
      );

      page.drawImage(signatureImage, {
        x: 400,
        y: y - 50,
        width: 120,
        height: 40,
      });
    }

    const pdfBytes = await pdfDoc.save();

    // SALVA I DATI SU GOOGLE SHEETS CON GESTIONE ERRORI MIGLIORATA
    let sheetsSuccess = false;
    try {
      await saveToGoogleSheets(formData, matricola);
      sheetsSuccess = true;
      console.log("Salvataggio su Google Sheets completato con successo");
    } catch (sheetsError) {
      console.error("Errore nel salvataggio su Google Sheets:", sheetsError);
      console.error("Dettagli errore:", {
        message: sheetsError.message,
        stack: sheetsError.stack,
        cause: sheetsError.cause
      });
      // Continua comunque con l'invio email anche se Google Sheets fallisce
    }

    const transporter = nodemailer.createTransporter({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email all'organizzazione
    const emailSubject = `Modulo di adesione OBRESCENDI - ${
      formData.nome || "Nuovo utente"
    } - ${formData.cognome || "Cognome non specificato"} - ${matricola}${
      sheetsSuccess ? "" : " [ATTENZIONE: Non salvato su Google Sheets]"
    }`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: "darkrural.fest@gmail.com",
      subject: emailSubject,
      text: `Modulo di adesione compilato da ${
        formData.nome || "un nuovo utente"
      }.${
        sheetsSuccess 
          ? "\n\nI dati sono stati salvati correttamente su Google Sheets." 
          : "\n\nATTENZIONE: I dati NON sono stati salvati su Google Sheets a causa di un errore di configurazione. Verificare le credenziali Google."
      }`,
      attachments: [
        {
          filename: `modulo_adesione_${(formData.nome || "utente").replace(
            /\s+/g,
            "_"
          )}.pdf`,
          content: Buffer.from(pdfBytes),
        },
      ],
    });

    // Invio anche all'utente che ha inserito la propria email
    if (formData.email) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: formData.email,
        subject: `Copia del tuo modulo di adesione OBRESCENDI - ${matricola}`,
        text: `Gentile ${formData.nome || "utente"},

in allegato trovi la copia del modulo di adesione che hai appena compilato per l'associazione OBRESCENDI.

Grazie per la tua richiesta!

Cordiali saluti,
Associazione OBRESCENDI`,
        attachments: [
          {
            filename: `modulo_adesione_${(formData.nome || "utente").replace(
              /\s+/g,
              "_"
            )}.pdf`,
            content: Buffer.from(pdfBytes),
          },
        ],
      });
    }

    return new Response(
      JSON.stringify({
        message: sheetsSuccess 
          ? "Modulo di adesione inviato con successo!" 
          : "Modulo di adesione inviato con successo! (Nota: errore nel salvataggio su Google Sheets)",
        matricola: matricola,
        sheetsSuccess: sheetsSuccess
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Errore:", error);
    return new Response(
      JSON.stringify({ 
        message: "Errore durante l'invio del modulo",
        error: error.message 
      }),
      { status: 500 }
    );
  }
}