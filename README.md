# 🧠 AI-Powered RFP Management System

## 📌 Project Overview

This project is an **AI-Powered Request for Proposal (RFP) Management System** designed to automate and streamline procurement workflows.

Traditionally, procurement managers manually write RFPs, email vendors, collect unstructured responses, extract pricing details, compare proposals, and decide on the best vendor.
This system automates the entire process using **Generative AI**, **Email Integration**, and a **Modern Web Stack**.

---

## ❓ What is an RFP?

**RFP (Request for Proposal)** is a document sent by a company to vendors asking them to submit proposals including pricing, delivery terms, warranty, and payment conditions for specific products or services.
The company then compares vendor proposals and selects the best offer.

**Example:**

> "We need 20 laptops. Send your price quote and delivery details."
> Vendors reply → system compares → best vendor is selected.

---

## 🎯 Key Features

✔ Create RFPs using natural language
✔ AI converts text into structured RFP data
✔ Vendor management (add/list vendors)
✔ Send RFPs to vendors via email
✔ Receive vendor replies via inbox scanning
✔ AI parses unstructured vendor proposals
✔ Compare proposals in a dashboard
✔ AI recommends the best vendor with reasoning

---

## 🏗️ Tech Stack

### Frontend

* React.js
* Tailwind CSS or Material UI

### Backend

* Node.js
* Express.js

### Database

* MongoDB (JSON-friendly storage)

### AI Engine

* Ollama (Llama3 Model)

### Email Integration

* Nodemailer (SMTP sending)
* IMAP (Receiving vendor replies)

---

## 🧩 System Architecture

```
User → Frontend (React)
     → Backend API (Express)
        → MongoDB (Store RFPs, Vendors, Proposals)
        → Ollama AI (Text Processing)
        → Email Server (Send / Receive)
```

---

## 📂 Folder Structure

```
rfp-ai-system
│
├── frontend
│   ├── pages
│   ├── components
│   └── App.jsx
│
├── backend
│   ├── routes
│   ├── controllers
│   ├── services
│   │     ├── ollamaService.js
│   │     └── emailService.js
│   ├── models
│   │     ├── Rfp.js
│   │     ├── Vendor.js
│   │     └── Proposal.js
│   └── server.js
│
└── README.md
```

---

## 🗂️ Data Models

### RFP Model

```json
{
  _id,
  rawInput,
  structuredData: {
    items,
    quantities,
    budget,
    deliveryDays,
    warranty,
    paymentTerms
  },
  vendorsSelected,
  status
}
```

### Vendor Model

```json
{
  _id,
  name,
  email,
  company
}
```

### Proposal Model

```json
{
  _id,
  rfpId,
  vendorId,
  extractedData: {
    totalPrice,
    deliveryDays,
    warranty,
    paymentTerms
  },
  rawEmailText
}
```

---

## ⚙️ Core Workflow

### 1️⃣ Create RFP

User enters procurement request in natural language.
AI converts it into structured JSON format.

### 2️⃣ Manage Vendors

User can add and list vendors.

### 3️⃣ Send RFP Emails

System sends structured RFPs to selected vendors via email.

### 4️⃣ Receive Vendor Replies

System scans inbox for vendor responses.

### 5️⃣ Parse Vendor Proposals

AI extracts key fields:

* Price
* Delivery Days
* Warranty
* Payment Terms

### 6️⃣ Compare & Recommend

AI compares all proposals and suggests the best vendor with reasoning.

---

## 🧠 AI Usage

| Function              | AI Role                                   |
| --------------------- | ----------------------------------------- |
| RFP Creation          | Converts natural text → structured JSON   |
| Proposal Parsing      | Extracts pricing & terms from emails      |
| Vendor Recommendation | Compares proposals & suggests best vendor |

AI is powered locally using **Ollama (Llama3)**.

---

## 🚀 How to Run Locally

### Prerequisites

* Node.js ≥ 18
* MongoDB installed locally or Atlas
* Ollama installed

### Install Ollama Model

```bash
ollama pull llama3
ollama serve
```

---

### Backend Setup

```bash
cd backend
npm install
node server.js
```

Backend runs on:

```
http://localhost:5000
```

---

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

### Email Setup

Update in `emailService.js`:

```js
user: "your_email@gmail.com"
pass: "your_app_password"
```

*(Use Gmail App Password for security)*

---

## 📡 API Endpoints

| Method | Endpoint               | Description         |
| ------ | ---------------------- | ------------------- |
| POST   | /api/rfp/create        | Create RFP using AI |
| GET    | /api/rfp               | Get all RFPs        |
| POST   | /api/vendors/add       | Add new vendor      |
| GET    | /api/vendors           | List vendors        |
| POST   | /api/email/send/:rfpId | Send RFP emails     |
| GET    | /api/email/read        | Read vendor replies |

---

## 🎥 Demo Video Flow

1. Enter RFP in natural language
2. View structured RFP output
3. Add vendors
4. Send RFP emails
5. Receive vendor response
6. AI parses proposal
7. Comparison table + AI recommendation

---

## 🧪 Development Order

1. Setup database & backend
2. Integrate Ollama for RFP creation
3. Build vendor CRUD
4. Email sending
5. Email receiving
6. Proposal parsing
7. Comparison & recommendation UI

---

## 📈 Future Improvements

* Attachments parsing (PDF/Excel quotes)
* Scoring dashboard
* Vendor performance history
* Authentication
* Multi-RFP tracking

---

## 🧑‍💻 AI Tools Used

* Ollama (Llama3) for generative AI
* ChatGPT for code structuring and prompt design

---

## 🎓 What I Learned

* Designing AI-driven workflows
* Prompt engineering for structured JSON output
* Email automation integration
* Full-stack system design
* AI-assisted decision recommendation

---

## 📬 Submission Deliverables

✔ GitHub Repository
✔ README.md (this file)
✔ Demo Video
✔ Working Full-Stack Application

---

## 👤 Author

**Arjun Sharma**
MERN / Next.js Developer
AI-Powered Procurement Automation Project

---

If you want, I can now also generate:

✅ **`.env.example` file**
✅ **API Documentation section with request/response samples**
✅ **Comparison & Recommendation API code**

Just tell me: **"Generate remaining docs"**
