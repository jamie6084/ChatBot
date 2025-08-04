#!/usr/bin/env python3
"""
Main entry point for the Fitness Chatbot.
Runs the chatbot in a command-line interface.
"""

from chatbot import FitnessChatbot

def main():
    """Main function to run the chatbot."""
    print("=" * 50)
    print("🏋️  FITNESS CHATBOT")
    print("=" * 50)
    print("I'm your personal fitness assistant!")
    print("I can help you with:")
    print("• Workout plans (try: 'give me a 3 day workout')")
    print("• Exercise recommendations")
    print("• General fitness chat")
    print("Type 'quit' or 'exit' to end the conversation.")
    print("=" * 50)
    
    # Initialize the chatbot
    chatbot = FitnessChatbot()
    
    # Main conversation loop
    while True:
        try:
            # Get user input
            user_input = input("\nYou: ").strip()
            
            # Check for exit commands
            if user_input.lower() in ['quit', 'exit', 'bye', 'goodbye']:
                print("\nChatbot: Goodbye! Stay active and healthy! 💪")
                break
            
            # Process the input and get response
            response = chatbot.process_input(user_input)
            
            # Display the response
            print(f"\nChatbot: {response}")
            
        except KeyboardInterrupt:
            print("\n\nChatbot: Goodbye! Stay active and healthy! 💪")
            break
        except Exception as e:
            print(f"\nChatbot: Sorry, I encountered an error: {e}")
            print("Please try again!")

if __name__ == "__main__":
    main() 