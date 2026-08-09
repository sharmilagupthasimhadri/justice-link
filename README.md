# ⚖️ JusticeLink – AI Legal Guidance Platform for Indian Citizens

![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)
![TanStack](https://img.shields.io/badge/TanStack-Start-orange)
![Supabase](https://img.shields.io/badge/Supabase-Backend-green)
![OpenAI](https://img.shields.io/badge/AI-OpenAI-purple)
![License](https://img.shields.io/badge/License-MIT-yellow)

JusticeLink is an AI-powered legal assistance platform designed to help Indian citizens understand their legal rights through simple conversations. Users can describe their legal issue in plain language and receive relevant legal provisions, applicable sections, evidence requirements, and recommended next steps.

> **Know Your Rights. Understand the Law.**

---

## 📖 Overview

JusticeLink simplifies access to legal information by combining Artificial Intelligence with curated Indian legal knowledge. Instead of searching through lengthy legal documents, users can simply describe their problem and receive structured legal guidance.

The platform is intended for educational and informational purposes and does not replace professional legal advice.

---

## ✨ Features

- 🤖 AI-powered legal assistant
- ⚖️ Indian legal knowledge base
- 📄 FIR generation assistance
- 📂 Evidence collection guidance
- 🔍 Relevant legal section identification
- 📚 Simplified legal explanations
- 🔐 Secure authentication using Supabase
- 📱 Responsive modern UI
- 🌐 Fast client-side navigation
- 🛡️ AI guardrails to reduce hallucinations

---

## 🏗️ Tech Stack

### Frontend

- React 19
- TypeScript
- TanStack Start
- TanStack Router
- Tailwind CSS
- Radix UI
- Lucide Icons

### Backend & Database

- Supabase
- AI SDK
- OpenAI Compatible API

### Development Tools

- Vite
- ESLint
- Prettier

---

## 📁 Project Structure

```
src/
│
├── components/          # Reusable UI components
├── integrations/        # Supabase integration
├── lib/                 # Utility functions
├── routes/              # Application pages
│   ├── assistant/
│   ├── fir/
│   ├── evidence/
│   ├── admin/
│   ├── disclaimer/
│   └── about/
│
└── server.ts
```

---

## 🚀 Key Modules

### 🧠 AI Legal Assistant

Allows users to ask legal questions in natural language and receive contextual legal guidance.

### 📄 FIR Generator

Guides users through generating a structured FIR based on the incident details.

### 📂 Evidence Guide

Suggests important documents and evidence required for different legal situations.

### 📚 Legal Knowledge Base

Maps user queries to relevant Indian legal provisions while keeping explanations easy to understand.

---

## ⚙️ Installation

Clone the repository

```bash
git clone https://github.com/amrutha-k12/justice-link-choice-of-public.git
```

Move into the project

```bash
cd justice-link-choice-of-public
```

Install dependencies

```bash
npm install
```

Run the development server

```bash
npm run dev
```

---

## 🔧 Environment Variables

Create a `.env` file in the root directory.

Example:

```env
SUPABASE_URL=your_supabase_url

SUPABASE_ANON_KEY=your_supabase_key

OPENAI_API_KEY=your_openai_key
```

---

## 🎯 Use Cases

- Understanding legal rights
- Learning applicable Indian laws
- FIR drafting assistance
- Evidence preparation
- Legal awareness
- Educational legal research

---

## 🔮 Future Enhancements

- Regional language support
- Voice-based legal assistant
- Case timeline management
- Advocate directory
- Court document generation
- AI-powered legal document summarization
- Vector search using embeddings
- Personalized legal dashboard

---


## 🤝 Contributing

Contributions are welcome.

1. Fork the repository

2. Create a feature branch

```bash
git checkout -b feature-name
```

3. Commit your changes

```bash
git commit -m "Add new feature"
```

4. Push the branch

```bash
git push origin feature-name
```

5. Open a Pull Request.

---

## ⚠️ Disclaimer

JusticeLink provides AI-assisted legal information for educational and informational purposes only.

The platform does **not** constitute legal advice and should not be considered a substitute for consultation with a qualified legal professional.

---

## 👩‍💻 Contributors

- Amrutha Koyyalamudi
---

## ⭐ Support

If you found this project helpful, consider giving it a ⭐ on GitHub.
