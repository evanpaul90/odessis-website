/**
 * Odessis form webhook for Google Sheets.
 *
 * 1) Create a Google Sheet.
 * 2) Copy this file into Extensions > Apps Script.
 * 3) Set SPREADSHEET_ID below.
 * 4) Deploy as Web app:
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5) Paste the Web app URL into data-endpoint on both forms in index.html.
 */
const SPREADSHEET_ID = '199FF9-xhb-bBeORHhdJfh_dhYsS43MKzQVAnubMrjZw';
const CONTACT_SHEET_NAME = 'contact_submissions';
const NOTIFY_SHEET_NAME = 'notify_subscriptions';

function doPost(e) {
  try {
    const payload = parsePayload_(e);
    const formType = String(payload.form_type || '').toLowerCase();

    if (formType === 'contact') {
      writeContactSubmission_(payload);
    } else if (formType === 'notify') {
      writeNotifySubmission_(payload);
    } else {
      writeUnknownSubmission_(payload);
    }

    return jsonResponse_({ ok: true });
  } catch (error) {
    return jsonResponse_({ ok: false, error: String(error) });
  }
}

function parsePayload_(e) {
  const payload = {};
  const params = (e && e.parameter) || {};

  Object.keys(params).forEach(function (key) {
    payload[key] = params[key];
  });

  if (
    e &&
    e.postData &&
    e.postData.contents &&
    e.postData.type &&
    e.postData.type.indexOf('application/json') !== -1
  ) {
    const jsonPayload = JSON.parse(e.postData.contents);
    Object.keys(jsonPayload).forEach(function (key) {
      payload[key] = jsonPayload[key];
    });
  }

  if (!payload.submitted_at) {
    payload.submitted_at = new Date().toISOString();
  }

  return payload;
}

function writeContactSubmission_(payload) {
  const headers = [
    'submitted_at',
    'form_type',
    'name',
    'email',
    'project_type',
    'message',
    'page_url',
    'referrer',
    'user_agent'
  ];
  appendRow_(CONTACT_SHEET_NAME, headers, payload);
}

function writeNotifySubmission_(payload) {
  const headers = [
    'submitted_at',
    'form_type',
    'email',
    'page_url',
    'referrer',
    'user_agent'
  ];
  appendRow_(NOTIFY_SHEET_NAME, headers, payload);
}

function writeUnknownSubmission_(payload) {
  const headers = ['submitted_at', 'form_type', 'raw_payload'];
  const enriched = {
    submitted_at: payload.submitted_at || new Date().toISOString(),
    form_type: payload.form_type || 'unknown',
    raw_payload: JSON.stringify(payload)
  };
  appendRow_('unknown_submissions', headers, enriched);
}

function appendRow_(sheetName, headers, payload) {
  const sheet = getOrCreateSheet_(sheetName);
  ensureHeaders_(sheet, headers);

  const row = headers.map(function (header) {
    const value = payload[header];
    return value == null ? '' : String(value);
  });
  sheet.appendRow(row);
}

function getOrCreateSheet_(sheetName) {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
  }
  return sheet;
}

function ensureHeaders_(sheet, headers) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    return;
  }

  const existing = sheet
    .getRange(1, 1, 1, headers.length)
    .getValues()[0]
    .map(function (value) {
      return String(value || '').trim();
    });

  const missingHeader = headers.some(function (header, index) {
    return existing[index] !== header;
  });

  if (missingHeader) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  }
}

function jsonResponse_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON
  );
}
