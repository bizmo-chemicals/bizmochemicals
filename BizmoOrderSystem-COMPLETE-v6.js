/******************************************************************
 * BIZMO ORDER SYSTEM — COMPLETE Code.gs (v8)
 *
 * Paste this ENTIRE file into your new Apps Script project
 * (bizmochemicalsily@gmail.com), replacing everything.
 *
 * Contains:
 *  - Your sheet connection (BIZMO DATA / Order Details)
 *  - Routed doGet (website COD + WhatsApp lead logging)
 *  - doPost (backward compatible)
 *  - generateOrderId (sequential, with timestamped website IDs)
 *  - getOrderSheet, saveOrder
 *  - Email alerts for COD orders AND WhatsApp leads
 *  - My Orders lookup (getOrder action)
 *
 * AFTER PASTING:
 *  1. Deploy → New deployment → Web app
 *     Execute as: Me | Who has access: Anyone → Deploy
 *  2. Run bizmoAuthEmail() once → complete the permission popup
 *  3. Deploy → Manage deployments → pencil → New version → Deploy
 ******************************************************************/

const SPREADSHEET_ID = "1vy_k_tuOHl7HGsD0OYD8txh05gN4Twazn2rL66dQtTU";
const SHEET_NAME = "Order Details";
const BIZMO_TIMEZONE = "Asia/Kolkata";
const START_ORDER_NUMBER = 101;

/* ==================== ROUTED doGet ==================== */
function doGet(e) {
  const action = (e && e.parameter && e.parameter.action) || "";
  if (action === "placeCodOrder")   return bizmoPlaceCodOrder(e);
  if (action === "logWhatsappLead") return bizmoLogWhatsappLead(e);
  if (action === "getOrder")        return bizmoGetOrder(e);
  return ContentService
    .createTextOutput("Bizmo Order API is running")
    .setMimeType(ContentService.MimeType.TEXT);
}

/* ==================== doPost (backward compat) ==================== */
function doPost(e) {
  let data;
  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: "bad_request" }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  try {
    const result = saveOrder(data);
    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/* ==================== GENERATE ORDER ID ==================== */
function generateOrderId() {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const props = PropertiesService.getScriptProperties();
    const todayStr = Utilities.formatDate(new Date(), BIZMO_TIMEZONE, "yyMMdd");
    const key = "BIZMO_ORDER_SEQ_" + todayStr;
    let seq = Number(props.getProperty(key) || START_ORDER_NUMBER - 1) + 1;
    props.setProperty(key, String(seq));
    const orderId = "BZ-" + todayStr + "-" + seq;
    return { success: true, orderId: orderId };
  } finally {
    lock.releaseLock();
  }
}

/* ==================== GET ORDER SHEET ==================== */
function getOrderSheet() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheets = ss.getSheets();
  const want = String(SHEET_NAME).trim().toLowerCase();
  for (let i = 0; i < sheets.length; i++) {
    if (String(sheets[i].getName()).trim().toLowerCase() === want) {
      return sheets[i];
    }
  }
  const availableNames = sheets.map(function(sheet) {
    return "[" + sheet.getName() + "]";
  }).join(", ");
  throw new Error(
    'Sheet "' + SHEET_NAME + '" not found. Available sheets: ' + availableNames
  );
}

