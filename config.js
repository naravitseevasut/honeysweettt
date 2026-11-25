// แก้ค่าตรงนี้หลัง Deploy Apps Script
const CONFIG = {
  API_URL: "PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE",
  IMAGE_BASE: "images/",           // โฟลเดอร์รูปบน GitHub
  SHOP_NAME: "น้ำผึ้งบ้านสวน",
  SENDER: { name: "ร้านน้ำผึ้งบ้านสวน", phone: "08x-xxx-xxxx", address: "99 หมู่ 1 ต.ตัวอย่าง อ.เมือง จ.เชียงใหม่ 50000" },
  // ใช้แสดงผลเมื่อยังไม่ต่อ Google Sheet (สำรอง)
  FALLBACK_PRODUCTS: [
    { sku: "HNY-WF-500", name: "น้ำผึ้งดอกไม้ป่า", size: "500 มล.", price: 220, stock: 50, image: "wildflower.svg", desc: "รสกลมกล่อม กลิ่นดอกไม้ป่า เก็บจากรังเลี้ยงในสวนผลไม้" },
    { sku: "HNY-LG-500", name: "น้ำผึ้งดอกลำไย", size: "500 มล.", price: 260, stock: 40, image: "longan.svg", desc: "หวานหอมนุ่ม สีอำพันเข้ม เก็บช่วงลำไยออกดอก" }
  ]
};
