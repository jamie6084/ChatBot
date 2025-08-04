#!/usr/bin/env python3
"""
Test script for the Fitness Chatbot.
Tests basic functionality and intent detection.
"""

from chatbot import FitnessChatbot

def test_chatbot():
    """Test the chatbot with various inputs."""
    print("Testing Fitness Chatbot...")
    print("=" * 40)
    
    # Initialize chatbot
    chatbot = FitnessChatbot()
    
    # Test cases
    test_cases = [
        "hello",
        "hi there",
        "give me a workout",
        "I want a 3 day split",
        "create a 5 day plan",
        "what exercises should I do",
        "bye",
        "see you later",
        "random text that should be unknown"
    ]
    
    for test_input in test_cases:
        print(f"\nInput: '{test_input}'")
        response = chatbot.process_input(test_input)
        print(f"Response: {response}")
        print("-" * 40)
    
    print("\nTest completed!")

if __name__ == "__main__":
    test_chatbot() 