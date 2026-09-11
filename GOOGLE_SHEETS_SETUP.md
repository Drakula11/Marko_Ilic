# Google Sheets connection

The website is ready to submit the youth training form to Google Sheets. The only part that cannot be hard-coded in advance is your own Google Apps Script deployment URL.

## 1. Create the spreadsheet

Create a new Google Sheet in the Google account that should own the applications. You do **not** need to create columns manually; the script creates them on the first valid submission.

## 2. Add the Apps Script backend

In the spreadsheet open:

**Extensions -> Apps Script**

Delete the starter code and paste the content of `google-apps-script.gs` into `Code.gs`, then save.

## 3. Deploy it as a Web App

In Apps Script choose:

**Deploy -> New deployment -> Web app**

Use:

- **Execute as:** Me
- **Who has access:** Anyone

Authorize the script when Google asks. Then copy the URL ending in `/exec`.

## 4. Connect the website

Open `script.js` and replace:

```js
const GOOGLE_SHEETS_WEB_APP_URL = "PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE";
```

with your `/exec` URL, for example:

```js
const GOOGLE_SHEETS_WEB_APP_URL = "https://script.google.com/macros/s/ABC123/exec";
```

Upload the updated website to the hosting server.

## 5. Test

Submit one test application from the live site. A sheet named **Training Applications** should appear automatically and receive the row.

## Privacy note for youth applications

The form deliberately collects only basic athlete/training details plus a parent/guardian contact. Avoid adding medical records, government IDs, school records or other unnecessary sensitive information to a public website form. Restrict spreadsheet access to people who actually need to manage training inquiries.
