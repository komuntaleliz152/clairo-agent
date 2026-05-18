# AI Research Agent - Backend

Python FastAPI backend for the AI Research Agent.

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
```

2. Activate the virtual environment:
```bash
# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create `.env` file:
```bash
cp .env.example .env
```

5. Add your Groq API key to `.env`:
```
GROQ_API_KEY=your_actual_api_key_here
```

## Get Groq API Key

1. Go to: https://console.groq.com/
2. Sign up (it's free!)
3. Navigate to API Keys
4. Create a new API key
5. Copy and paste it into your `.env` file

## Run the server

```bash
python main.py
```

Or with uvicorn directly:
```bash
uvicorn main:app --reload --port 8000
```

The API will be available at: http://localhost:8000

API documentation: http://localhost:8000/docs
