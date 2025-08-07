' Fitness Chatbot

' This is a simple chatbot I made in Python to help with basic fitness stuff like workouts,
' exercise tips, and general gym talk. You can chat with it either in the terminal or through
' a web interface. It’s all local — no cloud stuff or external APIs needed.

' -----------------------------------------------------
' What It Can Do
' -----------------------------------------------------
' - Gives you basic workout plans (like if you say "I want a 3 day workout")
' - Offers exercise suggestions for different goals or muscle groups
' - Understands greetings (like "hi", "yo", "hey") and goodbyes
' - Runs fully offline, straight from your own machine

' -----------------------------------------------------
' Getting Started
' -----------------------------------------------------

' 1. Install the required Python packages:
pip install -r requirements.txt

' 2. Download the spaCy language model:
python -m spacy download en_core_web_sm

' -----------------------------------------------------
' How to Use It
' -----------------------------------------------------

' Command line version:
python main.py

' Web version:
python app.py

' Then open your browser and go to: http://localhost:5000

' -----------------------------------------------------
' How It Works (Plain English)
' -----------------------------------------------------
' - It uses basic natural language processing (spaCy + scikit-learn) to figure out what you're asking for
' - If you're asking for a workout, it looks for the number of days and builds a simple plan
' - If you're asking for tips, it gives general exercises based on the intent
' - It’s not a full AI, just some logic and smart keyword matching behind the scenes

' -----------------------------------------------------
' Example Conversations
' -----------------------------------------------------

You: hi
Bot: Hey! What can I help you with today?

You: give me a 3 day workout
Bot: Sure thing. Here's a 3-day plan:
      Day 1 – Push (chest, shoulders, triceps)
      Day 2 – Pull (back, biceps)
      Day 3 – Legs (quads, hamstrings, calves)

You: any good exercises for abs?
Bot: Try planks, leg raises, Russian twists, and mountain climbers.

You: bye
Bot: Catch you later. Stay strong.

' -----------------------------------------------------
' Project Files
' -----------------------------------------------------
' - main.py — CLI version
' - app.py — Flask web app
' - chatbot.py — Bot logic and responses
' - intent_data.py — Training phrases and templates
' - templates/index.html — HTML for the web interface
' - static/main.js — JS for the web chat (optional)
' - requirements.txt — Dependencies

' -----------------------------------------------------
' Want to Add More Stuff?
' -----------------------------------------------------

' Add new intents/responses:
' Open intent_data.py and follow the pattern:

"some_intent": {
    "phrases": ["example phrase 1", "phrase 2"],
    "response_template": "Whatever you want the bot to say"
}

' Add new parameter types:
' - Update PARAMETER_PATTERNS in intent_data.py
' - Modify the logic in chatbot.py to handle them

' -----------------------------------------------------
' Built With
' -----------------------------------------------------
' - Python
' - spaCy
' - scikit-learn
' - Flask
' - Regex (for parameter extraction)

' -----------------------------------------------------
' Optional: Use an open‑source GPT model (Ollama)
' -----------------------------------------------------

' You can switch the bot to use a local open‑source LLM (e.g., Llama 3, Mistral)
' via [Ollama](https://ollama.com). This keeps everything running locally.

' 1) Install Ollama (macOS/Linux/Windows):
'    Follow the instructions on their website and start the Ollama service.

' 2) Pull a model (examples below):
'    ollama pull llama3.1
'    # or
'    ollama pull mistral

' 3) Install Python deps for the client:
'    pip install -r requirements.txt

' 4) Run the web app with LLM enabled:
'    # defaults: OLLAMA_BASE_URL=http://localhost:11434, OLLAMA_MODEL=llama3.1
'    USE_LLM=true python app.py

'    Optional overrides:
'    OLLAMA_MODEL=mistral USE_LLM=true python app.py
'    OLLAMA_BASE_URL=http://127.0.0.1:11434 USE_LLM=true python app.py

' Notes:
' - When USE_LLM=false (default), the rule‑based chatbot runs as before.
' - The system prompt is tuned for concise fitness coaching.

### End‑to‑end setup for GPT‑OSS (copy/paste)

Use these commands on macOS to get everything running locally with a GPT‑OSS model via Ollama.

1) Python 3.11 and virtual environment

```
brew install python@3.11
/opt/homebrew/bin/python3.11 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python -m spacy download en_core_web_sm
```

2) Install Ollama and pull a model

```
brew install --cask ollama
ollama pull llama3.1
```

3) Start the app with GPT‑OSS enabled

- Default (port 5000):
```
USE_LLM=true OLLAMA_MODEL=llama3.1 python app.py
```

- If port 5000 is in use (AirPlay Receiver commonly uses it), either free it in System Settings → General → AirDrop & Handoff, or run on port 5050 using:
```
USE_LLM=true OLLAMA_MODEL=llama3.1 python -c "from app import app; app.run(host='0.0.0.0', port=5050, debug=True)"
```

4) Verify it’s working

```
curl -s http://localhost:5000/health || curl -s http://localhost:5050/health
curl -s -X POST http://localhost:5000/chat -H 'Content-Type: application/json' -d '{"message":"give me a 3 day workout"}' \
  || curl -s -X POST http://localhost:5050/chat -H 'Content-Type: application/json' -d '{"message":"give me a 3 day workout"}'
```

Open in a browser:
- http://localhost:5000 (default) or http://localhost:5050 (alternate)

Environment variables:
- `USE_LLM=true` to enable the Ollama LLM path
- `OLLAMA_MODEL` sets the model (default `llama3.1`)
- `OLLAMA_BASE_URL` points to the Ollama server (default `http://localhost:11434`)

' -----------------------------------------------------
' Requirements
' -----------------------------------------------------
' - Python 3.x
' - Flask
' - spaCy
' - scikit-learn
' - numpy
