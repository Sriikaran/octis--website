# Octis Marketing Website & Appointment Booking Portal

This repository contains the standalone, public-facing company marketing website and interactive demonstration booking system for the **Octis Precious Metals Software Ecosystem**.

## Products Featured
- **Octis Jewellery ERP**: Complete retail showroom operations, touch POS billing, gross/net inventory tagging, karigar job slips, and AI intelligence.
- **Pawnify**: Purpose-built gold & silver loan broker management system (Girvi) with tiered RBI LTV compliance and zero-drift simple interest engines.
- **Bulion**: Physical bullion inventory, real-time rate quotation, customer rate reservation blocks, and two-way deal settlement.

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment (Optional)
```bash
cp .env.example .env.local
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the website.

### 4. Build for Production
```bash
npm run build
npm start
```

## Architecture
- **Framework**: Next.js 14 (Pages Router)
- **UI & Styling**: React 18, Tailwind CSS, Lucide Icons, Custom Design Tokens (Octis Navy, Gold, Ivory)
- **Appointment Engine**: Next.js Serverless API routes (`/api/demo/*`) with mutex-backed concurrency protection and real-time slot generation.
- **Administration**: Built-in key-protected appointment manager at `/admin/demo-bookings`.
