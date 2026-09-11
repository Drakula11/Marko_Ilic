/**
 * GOOGLE SHEETS BACKEND FOR THE TRAINING APPLICATION FORM
 *
 * Recommended setup:
 * 1. Create a Google Sheet.
 * 2. Extensions -> Apps Script.
 * 3. Paste this file into Code.gs.
 * 4. Deploy -> New deployment -> Web app.
 * 5. Execute as: Me.
 * 6. Who has access: Anyone.
 * 7. Copy the /exec URL into GOOGLE_SHEETS_WEB_APP_URL in script.js.
 */

const SHEET_NAME = 'Training Applications';

function doGet() {
  return ContentService
    .createTextOutput('Training application endpoint is running.')
    .setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    const params = e && e.parameter ? e.parameter : {};

    // Honeypot spam protection: pretend success, but do not save the row.
    if (String(params.website || '').trim() !== '') {
      return ContentService.createTextOutput('OK');
    }

    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);

    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAME);
    }

    const headers = [
      'Submitted (server)',
      'Athlete name',
      'Athlete age',
      'Contact name',
      'Email',
      'Phone',
      'Preferred training',
      'Sports experience',
      'Goals / questions',
      'Consent',
      'Submitted (client)',
      'Source page'
    ];

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(headers);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
      sheet.setFrozenRows(1);
    }

    // Basic server-side validation. Keep only the fields needed for training contact.
    const required = ['athleteName', 'athleteAge', 'parentName', 'email', 'phone', 'trainingType', 'experience', 'consent'];
    const missing = required.filter((key) => !String(params[key] || '').trim());

    if (missing.length) {
      return ContentService
        .createTextOutput('Missing required fields')
        .setMimeType(ContentService.MimeType.TEXT);
    }

    sheet.appendRow([
      new Date(),
      safeCell(params.athleteName),
      safeCell(params.athleteAge),
      safeCell(params.parentName),
      safeCell(params.email),
      safeCell(params.phone),
      safeCell(params.trainingType),
      safeCell(params.experience),
      safeCell(params.message),
      safeCell(params.consent),
      safeCell(params.submittedAtClient),
      safeCell(params.source)
    ]);

    return ContentService
      .createTextOutput('OK')
      .setMimeType(ContentService.MimeType.TEXT);
  } finally {
    lock.releaseLock();
  }
}

// Prevent values beginning with =, +, -, or @ from being interpreted as formulas.
function safeCell(value) {
  const text = String(value || '').trim().slice(0, 2000);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}
