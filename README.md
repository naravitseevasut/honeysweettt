# เว็บขายน้ำผึ้ง (Landing Page + Google Sheets + Vercel)

## โครงสร้าง
```
index.html      หน้าขายของ + ฟอร์มสั่งซื้อ
admin.html      หลังร้าน: ใบหยิบ / รายการแพ็ค / จ่าหน้าพัสดุ (พิมพ์ได้)
config.js       ใส่ URL ของ Apps Script, ข้อมูลผู้ส่ง
style.css
images/         รูปสินค้า (แยกโฟลเดอร์)
apps-script/Code.gs   โค้ดฝั่ง Google Sheet
```

## 1) ตั้งค่า Google Sheet
สร้างสเปรดชีต 2 แผ่น แถวแรกเป็นหัวคอลัมน์ตามนี้พอดี

**Products**
| sku | name | size | price | stock | image | desc |
|---|---|---|---|---|---|---|
| HNY-WF-500 | น้ำผึ้งดอกไม้ป่า | 500 มล. | 220 | 50 | wildflower.svg | รสกลมกล่อม… |
| HNY-LG-500 | น้ำผึ้งดอกลำไย | 500 มล. | 260 | 40 | longan.svg | หวานหอมนุ่ม… |

**Orders**: `order_id | created_at | name | phone | address | items_json | items_text | total | status`

## 2) Apps Script
1. ในชีต เลือก Extensions → Apps Script วางโค้ดจาก `apps-script/Code.gs` แล้วเปลี่ยน `ADMIN_KEY`
2. Deploy → New deployment → Web app → Execute as: **Me**, Who has access: **Anyone**
3. คัดลอก URL ที่ลงท้าย `/exec` ไปใส่ใน `config.js` (`API_URL`)

## 3) GitHub
```
git init && git add . && git commit -m "honey shop"
git branch -M main
git remote add origin https://github.com/<user>/honey-shop.git
git push -u origin main
```
รูปสินค้าใส่ในโฟลเดอร์ `images/` แล้วระบุชื่อไฟล์ในคอลัมน์ `image`

## 4) Vercel
vercel.com → Add New Project → Import repo นี้ → Framework: **Other** → Deploy
ได้โดเมน `https://<ชื่อโปรเจกต์>.vercel.app` (หน้าหลังร้านอยู่ที่ `/admin.html`)

## วิธีใช้งานหลังร้าน
เปิด `/admin.html` ใส่รหัส → โหลดออเดอร์ →
**หยิบ** (รวมจำนวนต่อ SKU) → **แพ็ค** (ติ๊กตามออเดอร์ กด "แพ็คเสร็จแล้ว") → **จ่าหน้า** (กดพิมพ์ แล้วกด "ส่งแล้ว")
สถานะในชีต: `new` → `packed` → `shipped`

> หมายเหตุ: ADMIN_KEY เป็นการป้องกันระดับพื้นฐานสำหรับงานเรียน ถ้าใช้ขายจริงควรเพิ่มระบบล็อกอินที่แข็งแรงกว่านี้
