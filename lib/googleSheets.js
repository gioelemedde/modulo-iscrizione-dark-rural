import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import { getEventDateLabel } from "@/lib/eventWindow";

const SPREADSHEET_ID = "1lffxEufNHZu6bH1b-Pw5ZHMU43B_oYMVdRgowjdx20s";

export async function getMembersSheetDoc() {
  const serviceAccountAuth = new JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  const doc = new GoogleSpreadsheet(SPREADSHEET_ID, serviceAccountAuth);
  await doc.loadInfo();
  return doc;
}

export async function registraAccesso(doc, email) {
  let accessiSheet = doc.sheetsByTitle["Accessi"];

  if (!accessiSheet) {
    accessiSheet = await doc.addSheet({
      title: "Accessi",
      headerValues: ["Email", "Data", "Timestamp"],
    });
  } else {
    await accessiSheet.loadHeaderRow();
  }

  const dataEvento = getEventDateLabel();
  const timestamp = new Date().toISOString();

  const rows = await accessiSheet.getRows();
  const giaRegistrato = rows.some((row) => {
    const rowEmail = (row.get("Email") || "").toLowerCase().trim();
    return rowEmail === email.toLowerCase().trim();
  });

  if (!giaRegistrato) {
    await accessiSheet.addRow({ Email: email, Data: dataEvento, Timestamp: timestamp });
  }
}

// Previene formula/CSV injection su Google Sheets: un valore che inizia con
// = + - @ viene interpretato come formula da Sheets se non neutralizzato.
export function sanitizeForSheets(value) {
  if (typeof value !== "string") return value;
  return /^[=+\-@]/.test(value) ? `'${value}` : value;
}
