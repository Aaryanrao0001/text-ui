<div align="center">

# 🔐 CyberChat

### End-to-End Encrypted Messaging Platform

[![React](https://img. shields.io/badge/React-19.2.0-61DAFB? style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6? style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![License](https://img. shields.io/badge/License-MIT-green? style=for-the-badge)](LICENSE)

<p align="center">
  <strong>A sleek, cyberpunk-themed secure messaging application with real-time chat capabilities</strong>
</p>

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Usage](#-usage) • [Tech Stack](#-tech-stack) • [Contributing](#-contributing)

---

</div>

## ✨ Features

<table>
<tr>
<td>

### 🔒 Security First
- **End-to-End Encryption** - All messages are encrypted before transmission
- **ID-Based Authentication** - Secure login using unique user IDs
- **No Password Storage** - Your ID is your key

</td>
<td>

### 💬 Real-Time Chat
- **Instant Messaging** - Send and receive messages in real-time
- **Read Receipts** - Know when your messages are delivered
- **Typing Indicators** - See when contacts are typing

</td>
</tr>
<tr>
<td>

### 🎨 Modern UI/UX
- **Cyberpunk Theme** - Stunning neon-glow aesthetic
- **Smooth Animations** - Powered by Framer Motion
- **Responsive Design** - Works on desktop and mobile

</td>
<td>

### 🔍 Smart Features
- **Search by ID** - Find and add contacts using their unique ID
- **Command Palette** - Quick actions with `Ctrl+K`
- **Email Notifications** - Get notified of new messages

</td>
</tr>
</table>

---

## 🎬 Demo

<div align="center">

### Login Screen
```
┌─────────────────────────────────────┐
│           🔐 Secure Chat            │
│     End-to-end encrypted messaging  │
│                                     │
│     ┌─────────────────────────┐     │
│     │ Enter your User ID      │     │
│     └─────────────────────────┘     │
│                                     │
│          [ Login ]                  │
│            ── or ──                 │
│     [ Create New Account ]          │
└─────────────────────────────────────┘
```

### Chat Interface
```
┌──────────────────────────────────────────────────────┐
│  🔐 CyberChat                    🔒 End-to-End       │
├─────────────┬────────────────────────────────────────┤
│  Contacts   │  💬 Chat with Alice                    │
│  ─────────  │  ────────────────────────────────────  │
│  🟢 Alice   │                                        │
│  🟢 Bob     │    ┌─────────────────────┐             │
│  ⚫ Charlie │    │ Hey!  How are you?   │  10:30 AM  │
│             │    └─────────────────────┘             │
│             │                                        │
│             │         ┌─────────────────────┐        │
│             │         │ I'm great, thanks!  │ 10:31  │
│             │         └─────────────────────┘        │
│             │  ────────────────────────────────────  │
│             │  [ Type a message...           ] [Send] │
└─────────────┴────────────────────────────────────────┘
```

</div>

---

## 🚀 Installation

### Prerequisites

- **Node.js** 18+ 
- **npm** or **yarn**
- **Python** 3.9+ (for backend)

### Frontend Setup

```bash
# Clone the repository
git clone https://github.com/Aaryanrao0001/text-ui.git

# Navigate to project directory
cd text-ui

# Install dependencies
npm install

# Start development server
npm run dev
```

### Backend Setup

```bash
# Navigate to backend directory
cd app

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the server
uvicorn main:app --reload
```

---

## 📖 Usage

### Creating an Account

1. Open the app and click **"Create New Account"**
2. Enter your name
3. **Important:** Copy and save your unique ID! 
4. Click **"Proceed to Chat"**

### Logging In

1.  Enter your unique User ID
2.  Click **"Login"**
3.  Start chatting! 

### Adding Contacts

1.  Use the search bar in the sidebar
2. Enter the contact's User ID
3. Click **"Add Contact"**
4. Start a conversation! 

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + K` | Open Command Palette |
| `Ctrl + N` | Add New Contact |
| `Ctrl + J` | Jump to Chat |
| `Enter` | Send Message |

---

## 🛠 Tech Stack

<div align="center">

| Frontend | Backend | Tools |
|----------|---------|-------|
| ![React](https://img.shields.io/badge/-React-61DAFB? style=flat-square&logo=react&logoColor=black) | ![FastAPI](https://img.shields.io/badge/-FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white) | ![Vite](https://img.shields.io/badge/-Vite-646CFF?style=flat-square&logo=vite&logoColor=white) |
| ![TypeScript](https://img.shields. io/badge/-TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white) | ![Python](https://img.shields.io/badge/-Python-3776AB?style=flat-square&logo=python&logoColor=white) | ![ESLint](https://img.shields.io/badge/-ESLint-4B32C3?style=flat-square&logo=eslint&logoColor=white) |
| ![Framer Motion](https://img. shields.io/badge/-Framer_Motion-0055FF?style=flat-square&logo=framer&logoColor=white) | ![SQLAlchemy](https://img.shields.io/badge/-SQLAlchemy-D71F00?style=flat-square&logo=sqlalchemy&logoColor=white) | ![Git](https://img. shields.io/badge/-Git-F05032?style=flat-square&logo=git&logoColor=white) |

</div>

---

## 📁 Project Structure

```
text-ui/
├── 📂 src/
│   ├── 📂 api/              # API client functions
│   ├── 📂 components/       # React components
│   │   ├── 📂 Header/
│   │   ├── 📂 Sidebar/
│   │   ├── 📂 Conversation/
│   │   ├── 📂 LoginModal/
│   │   └── 📂 CommandPalette/
│   ├── 📂 context/          # React Context (App State)
│   ├── 📂 types/            # TypeScript types
│   ├── 📄 App.tsx           # Main App component
│   ├── 📄 App.css           # Global styles
│   └── 📄 main.tsx          # Entry point
├── 📂 app/                  # Backend (Python/FastAPI)
│   ├── 📄 main.py           # API endpoints
│   ├── 📄 crud.py           # Database operations
│   ├── 📄 models.py         # SQLAlchemy models
│   ├── 📄 schemas.py        # Pydantic schemas
│   └── 📄 crypto.py         # Encryption utilities
├── 📄 package.json
├── 📄 vite.config.ts
└── 📄 README.md
```

---

## 🔐 Security

CyberChat takes security seriously:

- 🔒 **End-to-End Encryption** - Messages are encrypted using modern cryptographic algorithms
- 🆔 **ID-Based Auth** - No passwords stored, your unique ID is your secure key
- 🚫 **No Data Mining** - We don't read, analyze, or sell your messages
- 📧 **Email Alerts** - Get notified of important messages (optional)

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2.  **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5.  **Open** a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

<div align="center">

**Goutam Kumar**

[![GitHub](https://img. shields.io/badge/-GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Aaryanrao0001)

</div>

---

<div align="center">

### ⭐ Star this repo if you find it helpful! 

<p>Made with ❤️ and lots of ☕</p>

</div>
