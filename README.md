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

### Backend (`backend/.env`)
```
GROQ_API_KEY=your_groq_api_key
# Optional — improves search quality:
# TAVILY_API_KEY=your_tavily_api_key
PORT=8000
FRONTEND_URL=http://localhost:3000
```

### Frontend (`frontend/.env.local`)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

For the Vercel demo, set `NEXT_PUBLIC_API_URL` to your deployed backend URL (Railway, Render, etc.).

## 🚢 Deployment

See **[DEPLOY.md](./DEPLOY.md)** for full steps.

**Summary:** Deploy `backend/` to **Render**, set `GROQ_API_KEY`, then add `NEXT_PUBLIC_API_URL` on **Vercel** to your Render URL and redeploy.

### Frontend (Vercel)
```bash
cd frontend
vercel --prod
```

Set `NEXT_PUBLIC_API_URL=https://your-api.onrender.com` in Vercel project settings.

### Backend (Render)
Use `backend/render.yaml` or follow DEPLOY.md.

## 🏗️ Development Status

- ✅ Frontend UI with research form
- ✅ Loading states and animations
- ✅ Report display with sources
- ✅ Frontend deployed to Vercel
- ✅ Backend FastAPI with `/api/research`
- ✅ Groq AI report generation
- ✅ Web search (DuckDuckGo; optional Tavily API)
- ✅ Research agent pipeline (search → analyze → report)
- ✅ Live loading step timeline (SSE stream)
- ⏳ Backend deployment on Render (see DEPLOY.md)

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
