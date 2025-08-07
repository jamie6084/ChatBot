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
    """Serve the main chat interface with engine info."""
    engine_model = None
    if USE_LLM and ollama_client is not None:
        engine_model = ollama_client.model
    return render_template('index.html', use_llm=USE_LLM, model=engine_model)

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
        
        # Optional generation params
        temperature = data.get('temperature') if isinstance(data, dict) else None
        max_tokens = data.get('max_tokens') if isinstance(data, dict) else None

        # Route to selected engine
        if USE_LLM and ollama_client is not None:
            bot_response = ollama_client.chat(
                user_message,
                system_prompt=DEFAULT_FITNESS_SYSTEM_PROMPT,
                temperature=float(temperature) if temperature is not None else 0.4,
                max_tokens=int(max_tokens) if max_tokens is not None else None,
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
    port = int(os.getenv('PORT') or os.getenv('FLASK_RUN_PORT') or 5000)
    debug = os.getenv('FLASK_DEBUG', '1').lower() in {"1", "true", "yes", "on"}
    engine = f"LLM ({ollama_client.model})" if (USE_LLM and ollama_client is not None) else "Rules"

    print("🏋️  FITNESS CHATBOT WEB APP")
    print("=" * 40)
    print(f"Starting Flask server on port {port} [debug={debug}] · Engine: {engine}")
    print(f"Open http://localhost:{port} in your browser")
    print("=" * 40)

    # Run the Flask app
    app.run(debug=debug, host='0.0.0.0', port=port)