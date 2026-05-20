# 🧮 Scientific Calculator

A full-stack scientific calculator with a modern frontend and a Python-powered backend.

---

## ✨ Features

- Standard arithmetic operations
- Scientific functions (trigonometry, logarithms, exponentiation, etc.)
- Clean, responsive UI
- FastAPI backend for server-side computation

---

## 🛠️ Tech Stack

| Layer    | Technology         |
|----------|--------------------|
| Frontend | Node.js / npm      |
| Backend  | Python + FastAPI   |
| Server   | Uvicorn (ASGI)     |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [Python](https://www.python.org/) (v3.9+ recommended)

---

### Frontend

```bash
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173` (or whichever port Vite assigns).

---

### Backend

**1. Create and activate a virtual environment:**

```bash
# Create the virtual environment
python -m venv venv

# Activate it
# On Windows:
venv\Scripts\activate

# On macOS/Linux:
source venv/bin/activate
```

**2. Install dependencies:**

```bash
pip install -r requirements.txt
```

**3. Start the server:**

```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`.  
Interactive API docs: `http://localhost:8000/docs`

---

## 📁 Project Structure

```
scientific-calculator/
├── frontend/          # Frontend source files
├── main.py            # FastAPI entry point
├── requirements.txt   # Python dependencies
└── README.md
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
