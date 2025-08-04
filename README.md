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
' Requirements
' -----------------------------------------------------
' - Python 3.x
' - Flask
' - spaCy
' - scikit-learn
' - numpy
