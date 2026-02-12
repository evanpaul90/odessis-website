# Google Sheets Form Setup

This project now submits both forms (`contact-form` and `notify-form`) to a Google Apps Script webhook.

## 1. Create the destination Sheet

1. Create a new Google Sheet.
2. Copy the spreadsheet ID from the URL:
`https://docs.google.com/spreadsheets/d/<SPREADSHEET_ID>/edit`

## 2. Deploy the Apps Script webhook

1. Open the Google Sheet.
2. Go to `Extensions` -> `Apps Script`.
3. Replace the default script with:
`/Users/evandsouza/Odessis/apps-script/odessis_forms.gs`
4. Set `SPREADSHEET_ID` in that script.
5. Click `Deploy` -> `New deployment` -> type `Web app`.
6. Configure:
`Execute as: Me`
`Who has access: Anyone`
7. Deploy and copy the generated Web app URL (ends in `/exec`).

## 3. Wire the endpoint in the website

Edit `/Users/evandsouza/Odessis/index.html` and set `data-endpoint` on both forms:

```html
<form id="notify-form" data-endpoint="https://script.google.com/macros/s/XXX/exec">
<form id="contact-form" data-endpoint="https://script.google.com/macros/s/XXX/exec">
```

You can also set a single fallback endpoint on `<body data-apps-script-endpoint="...">` if preferred.

## 4. Deploy the site

1. Commit and push to `main`.
2. Your GitHub Action deploy (`.github/workflows/deploy.yml`) will publish the update.

## 5. Verify

1. Submit the Notify form once and check `notify_subscriptions` tab.
2. Submit the Contact form once and check `contact_submissions` tab.
3. If submissions fail, open browser DevTools console and look for:
`Contact form submit failed` or `Notify form submit failed`.