/* ==================== SAVE ORDER ==================== */
function saveOrder(data) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const sheet = getOrderSheet();

    const orderId = String(data.orderId || "").trim();
    if (!orderId) {
      throw new Error("Order ID is missing.");
    }

    /* prevent duplicates */
    const lastRow = sheet.getLastRow();
    if (lastRow >= 2) {
      const orderIds = sheet.getRange(2, 1, lastRow - 1, 1)
        .getValues()
        .flat()
        .map(function(id) { return String(id).trim(); });
      if (orderIds.includes(orderId)) {
        return { success: true, alreadySaved: true, orderId: orderId };
      }
    }

    const now = new Date();
    const date = Utilities.formatDate(now, BIZMO_TIMEZONE, "dd-MM-yyyy");
    const time = Utilities.formatDate(now, BIZMO_TIMEZONE, "HH:mm:ss");

    /* Columns: Order ID, Date, Time, Name, Mobile, Address,
       City, Pincode, Items, Total, Payment, Status */
    sheet.appendRow([
      data.orderId || "",
      date,
      time,
      data.name || "",
      data.mobile || "",
      data.address || "",
      data.city || "",
      data.pincode || "",
      data.items || "",
      data.total || "",
      data.payment || "",
      "Confirmed"
    ]);

    SpreadsheetApp.flush();

    return {
      success: true,
      alreadySaved: false,
      orderId: data.orderId
    };
  } finally {
    lock.releaseLock();
  }
}

/* ==================== BIZMO WEBSITE FUNCTIONS (v6) ==================== */

/* JSONP reply helper (the website reads Apps Script via JSONP) */
function bizmoJsonpReply(e, obj) {
  let cb = (e && e.parameter && e.parameter.callback) || "callback";
  cb = String(cb).replace(/[^a-zA-Z0-9_$]/g, "");
  return ContentService
    .createTextOutput(cb + "(" + JSON.stringify(obj) + ");")
    .setMimeType(ContentService.MimeType.JAVASCRIPT);
}

/* Server-side abuse check. Takes an OPEN sheet (speed).
   Columns: 1=orderId 2=date 3=time 4=name 5=mobile
   6=address 7=city 8=pincode 9=items 10=total */
function bizmoCheckAbuse(sheet, mobile, itemsText, total, address) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return { ok: true };

  const rows = sheet.getRange(2, 1, lastRow - 1, 10).getValues();
  const todayStr = Utilities.formatDate(new Date(), BIZMO_TIMEZONE, "dd-MM-yyyy");
  const nowMs = Date.now();
  let phoneCount = 0;

  for (let r = 0; r < rows.length; r++) {
    const row = rows[r];
    if (String(row[1]).trim() !== todayStr) continue;
    if (String(row[4]).trim() !== mobile) continue;
    phoneCount++;
    if (String(row[8]) === itemsText &&
        Number(row[9]) === Number(total) &&
        String(row[5]).trim() === String(address).trim()) {
      const ts = bizmoRowTimeMs(row[1], row[2]);
      if (ts && (nowMs - ts) < 30 * 60000) {
        return { ok: false, reason: "duplicate" };
      }
    }
  }
  if (phoneCount >= 3) return { ok: false, reason: "limit_phone" };
  return { ok: true };
}

function bizmoRowTimeMs(dateStr, timeStr) {
  try {
    const dp = String(dateStr).split("-");
    const tp = String(timeStr).split(":");
    return new Date(dp[2], dp[1] - 1, dp[0],
                    tp[0] || 0, tp[1] || 0, tp[2] || 0).getTime();
  } catch (e) { return 0; }
}

/* Timestamped order ID like BZ-261011-162345-128 */
function bizmoMakeOrderId() {
  const seqFull = generateOrderId().orderId;
  const seq = String(seqFull).split("-").pop();
  const now = new Date();
  const dp = Utilities.formatDate(now, BIZMO_TIMEZONE, "yyMMdd");
  const tp = Utilities.formatDate(now, BIZMO_TIMEZONE, "HHmmss");
  return "BZ-" + dp + "-" + tp + "-" + seq;
}

/* Set Status column. Takes an OPEN sheet. */
function bizmoSetStatus(sheet, orderId, status) {
  try {
    const lastCol = sheet.getLastColumn();
    const headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
    let col = -1;
    for (let i = 0; i < headers.length; i++) {
      if (String(headers[i]).trim().toLowerCase() === "status") { col = i + 1; break; }
    }
    if (col < 0) {
      col = lastCol + 1;
      sheet.getRange(1, col).setValue("Status");
    }
    const lastRow = sheet.getLastRow();
    if (lastRow < 2) return;
    const ids = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
    for (let r = 0; r < ids.length; r++) {
      if (String(ids[r][0]).trim() === String(orderId).trim()) {
        sheet.getRange(r + 2, col).setValue(status);
        return;
      }
    }
  } catch (err) {}
}

