// Google Apps Script — ผูกกับ Google Sheet (Extensions > Apps Script)
// ชีต 2 แผ่น:
//  Products: sku | name | size | price | stock | image | desc
//  Orders:   order_id | created_at | name | phone | address | items_json | items_text | total | status
const ADMIN_KEY = "เปลี่ยนรหัสนี้"; // รหัสเข้าหน้า admin

function sheet_(name) { return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name); }
function rows_(name) {
  const v = sheet_(name).getDataRange().getValues();
  const h = v.shift();
  return v.filter(r => r[0] !== "").map(r => Object.fromEntries(h.map((k, i) => [k, r[i]])));
}
function json_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }

function doGet(e) {
  const a = e.parameter.action;
  if (a === "products") return json_(rows_("Products"));
  if (a === "orders") {
    if (e.parameter.key !== ADMIN_KEY) return json_({ error: "unauthorized" });
    return json_(rows_("Orders").map(o => ({ ...o, items: JSON.parse(o.items_json) })));
  }
  return json_({ ok: true });
}

function doPost(e) {
  const d = JSON.parse(e.postData.contents);
  const lock = LockService.getScriptLock(); lock.waitLock(10000);
  try {
    if (d.action === "create") {
      const prods = rows_("Products"), ps = sheet_("Products");
      const items = d.items.filter(i => i.qty > 0).map(i => {
        const p = prods.find(x => x.sku === i.sku);
        if (!p) throw new Error("ไม่พบสินค้า " + i.sku);
        if (p.stock < i.qty) throw new Error(p.name + " เหลือไม่พอ");
        return { sku: p.sku, name: p.name + " " + p.size, qty: i.qty, price: p.price };
      });
      if (!items.length) throw new Error("ยังไม่ได้เลือกสินค้า");
      items.forEach(i => {
        const r = prods.findIndex(x => x.sku === i.sku) + 2;
        ps.getRange(r, 5).setValue(prods.find(x => x.sku === i.sku).stock - i.qty);
      });
      const id = "ORD" + Utilities.formatDate(new Date(), "Asia/Bangkok", "yyMMddHHmmss");
      const total = items.reduce((s, i) => s + i.qty * i.price, 0);
      sheet_("Orders").appendRow([id, new Date(), d.name, "'" + d.phone, d.address,
        JSON.stringify(items), items.map(i => i.sku + " x" + i.qty).join(", "), total, "new"]);
      return json_({ ok: true, order_id: id, total });
    }
    if (d.action === "status") {
      if (d.key !== ADMIN_KEY) return json_({ error: "unauthorized" });
      const os = sheet_("Orders"), ids = os.getRange(1, 1, os.getLastRow(), 1).getValues().flat();
      const r = ids.indexOf(d.order_id) + 1;
      if (r < 2) throw new Error("ไม่พบออเดอร์");
      os.getRange(r, 9).setValue(d.status);
      return json_({ ok: true });
    }
    throw new Error("unknown action");
  } catch (err) { return json_({ error: String(err.message || err) }); }
  finally { lock.releaseLock(); }
}
