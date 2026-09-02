var INDIVIDUAL_SHEET_NAME = "Individual Leads";
var BUSINESS_SHEET_NAME = "Business Leads";

var INDIVIDUAL_HEADERS = [
  "Submitted At",
  "First Name",
  "Last Name",
  "Email",
  "WhatsApp",
  "Product / Service Interest",
  "Needs"
];

var BUSINESS_HEADERS = [
  "Submitted At",
  "Contact Name",
  "Company Name",
  "Work Email",
  "Phone / WhatsApp",
  "Programs of Interest",
  "Team Size",
  "Training Requirements"
];

function doGet() {
  return jsonResponse_({ status: "success", service: "nextudy-leads", version: 1 });
}

function doPost(event) {
  try {
    if (!event || !event.postData || !event.postData.contents) {
      throw new Error("Missing request body.");
    }

    var payload = JSON.parse(event.postData.contents);
    verifySecret_(payload.apiSecret);

    var row;
    var sheet;

    if (payload.inquiryType === "Individual") {
      validateIndividual_(payload);
      sheet = getDestinationSheet_("INDIVIDUAL_SPREADSHEET_ID", INDIVIDUAL_SHEET_NAME, INDIVIDUAL_HEADERS);
      row = [
        new Date(),
        safeCell_(payload.firstName),
        safeCell_(payload.lastName),
        safeCell_(payload.email),
        safeCell_(payload.whatsapp),
        safeCell_(payload.productInterest),
        safeCell_(payload.needs)
      ];
    } else if (payload.inquiryType === "Business") {
      validateBusiness_(payload);
      sheet = getDestinationSheet_("BUSINESS_SPREADSHEET_ID", BUSINESS_SHEET_NAME, BUSINESS_HEADERS);
      row = [
        new Date(),
        safeCell_(payload.contactName),
        safeCell_(payload.companyName),
        safeCell_(payload.workEmail),
        safeCell_(payload.phone),
        safeCell_(payload.programsOfInterest.join(", ")),
        safeCell_(payload.teamSize),
        safeCell_(payload.requirements)
      ];
    } else {
      throw new Error("Unknown inquiry type.");
    }

    var lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      sheet.appendRow(row);
    } finally {
      lock.releaseLock();
    }

    return jsonResponse_({ status: "success", service: "nextudy-leads", version: 1 });
  } catch (error) {
    console.error(error);
    return jsonResponse_({ status: "error", message: String(error.message || error) });
  }
}

// Run this once after setting the Script Properties. It creates both tabs and
// their header rows. The two spreadsheet IDs may point to the same file.
function setupLeadSheets() {
  getDestinationSheet_("INDIVIDUAL_SPREADSHEET_ID", INDIVIDUAL_SHEET_NAME, INDIVIDUAL_HEADERS);
  getDestinationSheet_("BUSINESS_SPREADSHEET_ID", BUSINESS_SHEET_NAME, BUSINESS_HEADERS);
}

function getDestinationSheet_(propertyName, sheetName, headers) {
  var properties = PropertiesService.getScriptProperties();
  var spreadsheetId = properties.getProperty(propertyName) || properties.getProperty("SPREADSHEET_ID");
  if (!spreadsheetId) {
    throw new Error(propertyName + " is not configured.");
  }

  var spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  var sheet = spreadsheet.getSheetByName(sheetName) || spreadsheet.insertSheet(sheetName);

  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");
    sheet.autoResizeColumns(1, headers.length);
  }

  return sheet;
}

function verifySecret_(providedSecret) {
  var expectedSecret = PropertiesService.getScriptProperties().getProperty("API_SECRET");
  if (!expectedSecret || typeof providedSecret !== "string" || providedSecret !== expectedSecret) {
    throw new Error("Unauthorized.");
  }
}

function validateIndividual_(payload) {
  requiredText_(payload.firstName, 80, "firstName");
  requiredText_(payload.lastName, 80, "lastName");
  email_(payload.email, "email");
  phone_(payload.whatsapp, "whatsapp");
  requiredText_(payload.productInterest, 180, "productInterest");
  optionalText_(payload.needs, 750, "needs");
}

function validateBusiness_(payload) {
  requiredText_(payload.contactName, 120, "contactName");
  requiredText_(payload.companyName, 180, "companyName");
  email_(payload.workEmail, "workEmail");
  phone_(payload.phone, "phone");

  if (!Array.isArray(payload.programsOfInterest) || payload.programsOfInterest.length < 1 ||
      payload.programsOfInterest.length > 12) {
    throw new Error("Invalid programsOfInterest.");
  }
  payload.programsOfInterest.forEach(function (program) {
    requiredText_(program, 180, "programsOfInterest");
  });

  requiredText_(payload.teamSize, 80, "teamSize");
  optionalText_(payload.requirements, 750, "requirements");
}

function requiredText_(value, maxLength, fieldName) {
  if (typeof value !== "string" || !value.trim() || value.trim().length > maxLength) {
    throw new Error("Invalid " + fieldName + ".");
  }
}

function optionalText_(value, maxLength, fieldName) {
  if (typeof value !== "string" || value.length > maxLength) {
    throw new Error("Invalid " + fieldName + ".");
  }
}

function email_(value, fieldName) {
  requiredText_(value, 180, fieldName);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
    throw new Error("Invalid " + fieldName + ".");
  }
}

function phone_(value, fieldName) {
  if (typeof value !== "string" || !/^\+?[\d\s().-]{7,24}$/.test(value.trim())) {
    throw new Error("Invalid " + fieldName + ".");
  }
}

// Prevent values beginning with formula operators from executing in Sheets.
function safeCell_(value) {
  var text = String(value == null ? "" : value).trim();
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function jsonResponse_(body) {
  return ContentService
    .createTextOutput(JSON.stringify(body))
    .setMimeType(ContentService.MimeType.JSON);
}