/* ---- COD order from the website (pincode 630702 only) ---- */
function bizmoPlaceCodOrder(e) {
  let p;
  try { p = JSON.parse(e.parameter.payload || "{}"); }
  catch (err) { return bizmoJsonpReply(e, { ok: false, reason: "bad_payload" }); }

  const name    = String(p.name || "").trim();
  const mobile  = String(p.mobile || "").trim();
  const address = String(p.address || "").trim();
  const city    = String(p.city || "").trim();
  const pin     = String(p.pincode || "").trim();
  const total   = Number(p.total) || 0;
  const itemsText = String(p.items || "");

  if (!name || !/^[6-9]\d{9}$/.test(mobile) ||
      !address || !city || pin !== "630702" || !itemsText) {
    return bizmoJsonpReply(e, { ok: false, reason: "invalid" });
  }

  let sheet;
  try { sheet = getOrderSheet(); }
  catch (err) { return bizmoJsonpReply(e, { ok: false, reason: "server_error" }); }

  const abuse = bizmoCheckAbuse(sheet, mobile, itemsText, total, address);
  if (!abuse.ok) return bizmoJsonpReply(e, { ok: false, reason: abuse.reason });

  let orderId;
  try { orderId = bizmoMakeOrderId(); }
  catch (err) { return bizmoJsonpReply(e, { ok: false, reason: "server_error" }); }

  try {
    saveOrder({
      orderId: orderId, name: name, mobile: mobile,
      address: address, city: city, pincode: pin,
      items: itemsText, total: total, payment: "Cash on Delivery"
    });
  } catch (err) {
    return bizmoJsonpReply(e, { ok: false, reason: "server_error" });
  }

  try {
    MailApp.sendEmail(
      "bizmochemicalsily@gmail.com",
      "New COD Order " + orderId + " — Rs." + total,
      [
        "New Cash on Delivery order placed on the Bizmo website.", "",
        "Order ID : " + orderId,
        "Name     : " + name,
        "Mobile   : " + mobile,
        "Address  : " + address + ", " + city + " - " + pin, "",
        "Items:", itemsText, "",
        "Total (COD): Rs." + total, "",
        "Please call/WhatsApp the customer to confirm before packing."
      ].join("\n")
    );
  } catch (err) {}

  return bizmoJsonpReply(e, { ok: true, orderId: orderId });
}

/* ---- WhatsApp "Yes, sent" tap -> lead row + email ---- */
function bizmoLogWhatsappLead(e) {
  let p;
  try { p = JSON.parse(e.parameter.payload || "{}"); }
  catch (err) { return bizmoJsonpReply(e, { ok: false, reason: "bad_payload" }); }

  const mobile = String(p.mobile || "").trim();
  if (!/^[6-9]\d{9}$/.test(mobile)) {
    return bizmoJsonpReply(e, { ok: false, reason: "invalid" });
  }

  let sheet;
  try { sheet = getOrderSheet(); }
  catch (err) { return bizmoJsonpReply(e, { ok: false, reason: "server_error" }); }

  let orderId;
  try { orderId = bizmoMakeOrderId(); }
  catch (err) { return bizmoJsonpReply(e, { ok: false, reason: "server_error" }); }

  try {
    saveOrder({
      orderId: orderId,
      name: String(p.name || "").trim(),
      mobile: mobile,
      address: String(p.address || "").trim(),
      city: String(p.city || "").trim(),
      pincode: String(p.pincode || "").trim(),
      items: String(p.items || ""),
      total: Number(p.total) || 0,
      payment: "Online"
    });
  } catch (err) {
    return bizmoJsonpReply(e, { ok: false, reason: "server_error" });
  }

  bizmoSetStatus(sheet, orderId, "Pending");

  try {
    MailApp.sendEmail(
      "bizmochemicalsily@gmail.com",
      "New WhatsApp Lead " + orderId + " — Rs." + (Number(p.total) || 0),
      [
        "A customer confirmed sending a WhatsApp order enquiry.", "",
        "Lead ID  : " + orderId,
        "Name     : " + String(p.name || "").trim(),
        "Mobile   : " + mobile,
        "Address  : " + String(p.address || "").trim() + ", " +
                      String(p.city || "").trim() + " - " +
                      String(p.pincode || "").trim(), "",
        "Items:", String(p.items || ""), "",
        "Total: Rs." + (Number(p.total) || 0), "",
        "Status in sheet: Pending (payment: Online).",
        "Check WhatsApp (8072381426) for their message, then confirm."
      ].join("\n")
    );
  } catch (err) {}

  return bizmoJsonpReply(e, { ok: true, orderId: orderId });
}

