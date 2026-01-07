const { google } = require('googleapis');

// Google Sheets configuration
const SPREADSHEET_ID = '1g2PfRZ_7GEEdkDZsleC9kq57IDoWmP4m3O2bBOZnGf0';
const SHEET_NAME = 'Leads'; // Sheet tab name

const auth = new google.auth.GoogleAuth({
  keyFile: 'service-account-key.json', // Replace with your service account key path
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

async function appendToGoogleSheet(leadData) {
  try {
    const row = [
      new Date().toISOString(), // Timestamp
      leadData.name,
      leadData.email,
      leadData.phone,
      leadData.requirements,
      leadData.status
    ];

    const resource = {
      values: [row]
    };

    const result = await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:F`,
      valueInputOption: 'USER_ENTERED',
      resource: resource,
    });

    console.log('✅ Data added to Google Sheets:', result.data);
    return true;
  } catch (error) {
    console.error('❌ Error adding to Google Sheets:', error.message);
    return false;
  }
}

module.exports = { appendToGoogleSheet };
