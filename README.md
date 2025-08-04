# Fitness Chatbot

A simple Python chatbot that helps you with fitness stuff. It uses spaCy and scikit-learn to understand what you're asking for and gives you workout plans, exercise tips, and general fitness chat.

## What it does

- **Understands what you want**: No need to type exact commands - it figures out if you want a workout, exercise tips, or just want to chat
- **Extracts details**: If you ask for a "3 day workout", it knows you want 3 days and gives you a proper plan
- **Works offline**: Everything runs on your computer, no internet needed
- **Easy to expand**: Want to add new features? Just add some training phrases and responses

## What it can handle

- **Greetings**: "hello", "hi", "hey", etc.
- **Goodbyes**: "bye", "see you later", etc.
- **Workout requests**: "give me a workout", "3 day plan", etc.
- **Exercise tips**: "what exercises should I do", etc.

## Getting started

1. **Install the Python packages**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Download the language model** (needed for understanding text):
   ```bash
   python -m spacy download en_core_web_sm
   ```

## How to use it

### Command line version

Just run:
```bash
python main.py
```

### Web version

Start the web app:
```bash
python app.py
```

Then open your browser and go to: `http://localhost:5000`

## Example conversations

```
You: hi
Bot: Hello! I'm your fitness assistant. How can I help you today?

You: give me a 3 day workout
Bot: I'll create a 3-day workout plan for you! Here's a balanced routine focusing on different muscle groups each day.

Day 1: Push (chest, shoulders, triceps)
Day 2: Pull (back, biceps)
Day 3: Legs (quads, hamstrings, calves)

You: what exercises should I do
Bot: Here are some great exercises you can try: squats, push-ups, pull-ups, lunges, planks, and burpees. Start with 3 sets of 10-15 reps each!

You: bye
Bot: Goodbye! Stay active and healthy!
```

## Files in this project

- `main.py` - Command line version
- `app.py` - Web version (Flask server)
- `chatbot.py` - The brain that understands and responds
- `intent_data.py` - Training phrases and responses
- `templates/index.html` - Web interface
- `static/main.js` - Web interface logic (optional)
- `requirements.txt` - Python packages needed

## How it works under the hood

1. **Intent detection**: Uses TF-IDF and similarity matching to figure out what you want
2. **Parameter extraction**: Uses regex to pull out specific details (like number of days)
3. **Response generation**: Picks the right response based on what it understood

## Adding new features

### Adding new intents

Just add to `intent_data.py`:
```python
"new_intent": {
    "phrases": ["phrase 1", "phrase 2", "phrase 3"],
    "response_template": "Your response here"
}
```

### Adding new parameters

1. Add regex patterns to `PARAMETER_PATTERNS` in `intent_data.py`
2. Add extraction logic in `chatbot.py`

## What you need installed

- **spaCy**: For understanding text
- **scikit-learn**: For matching what you say to training phrases
- **numpy**: For math stuff
- **Flask**: For the web version

## License

This is open source, feel free to use and modify! 