# Nextudy lead endpoint

This Apps Script receives validated lead payloads from the Next.js server and writes them to `Individual Leads` and `Business Leads` tabs.

## Configure Google Apps Script

1. Create a Google Sheet, then create a standalone Apps Script project at `script.google.com`.
2. Copy `Code.gs` and `appsscript.json` into that project.
3. In **Project Settings → Script Properties**, add:
   - `API_SECRET`: a long random value.
   - `SPREADSHEET_ID`: the value between `/d/` and `/edit` in the Sheet URL.
4. If Individual and Business leads must live in different spreadsheet files, omit `SPREADSHEET_ID` and instead set `INDIVIDUAL_SPREADSHEET_ID` and `BUSINESS_SPREADSHEET_ID`.
5. Run `setupLeadSheets` once from the editor and approve the requested spreadsheet access.
6. Select **Deploy → New deployment → Web app**. Execute as yourself and allow access to anyone. Copy the `/exec` URL.

## Configure Next.js

Set these server-side environment variables locally and in the hosting provider:

```text
GOOGLE_APPS_SCRIPT_LEADS_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
GOOGLE_APPS_SCRIPT_LEADS_SECRET=the-same-value-as-API_SECRET
```

Restart the development server after changing local environment variables. Whenever `Code.gs` changes, create a new Apps Script deployment version; editing code alone does not update an existing versioned deployment.

The secret is only sent by the Next.js route and is never exposed to the browser. Do not point the browser form directly at the Apps Script URL.