/* Format a sheet cell: Date objects -> readable string, else trimmed string */
function bizmoFmtCell(v, fmt) {
  try {
    if (Object.prototype.toString.call(v) === "[object Date]" && !isNaN(v.getTime())) {
      return Utilities.formatDate(v, BIZMO_TIMEZONE, fmt || "dd-MM-yyyy");
    }
  } catch (e) {}
  return String(v == null ? "" : v).trim();
}

/* ---- My Orders lookup: orderId + mobile must match ---- */
function bizmoGetOrder(e) {
  const orderId = String((e.parameter && e.parameter.orderId) || "").trim();
  const mobile  = String((e.parameter && e.parameter.mobile) || "").trim();

  if (!orderId || !/^[6-9]\d{9}$/.test(mobile)) {
    return bizmoJsonpReply(e, { ok: false, reason: "invalid" });
  }

  let sheet;
  try { sheet = getOrderSheet(); }
  catch (err) { return bizmoJsonpReply(e, { ok: false, reason: "server_error" }); }

  const lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    return bizmoJsonpReply(e, { ok: false, reason: "not_found" });
  }

  /* Columns: 1=orderId 2=date 3=time 4=name 5=mobile 6=address
     7=city 8=pincode 9=items 10=total 11=payment 12=status */
  const lastCol = sheet.getLastColumn();
  const headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  let statusCol = 12;
  for (let i = 0; i < headers.length; i++) {
    if (String(headers[i]).trim().toLowerCase() === "status") { statusCol = i + 1; break; }
  }
  const width = Math.max(12, statusCol);
  const rows = sheet.getRange(2, 1, lastRow - 1, width).getValues();

  for (let r = 0; r < rows.length; r++) {
    const row = rows[r];
    if (String(row[0]).trim() === orderId &&
        String(row[4]).trim() === mobile) {
      return bizmoJsonpReply(e, {
        ok: true,
        order: {
          orderId: bizmoFmtCell(row[0]),
          date: bizmoFmtCell(row[1], "dd-MM-yyyy"),
          time: bizmoFmtCell(row[2], "HH:mm:ss"),
          name: bizmoFmtCell(row[3]),
          mobile: bizmoFmtCell(row[4]),
          address: bizmoFmtCell(row[5]),
          city: bizmoFmtCell(row[6]),
          pincode: bizmoFmtCell(row[7]),
          items: String(row[8] == null ? "" : row[8]),
          total: Number(row[9]) || 0,
          payment: bizmoFmtCell(row[10]),
          status: bizmoFmtCell(row[statusCol - 1]) || "Confirmed"
        }
      });
    }
  }
  return bizmoJsonpReply(e, { ok: false, reason: "not_found" });
}

/* ---- Run once to authorize Gmail ---- */
function bizmoAuthEmail() {
  MailApp.sendEmail("bizmochemicalsily@gmail.com",
    "Bizmo auth test", "Gmail is now authorized.");
}
