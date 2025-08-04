"""
Intent data module for the chatbot.
Contains training phrases, intent definitions, and response templates.
"""

# Intent definitions with training phrases
INTENT_DATA = {
    "greeting": {
        "phrases": [
            "hello",
            "hi",
            "hey",
            "hi there",
            "hello there",
            "good morning",
            "good afternoon",
            "good evening",
            "what's up",
            "how are you",
            "greetings"
        ],
        "response_template": "Hello! I'm your fitness assistant. How can I help you today?"
    },
    
    "goodbye": {
        "phrases": [
            "bye",
            "goodbye",
            "see you",
            "see you later",
            "see ya",
            "take care",
            "farewell",
            "until next time",
            "goodbye for now",
            "bye bye"
        ],
        "response_template": "Goodbye! Stay active and healthy!"
    },
    
    "request_workout": {
        "phrases": [
            "give me a workout",
            "I want a workout",
            "create a workout plan",
            "I need a workout",
            "workout plan",
            "fitness routine",
            "exercise plan",
            "training program",
            "workout routine",
            "give me a {days} day workout",
            "I want a {days} day split",
            "create a {days} day plan",
            "{days} day workout plan",
            "{days} day split",
            "{days} day routine",
            "workout for {days} days",
            "plan for {days} days"
        ],
        "response_template": "I'll create a {days}-day workout plan for you! Here's a balanced routine focusing on different muscle groups each day."
    },
    
    "request_exercise": {
        "phrases": [
            "what exercises should I do",
            "recommend exercises",
            "suggest exercises",
            "what workouts",
            "exercise recommendations",
            "workout suggestions",
            "fitness exercises",
            "training exercises"
        ],
        "response_template": "Here are some great exercises you can try: squats, push-ups, pull-ups, lunges, planks, and burpees. Start with 3 sets of 10-15 reps each!"
    },
    
    "unknown": {
        "phrases": [],
        "response_template": "I'm not sure I understood that. Could you try rephrasing? I can help with workout plans, exercise recommendations, or just chat!"
    }
}

# Parameter extraction patterns
PARAMETER_PATTERNS = {
    "days": [
        r"(\d+)\s*day",
        r"(\d+)\s*day\s*split",
        r"(\d+)\s*day\s*plan",
        r"(\d+)\s*day\s*routine",
        r"workout\s*for\s*(\d+)\s*days",
        r"plan\s*for\s*(\d+)\s*days"
    ]
}

def get_intent_data():
    """Return the intent data dictionary."""
    return INTENT_DATA

def get_parameter_patterns():
    """Return the parameter extraction patterns."""
    return PARAMETER_PATTERNS 