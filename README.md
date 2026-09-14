# 🎓 EduHub — Unified Academic Collaboration & Engineering Campus Platform

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61dafb.svg)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS%204.0-38bdf8.svg)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-Backend-green.svg)](https://expressjs.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-Real--Time-white.svg)](https://socket.io/)
[![Google Gemini](https://img.shields.io/badge/AI-Gemini%202.5%20Flash-orange.svg)](https://ai.google.dev/)

**EduHub** is an all-in-one collaborative digital campus ecosystem designed for engineering colleges and academic institutions. It bridges academic learning, peer mentorship, student freelance gigs, real-time interactive communications, live streaming lectures, and a multi-language cloud compilation workspace.

---

## 🚀 Key Features

### 💻 1. Multi-Language Real-Time Compiler & Sandbox
- **Native Language Execution**: Compile and execute programs on real backend runtime environments:
  - **Python 3.10**: Full standard library support.
  - **C & C++17**: Native GCC & G++ optimization, memory validation, and algorithmic benchmarking.
  - **Java 17 (OpenJDK)**: Class compilation and bytecode execution.
  - **JavaScript & TypeScript**: Native runtime execution with type stripping.
  - **SQL Engine**: In-memory SQLite with seeded campus database tables (`students`, `courses`, `enrollments`).
- **Interactive Terminal**: Captures live `stdout`, `stderr`, runtime exceptions, and execution duration in milliseconds.
- **Gemini AI Debugger**: One-click AI code inspection to explain compilation errors, diagnose logic issues, and propose fixes.

### 📚 2. Academic Resources & Curriculum Library
- **Repository Hub**: Filter lecture notes, past exam papers, lab manuals, and research publications by Year, Branch, Semester, and Subject Code.
- **Rich Media Viewer**: Built-in document viewer with video timestamp navigation and course review ratings.
- **Resource Contribution**: Peer-reviewed uploading workflow with automated metadata indexing.

### 💼 3. Student Freelance & Project Marketplace
- **Campus Gigs**: Browse vetted software development, design, tutoring, and research contracts.
- **Proposal System**: Submit bids with cover letters, portfolio links, and estimated completion timelines.
- **Escrow & Milestone Simulation**: Simulated secure milestone releases and student earnings analytics.

### 💬 4. Real-Time Messages & Collaborative Study Groups
- **Direct Messaging**: 1-on-1 private messaging with read receipts and active status indicators.
- **Project Channels & Study Circles**: Channel-based group chats with emoji reactions, pinned discussions, and member directories.
- **Campus Directory**: Search peers by skills, engineering branch, and graduation year to connect instantly.

### 🎥 5. Live Classes & Virtual Auditoriums
- **Interactive Streams**: High-definition interactive streaming rooms for faculty lectures and alumni tech-talks.
- **Live Classroom Chat & Q&A**: Real-time attendee messaging and faculty moderation.
- **Class Schedules**: Timetable filters by status (Live Now, Upcoming, Completed).

### 🤝 6. Alumni Mentorship & Office Hours
- **Verified Mentors**: Connect with alumni working at top tech firms across Software Engineering, AI, Cloud, and Product Design.
- **Session Booking**: Reserve 1-on-1 mentorship slots and mock interviews directly inside the platform.

### 🛡️ 7. Owner Control Center & Administration
- **Role-Based Access Control**: Multi-tier permissions for Students, Faculty, Alumni, and Institutional Admins.
- **Audit & Governance**: Platform moderation tools, moderation logs, user suspension/ban tracking, and system health monitors.
- **Pro Subscriptions**: Student tier verification and platform credit tracking.

---

## 🛠️ Architecture & Tech Stack

### Frontend
- **Framework**: React 18 with Vite
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS with dark/light theme switching
- **Icons**: Lucide React
- **Animations**: Motion (`motion/react`)
- **State Management**: React Context API (`AppContext`) with persistent client state

### Backend & Toolchains
- **Server**: Express.js running on Node.js
- **Real-Time Layer**: Socket.IO for duplex communication
- **Compiler Sandboxes**:
  - GCC 12 & G++ 12
  - OpenJDK 17 (`javac` / `java`)
  - Python 3.10
  - SQLite 3
- **AI Integration**: Google Gen AI SDK (`@google/genai`) powered by Gemini 2.5 Flash

---

## 📂 Project Structure

```text
├── src/
│   ├── components/
│   │   ├── CodeWorkspace/      # Code editor, terminal emulator, language selector
│   │   ├── Dashboard/          # Student home analytics, quick actions, feeds
│   │   ├── Freelance/          # Gigs marketplace, job creation, bidding
│   │   ├── LiveClasses/        # Live streaming rooms & schedule viewer
│   │   ├── Mentorship/         # Alumni directory & session booking
│   │   ├── Messages/           # Group chat & 1-on-1 direct messaging
│   │   ├── Modals/             # Modals (Profile, Gigs, Viewer, Moderation)
│   │   ├── Navigation/         # Top navbar, responsive sidebar, breadcrumbs
│   │   ├── Owner/              # Admin control center & audit logs
│   │   ├── Resources/          # Academic materials & document viewer
│   │   └── Settings/           # User preferences, appearance, account config
│   ├── context/
│   │   └── AppContext.tsx      # Central application state & API dispatchers
│   ├── mockData.ts             # Initial campus seeds, snippets & catalogs
│   ├── types.ts                # TypeScript definitions & data models
│   ├── App.tsx                 # Root layout & view routing
│   └── main.tsx                # Application bootstrap
├── server.ts                   # Express server, compiler sandboxes, API routes
├── package.json                # Dependencies & build scripts
├── vite.config.ts              # Vite bundle configuration
└── README.md                   # Project documentation
```

---

## ⚙️ Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** or **pnpm**
- *(Optional for local code compilation)*: `gcc`, `g++`, `python3`, `openjdk-17-jdk-headless`

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repo-url>
   cd eduhub
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   # Gemini AI API Key (required for AI Code Debugger & Smart Recommendations)
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   The application will be accessible at: `http://localhost:3000`

---

## 📦 Build & Production Deployment

To generate an optimized production bundle:

```bash
npm run build
```

This compiles client-side assets into `dist/` and packages the Express backend with `esbuild` into `dist/server.cjs`.

To run the production build:

```bash
npm run start
```

---

## 🔒 Security & Sandboxing Note

The code execution service executes student submissions in isolated temporary working directories with strict execution timeouts (8-second ceiling) and buffer caps. For multi-tenant production deployments at scale, wrap execution commands in containerized sandboxes such as Docker, gVisor, or Firecracker microVMs.

---

## 📄 License

This project is licensed under the **MIT License**.
