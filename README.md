# C Yashwanth — Personal Portfolio & Management System

> **"Ideas, engineered into reality."**

A full-stack, highly interactive digital portfolio environment ("The Signal") accompanied by a standalone Admin Management Panel. Built using **FastAPI**, **React**, **TypeScript**, **Supabase**, and a custom **Vanilla CSS Design System**.

---

## ⚡ The Signal Experience — Key Features

* **Interactive Environment Canvas (`SignalField`)**: A fixed GPU-accelerated `<canvas>` grid that physically distorts towards the visitor's cursor using spring physics and floating data particles.
* **Context-Aware Inertia Cursor**: Dual-element cursor (instant dot + inertia-lagged ring) that morphs dynamically with contextual labels (`VIEW`, `EXPLORE`, `OPEN`, `ENTER`).
* **Holographic Interactive Hero**: Parallax name typography and a blended, un-boxed portrait with radial mask feathering, hover technology HUD chips, and click navigation.
* **Stack Neural Visualizer**: Hovering over any technology pill dynamically maps and highlights its real-world connections across the tech stack while updating a live neural telemetry status bar.
* **Interactive Project Exploration**: 3D tilt perspective cards, tech filter tabs, and full-screen tabbed project modal (`OVERVIEW`, `SYSTEM ARCHITECTURE`, `TECHNICAL STACK`).
* **Interactive Contact Terminal Dispatch**: Built-in CLI command prompt (`> send_email`, `> fetch_resume`, `> ping_server`) in Section 06 with native Web Audio API sound telemetry cues.
* **Transmission Boot Intro & Side Radar**: Session-gated boot screen (`IntroSequence`) and right-edge vertical section progress indicator (`SideProgress`).

---

## 🏗️ Architecture & Dual Persistence Engine

* **FastAPI Backend**: Clean modular architecture supporting public read endpoints and JWT-protected admin mutation routes.
* **Dual-Persistence Sync Engine**: Implements an optimistic in-memory cache synchronized with Supabase PostgreSQL. Guarantees zero 500 errors and immediate frontend reflection even if database tables are cold.
* **Standalone Admin Panel**: Secure, dedicated dashboard for managing projects, skills, certificates, achievements, bio, and social settings.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, TypeScript, Vite, Vanilla CSS Tokens, Canvas API, Web Audio API |
| **Backend** | Python 3.11+, FastAPI, Uvicorn, Pydantic, python-jose (JWT), Passlib |
| **Database & Media** | Supabase PostgreSQL, Supabase Storage |
| **Admin Panel** | React 18, TypeScript, Vite, React Router DOM |

---

## 🚀 Quick Start & Installation

### Prerequisites
- Python 3.11+
- Node.js 18+
- npm

### 1. Clone Repository
```bash
git clone https://github.com/Yash-0209-git/yash-portfolio.git
cd yash-portfolio
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env   # Update Supabase credentials in .env
uvicorn main:app --reload --port 8000
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```
> App runs at `http://localhost:5173/`

### 4. Admin Panel Setup
```bash
cd ../admin
npm install
npm run dev
```
> Admin panel runs at `http://localhost:5174/`

---

## 📄 License & Attribution

Designed & Developed by **C Yashwanth** — AI Full Stack Developer.

* **GitHub**: [@Yash-0209-git](https://github.com/Yash-0209-git)
* **LinkedIn**: [C Yashwanth](https://www.linkedin.com/in/yashwanth-c-918a53317)
* **Email**: yashwanth02092006@gmail.com
