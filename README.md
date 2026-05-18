# AI Research Agent

An autonomous AI-powered research assistant that searches the web, analyzes sources, and generates comprehensive research reports.

## 🚀 Live Demo

**Frontend:** https://clairo-research-agent.vercel.app

## 🎯 Features

- **Autonomous Research**: Enter a topic and let the AI agent do the work
- **Web Search Integration**: Searches the web for current information
- **Source Analysis**: Analyzes and synthesizes information from multiple sources
- **Structured Reports**: Generates clean, comprehensive research reports
- **Download Reports**: Export your research as text files

## 🛠️ Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Vercel** - Deployment platform

### Backend
- **Python 3.11+** - Programming language
- **FastAPI** - Modern web framework
- **Groq API** - Fast AI inference with Llama models
- **Uvicorn** - ASGI server

## 📁 Project Structure

```
clairo-agent/
├── frontend/           # Next.js frontend application
│   ├── app/           # Next.js app directory
│   ├── components/    # React components
│   └── public/        # Static assets
├── backend/           # Python FastAPI backend
│   ├── main.py       # FastAPI application
│   ├── requirements.txt
│   └── .env          # Environment variables (not committed)
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and **pnpm**
- **Python** 3.11+
- **Groq API Key** (free at https://console.groq.com/)

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
pnpm install
```

3. Run development server:
```bash
npx next dev
```

4. Open http://localhost:3000

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv venv
```

3. Activate virtual environment:
```bash
# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate
```

4. Install dependencies:
```bash
pip install -r requirements.txt
```

5. Create `.env` file:
```bash
cp .env.example .env
```

6. Add your Groq API key to `.env`:
```
GROQ_API_KEY=your_actual_api_key_here
```

7. Run the server:
```bash
python main.py
```

8. API available at http://localhost:8000

## 🔑 Getting API Keys

### Groq API (Free)
1. Go to https://console.groq.com/
2. Sign up for a free account
3. Navigate to API Keys
4. Create a new key
5. Copy and paste into your `.env` file

## 📝 Environment Variables

### Backend (.env)
```
GROQ_API_KEY=your_groq_api_key
PORT=8000
HOST=0.0.0.0
FRONTEND_URL=http://localhost:3000
```

## 🚢 Deployment

### Frontend (Vercel)
```bash
cd frontend
vercel --prod
```

### Backend
Deploy to Railway, Render, or similar Python hosting service.

## 🏗️ Development Status

- ✅ Frontend UI with research form
- ✅ Loading states and animations
- ✅ Report display component
- ✅ Frontend deployed to Vercel
- ✅ Backend FastAPI setup
- ⏳ Groq AI integration (in progress)
- ⏳ Web search functionality (in progress)
- ⏳ Agent orchestration (in progress)
- ⏳ Backend deployment (pending)

## 🤝 Contributing

This is a hackathon project. Contributions, issues, and feature requests are welcome!

## 📄 License

MIT License

## 👨‍💻 Author

Built for the AI Agents Hackathon 2026

## 🙏 Acknowledgments

- Groq for fast AI inference
- Vercel for frontend hosting
- Next.js and FastAPI communities
