// Chat functionality for the Fitness Chatbot web interface
// This file contains the JavaScript logic for handling chat interactions

class ChatInterface {
    constructor() {
        this.chatMessages = document.getElementById('chatMessages');
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');
        this.typingIndicator = document.getElementById('typingIndicator');

        this.initializeEventListeners();
        this.focusInput();
    }

    initializeEventListeners() {
        this.sendButton.addEventListener('click', () => this.handleSendMessage());
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleSendMessage();
            }
        });
    }

    addMessage(content, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;

        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.textContent = content;

        messageDiv.appendChild(messageContent);
        this.chatMessages.appendChild(messageDiv);

        // Scroll to bottom
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    showTypingIndicator(show) {
        this.typingIndicator.style.display = show ? 'block' : 'none';
        if (show) {
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        }
    }

    async sendMessage(message) {
        try {
            this.showTypingIndicator(true);

            const response = await fetch('/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: message })
            });

            const data = await response.json();

            this.showTypingIndicator(false);

            if (response.ok) {
                this.addMessage(data.response, false);
            } else {
                this.addMessage(`Error: ${data.error || 'Something went wrong'}`, false);
            }

        } catch (error) {
            this.showTypingIndicator(false);
            this.addMessage('Error: Could not connect to the server', false);
            console.error('Error:', error);
        }
    }

    handleSendMessage() {
        const message = this.messageInput.value.trim();
        if (message) {
            this.addMessage(message, true);
            this.messageInput.value = '';
            this.sendMessage(message);
        }
    }

    focusInput() {
        this.messageInput.focus();
    }
}

// Initialize the chat interface when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new ChatInterface();
});