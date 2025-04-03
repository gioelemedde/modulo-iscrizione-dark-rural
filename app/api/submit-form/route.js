import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const formData = await req.json();

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]);
    const { width, height } = page.getSize();

    const now = new Date();
    const dateStr = now.toISOString().split("T")[0].replace(/-/g, "");
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const matricola = `MAT-${dateStr}-${randomNum}`;

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
    page.drawText(`Firma:`, { x: 400, y, size: 8, font });
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
      } - ${matricola}`,
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

    return new Response(
      JSON.stringify({ message: "Modulo di adesione inviato con successo!" }),
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

function formatDate(dateString) {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  } catch (e) {
    return dateString;
  }
}
