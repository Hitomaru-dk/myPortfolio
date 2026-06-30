# Portfolio Website (Bilingual TH/EN)

เว็บไซต์ Portfolio สำหรับ Frontend Developer / UX-UI Designer ธีมเข้มสไตล์ปุ่มหน้าปัดเครื่องวัดหุ่นยนต์ (Nu Gundam HUD & Cockpit Aesthetic) รันด้วย React + Vite + TypeScript + Tailwind CSS (v4) ในฝั่ง Frontend และ Express + Prisma + PostgreSQL (Docker) ในฝั่ง Backend มีระบบหลังบ้าน (Admin CRUD) สำหรับใช้ในการจัดการโปรเจกต์ต่าง ๆ

---

## 🛠️ โครงสร้างระบบ (Monorepo)

*   `client/` — Frontend (React + Vite + Tailwind CSS v4)
*   `server/` — Backend API (Express + Prisma + PostgreSQL)

---

## 🚀 ขั้นตอนการติดตั้งและเริ่มใช้งาน (Quick Start)

### 1. รัน Database (Docker PostgreSQL)
โปรเจกต์นี้ใช้ PostgreSQL บน Docker ในการเก็บข้อมูลโปรเจกต์ โดยผูกข้อมูลไว้กับ Docker Volume ชื่อ `myportfolio` เพื่อป้องกันข้อมูลสูญหาย

รันคำสั่งนี้เพื่อสร้าง Container และ Volume ใหม่:
```bash
docker run -d --name myportfolio-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=portfolio \
  -v myportfolio:/var/lib/postgresql/data \
  -p 5432:5432 \
  postgres:16-alpine
```

### 2. รันส่วนหลังบ้าน (Backend Server)
1. เปิด Terminal ใหม่แล้วเข้าไปที่โฟลเดอร์ `server`:
   ```bash
   cd server
   ```
2. ทำการตั้งค่าฐานข้อมูลกับ Prisma (ทำเฉพาะครั้งแรกที่รัน หรือเมื่อมีการเปลี่ยน Schema):
   ```bash
   npx prisma db push
   ```
3. สั่งรัน Backend Server:
   ```bash
   npm run dev
   ```
   *เซิร์ฟเวอร์หลังบ้านจะเปิดทำงานที่: `http://localhost:3001`*

### 3. รันส่วนหน้าบ้าน (Frontend Client)
1. เปิด Terminal อีกอันหนึ่งแล้วเข้าไปที่โฟลเดอร์ `client`:
   ```bash
   cd client
   ```
2. สั่งรัน Frontend:
   ```bash
   npm run dev
   ```
   *เซิร์ฟเวอร์หน้าบ้านจะเปิดทำงานที่: `http://localhost:5173`*

---

## 🔐 ระบบจัดการข้อมูลโปรเจกต์ (Admin Mode)

การเพิ่มและลบโปรเจกต์ในหน้า **"ผลงาน (Projects)"** สามารถทำได้เฉพาะเมื่อเข้าสู่ระบบในฐานะผู้ดูแล (Owner) เท่านั้น:

1. เข้าไปที่หน้าล็อกอินลับ (Unlisted Route): `http://localhost:5173/owner-login`
2. กรอกรหัสผ่านเพื่อเข้าใช้งาน: **`admin`**
   *(สามารถแก้ไขรหัสผ่านนี้ได้ในไฟล์ `server/.env` ตรงช่อง `ADMIN_PASSWORD`)*
3. เมื่อเข้าสู่ระบบสำเร็จ จะเห็นปุ่ม **`+ Add Project`** และปุ่มถังขยะสำหรับลบโปรเจกต์ปรากฏขึ้นมาบนหน้าเว็บทันที

---

## ✏️ การแก้ไขข้อมูลส่วนตัวของคุณ

คุณสามารถเข้าไปแก้ไขประวัติ ช่องทางติดต่อ และทักษะส่วนตัวของคุณได้โดยตรงที่ไฟล์:
*   **ข้อมูลส่วนตัวทั้งหมด:** [AboutPage.tsx](file:///d:/Work/Project/myWeb/myPortfolio/client/src/pages/AboutPage.tsx) (ดูตัวแปร `contactInfo`, `socials`, `skills`, `tools` และ `certifications` ที่ด้านบนของไฟล์)
*   **ข้อความภาษาไทย/อังกฤษ:** [locales/th.json](file:///d:/Work/Project/myWeb/myPortfolio/client/src/i18n/locales/th.json) และ [locales/en.json](file:///d:/Work/Project/myWeb/myPortfolio/client/src/i18n/locales/en.json)
