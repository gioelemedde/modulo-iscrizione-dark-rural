import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import nodemailer from "nodemailer";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";

// Funzione per salvare i dati su Google Sheets
async function saveToGoogleSheets(formData, matricola) {
  try {
    // Configurazione JWT per l'autenticazione
    const serviceAccountAuth = new JWT({
      email: "dr-iscrizione-form@dark-rural-1744103066544.iam.gserviceaccount.com",
      key:"-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDJyDPyJYb2vf7d\nUD1QLyx8Ba9iLlUPsIhJ5niCyfauKkLkr9VXMtH9LXN3gxHGn1rHiTti3bim+iiR\ngCK5b5fHiD4aff1aA4sp2mJHC29K4SgPhxYBV0IGFn8y7DAXzUiw65xrPUpwyVg2\nirGem9dOrS777ZeITusiR7GYvHefqvRVHCRA1rCPdLg+Ykq8YJmgs8tbhpsyB0gg\nNxOWOI/l0th3QZQXzmubFEz/RSqvQogAwBqHNHJFaUDcjuKeAB/uBFNXXCf/Yxl4\nu0IsPt6mAZSSUK/SG+Yg8P2jggEb2O1kRQr04iRReqywK3wcd0/cLiLNKbZ7Dg6z\nqF7rchHHAgMBAAECggEATGkhbq2SVcauCD3V8hLjHBYFC79y262kdqOteA2l+d8s\nFLCXL92hUmgPRS8foKEAvfX0RKSkw6qQiUTGIYWmKtundN3H/nnADbnSpIeqfecU\nhgjIJvrVmDuVsIFrVuAYilK2mY+MrHg6jPDpgSAPoQ4I8ELRMr974C/ZC3c3L4Ff\npRFU17A2WEZC7ih1+VtIID5sAx7qaT8Jl+Z876QJKM0WA/Yu1oZhwh69PLlfIV3r\nRtqgJYgVvXy9HTEtRkXAYjk2+JkxZJZqwymJxiv95j6ahxeO/PlGYzwVG1nHh7M8\n83e7+WaOubFa2BvanvCcBqXp2vzGwv/ZQjx5VfyTQQKBgQDrlij5ae3LrhUFzA7H\nEa1QEe0/disbLRm9cYt8NJYGE2m7Xtjslqdbhp5/xA4nEPoyCz5Fv4FiQmzJ6ENE\nfWmSAW6RDJhHaTwZVkyiCzwn2/I3h6dlKJG8b7FwOeYc2Rz6uIPv+nmpCUnl7mbD\nlkY1AXmBYRFDNyjNjfpcU/yhQQKBgQDbRC675fGYPOE4EmPPprSnf7hLEahAMQ/8\ndfISg4lUb88rhAFzqFvZM9bewePuWH5u0jwoDctx8xXaz/D2RaaVL7dJbfmITNVI\nxNVItwSkalGJ2BmWnmA2Qu/NICztD1Hnss7d2SlduI3lu/AxOHK7MAOFnk3LE5fN\n9eLz4eZpBwKBgQDNGKI9WOIj4z78GAV5e0M2JRU1nYuzkhUJn3M+w40kZvwymkUh\n25qBjPYp5yYnDpmyvaUOFcXvJEMPmDwPwVsKOGLotl1QNiaTLFV08XEChnIds+Sg\npawSr+569H0H+mBHSiHa52XJKoQCQAWJGyet98WvRDFCIiBMq+EdRiT2wQKBgQC+\nVg+jeFYiayauf/g4t2O2yv313FwLbQuNge0i+R/rNivGgI6qEYm5oHBzaigsLJGE\nLeeedWsXfYaJLVzky01xz7vxeA/Wq6uxwXvL5WOYPdqOKBL+Vnj6YVy82aNmHZhh\n4ywEFJD+FEjJFj3I3FFsAJ/uC59IG7f5R+s8/en/XQKBgQCmLcUWlrBJtWB5TocB\nbvgvBoGKXjZFdm+pzAL3C3n2RonC3iBO9Gk9KIDiHGWFgUs4pML4Jx2iA0+jK1pK\nFa29/UjcPhWv+As6f11osH3o2+OZQdrYLBM3tutlvFB4pPTtGIrADtMAUFUQMy5k\nzDNW9MODpyjuGEM3+2unF4ZLog==\n-----END PRIVATE KEY-----\n",
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    // Connessione al Google Sheet
    const doc = new GoogleSpreadsheet(
      "1lffxEufNHZu6bH1b-Pw5ZHMU43B_oYMVdRgowjdx20s",
      serviceAccountAuth
    );
    await doc.loadInfo();

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

// Versione aggiornata della tua funzione POST con integrazione Google Sheets
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

    // SALVA I DATI SU GOOGLE SHEETS
    try {
      await saveToGoogleSheets(formData, matricola);
    } catch (sheetsError) {
      console.error("Errore nel salvataggio su Google Sheets:", sheetsError);
      // Continua comunque con l'invio email anche se Google Sheets fallisce
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: "darkrural.fest@gmail.com",
      subject: `Modulo di adesione OBRESCENDI - ${
        formData.nome || "Nuovo utente"
      } - ${formData.cognome || "Cognome non specificato"} - ${matricola}`,
      text: `Modulo di adesione compilato da ${
        formData.nome || "un nuovo utente"
      }.`,
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
        message: "Modulo di adesione inviato con successo!",
        matricola: matricola,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Errore:", error);
    return new Response(
      JSON.stringify({ message: "Errore durante l'invio del modulo" }),
      { status: 500 }
    );
  }
}
