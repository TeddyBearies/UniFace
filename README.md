<div align="center">
  <h1>🎓 UniFace (Haga-FaceID)</h1>
  <p><strong>Advanced Facial Recognition Attendance Management System</strong></p>
  
  <p>
    <img src="https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/React-18.2-blue?style=for-the-badge&logo=react" alt="React" />
    <img src="https://img.shields.io/badge/TypeScript-5.3-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=for-the-badge&logo=supabase" alt="Supabase" />
    <img src="https://img.shields.io/badge/Face--API.js-ML-FF6F00?style=for-the-badge" alt="Face-API.js" />
  </p>
</div>

---

## 📖 Overview

**Haga-FaceID** is a cutting-edge web application designed to streamline attendance tracking in educational institutions. By leveraging facial recognition technology (`face-api.js`), UniFace offers a seamless, secure, and modern experience for administrators, instructors, and students alike. 

The platform features tailored dashboards, robust locked-mode kiosk support for tablets, and a visually stunning, responsive interface built with modular CSS architectures.

---


## 👨‍💻 Team Members

- **Hassan** Ahmed Hassan Mousa Rasmy
- **Anas** Ayman Elsayed Abdelghaffar Hassan  
- Mohamed **Gasser** Yousry Abdelhamid Nour 
- **Ali** Rashad Ali Albakri

---

## ✨ Key Features

- 🔐 **Role-Based Workspaces**: Tailored dashboards and tools specifically designed for **Students**, **Instructors**, and **Administrators**.
- 📸 **Face-ID Attendance Kiosk**: A robust, locked-mode tablet interface that seamlessly captures student attendance via live web-camera streams.
- 🎨 **Interactive UI/UX**: Includes an interactive geometric background for the login portal, tactile hover actions, and custom brand graphics dynamically scaling across desktop and mobile devices.
- ☁️ **Supabase Integration**: Secure and rapid authentication (Email/Password) backed by a fully integrated cloud database setup.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 14](https://nextjs.org/)
- **UI Library**: [React 18](https://react.dev/)
- **Typing**: [TypeScript](https://www.typescriptlang.org/)
- **Backend & Auth**: [Supabase](https://supabase.com/)
- **Machine Learning**: [`face-api.js`](https://github.com/justadudewhohacks/face-api.js/)
- **Styling**: Modular Vanilla CSS with comprehensive fluid layout techniques (Flexbox/Grid).

---

## 🚀 Getting Started

Follow these steps to configure and run the development server locally:

### 1. Prerequisites
Ensure you have `Node.js` (v18+) and `npm` installed on your machine.

### 2. Environment Setup
You'll need a Supabase project instance to run the backend services.

1. Duplicate the example environment file:
   ```bash
   cp .env.example .env.local
   ```
2. Populate `.env.local` with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   SUPABASE_SECRET_KEY=your_service_role_key # For admin-only operations
   ```

### 3. Installation
Install the required project dependencies:
```bash
npm install
```

### 4. Running the App
Start the Next.js development server:
```bash
npm run dev
```

Navigate to `http://localhost:3000` in your web browser. *(Note: Restart the dev server whenever you modify `.env.local` changes).*

---

## 📂 Architecture & Documentation

For an in-depth look at our design decisions and setup, please review the files located in the `docs/reports/` directory.

---

<div align="center">
  <sub>Built with ❤️ by the HAGA Inc Team</sub>
</div>
