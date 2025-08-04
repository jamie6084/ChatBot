"""
Main chatbot module with intent detection and parameter extraction.
Uses spaCy for NLP processing and similarity matching.
"""

import re
import spacy
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from intent_data import get_intent_data, get_parameter_patterns

class FitnessChatbot:
    def __init__(self):
        """Initialize the chatbot with spaCy model and training data."""
        # Load spaCy model (using en_core_web_sm for lightweight processing)
        try:
            self.nlp = spacy.load("en_core_web_sm")
        except OSError:
            print("spaCy model not found. Please run: python -m spacy download en_core_web_sm")
            print("Using basic text processing instead...")
            self.nlp = None
        
        # Load intent data
        self.intent_data = get_intent_data()
        self.parameter_patterns = get_parameter_patterns()
        
        # Prepare training data for intent detection
        self.prepare_training_data()
    
    def prepare_training_data(self):
        """Prepare training phrases and their corresponding intents."""
        self.training_phrases = []
        self.training_intents = []
        
        for intent, data in self.intent_data.items():
            if intent != "unknown":
                for phrase in data["phrases"]:
                    self.training_phrases.append(phrase)
                    self.training_intents.append(intent)
        
        # Create TF-IDF vectorizer for similarity matching
        self.vectorizer = TfidfVectorizer(
            lowercase=True,
            stop_words='english',
            ngram_range=(1, 2),
            max_features=1000
        )
        
        # Fit the vectorizer on training phrases
        if self.training_phrases:
            self.training_vectors = self.vectorizer.fit_transform(self.training_phrases)
    
    def detect_intent(self, user_input):
        """Detect the intent of the user input using similarity matching."""
        if not self.training_phrases:
            return "unknown"
        
        # Vectorize the user input
        user_vector = self.vectorizer.transform([user_input.lower()])
        
        # Calculate similarities with training phrases
        similarities = cosine_similarity(user_vector, self.training_vectors).flatten()
        
        # Find the most similar training phrase
        max_similarity_idx = np.argmax(similarities)
        max_similarity = similarities[max_similarity_idx]
        
        # If similarity is too low, return unknown
        if max_similarity < 0.3:
            return "unknown"
        
        return self.training_intents[max_similarity_idx]
    
    def extract_parameters(self, user_input, intent):
        """Extract parameters from user input based on intent."""
        parameters = {}
        
        if intent == "request_workout":
            # Extract number of days
            days = self.extract_days(user_input)
            if days:
                parameters["days"] = days
            else:
                # Default to 3 days if no number specified
                parameters["days"] = 3
        
        return parameters
    
    def extract_days(self, user_input):
        """Extract number of days from user input using regex patterns."""
        user_input_lower = user_input.lower()
        
        for pattern in self.parameter_patterns["days"]:
            match = re.search(pattern, user_input_lower)
            if match:
                days = int(match.group(1))
                # Limit to reasonable range (1-7 days)
                return min(max(days, 1), 7)
        
        return None
    
    def generate_response(self, intent, parameters=None):
        """Generate a response based on detected intent and parameters."""
        if intent not in self.intent_data:
            intent = "unknown"
        
        response_template = self.intent_data[intent]["response_template"]
        
        if parameters and intent == "request_workout":
            # Generate a more detailed workout plan
            days = parameters.get("days", 3)
            response = response_template.format(days=days)
            
            # Add specific workout details based on number of days
            if days == 3:
                response += "\n\nDay 1: Push (chest, shoulders, triceps)\nDay 2: Pull (back, biceps)\nDay 3: Legs (quads, hamstrings, calves)"
            elif days == 4:
                response += "\n\nDay 1: Chest & Triceps\nDay 2: Back & Biceps\nDay 3: Shoulders\nDay 4: Legs"
            elif days == 5:
                response += "\n\nDay 1: Chest\nDay 2: Back\nDay 3: Shoulders\nDay 4: Arms\nDay 5: Legs"
            else:
                response += f"\n\nI'll create a {days}-day split focusing on different muscle groups each day."
            
            return response
        
        return response_template
    
    def process_input(self, user_input):
        """Process user input and return a response."""
        # Clean and normalize input
        user_input = user_input.strip().lower()
        
        if not user_input:
            return "Please say something!"
        
        # Detect intent
        intent = self.detect_intent(user_input)
        
        # Extract parameters
        parameters = self.extract_parameters(user_input, intent)
        
        # Generate response
        response = self.generate_response(intent, parameters)
        
        return response 