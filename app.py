#!/usr/bin/env python3
"""
Flask web application for the Fitness Chatbot.
Provides a REST API endpoint for chat functionality.
"""

from flask import Flask, request, jsonify, render_template
from chatbot import FitnessChatbot
import os
from llm_client import OllamaClient, DEFAULT_FITNESS_SYSTEM_PROMPT
import json

app = Flask(__name__)

# Configure response engine: rules (default) or LLM via Ollama
USE_LLM = os.getenv("USE_LLM", "false").lower() in {"1", "true", "yes", "on"}

# Initialize engines
chatbot = FitnessChatbot()
ollama_client = OllamaClient() if USE_LLM else None

@app.route('/')
def index():
    """Serve the main chat interface."""
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat():
    """Handle chat requests from the frontend."""
    try:
        # Get the JSON data from the request
        data = request.get_json()
        
        if not data or 'message' not in data:
            return jsonify({
                'error': 'Missing message field in request body'
            }), 400
        
        # Get the user message
        user_message = data['message'].strip()
        
        if not user_message:
            return jsonify({
                'error': 'Message cannot be empty'
            }), 400
        
        # Route to selected engine
        if USE_LLM and ollama_client is not None:
            bot_response = ollama_client.chat(
                user_message,
                system_prompt=DEFAULT_FITNESS_SYSTEM_PROMPT,
            )
        else:
            bot_response = chatbot.process_input(user_message)
        
        # Return the response
        return jsonify({
            'response': bot_response
        })
        
    except Exception as e:
        return jsonify({
            'error': f'An error occurred: {str(e)}'
        }), 500

@app.route('/health')
def health():
    """Health check endpoint."""
    return jsonify({
        'status': 'healthy',
        'message': 'Fitness Chatbot is running'
    })

if __name__ == '__main__':
    print("🏋️  FITNESS CHATBOT WEB APP")
    print("=" * 40)
    print("Starting Flask server...")
    print("Open http://localhost:5000 in your browser")
    print("=" * 40)
    
    # Run the Flask app
    app.run(debug=True, host='0.0.0.0', port=5000) 