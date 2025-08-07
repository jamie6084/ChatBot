// Chat functionality for the Fitness Chatbot web interface
// This file contains the JavaScript logic for handling chat interactions

class ChatInterface {
    constructor() {
        this.chatMessages = document.getElementById('chatMessages');
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');
        this.clearButton = document.getElementById('clearButton');
        this.typingIndicator = document.getElementById('typingIndicator');
        this.particlesContainer = document.getElementById('particles');
        this.chatContainer = document.getElementById('chatContainer');
        this.mainContainer = document.querySelector('.main-container');
        this.workoutContainer = document.getElementById('workoutContainer');
        this.workoutContent = document.getElementById('workoutContent');
        this.scrollBottomBtn = document.getElementById('scrollBottomBtn');

        this.storageKey = 'fitness_chat_history_v1';

        this.initializeEventListeners();
        this.restoreHistory();
        this.createParticles();
        this.focusInput();
    }

    initializeEventListeners() {
        this.sendButton.addEventListener('click', () => this.handleSendMessage());
        this.clearButton.addEventListener('click', () => this.clearChat());
        this.messageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.handleSendMessage();
            }
        });
        this.messageInput.addEventListener('input', () => {
            this.sendButton.disabled = this.messageInput.value.trim().length === 0;
        });
        this.chatMessages.addEventListener('scroll', () => this.toggleScrollBtn());
        if (this.scrollBottomBtn) {
            this.scrollBottomBtn.addEventListener('click', () => this.scrollToBottom());
        }
    }

    createParticles() {
        for (let i = 0; i < 15; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.width = Math.random() * 4 + 2 + 'px';
            particle.style.height = particle.style.width;
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 6 + 's';
            particle.style.animationDuration = (Math.random() * 3 + 4) + 's';
            this.particlesContainer.appendChild(particle);
        }
    }

    addMessage(content, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;

        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        // Render newlines
        messageContent.innerHTML = content
            .split('\n')
            .map(line => `<div>${this.escapeHtml(line)}</div>`) 
            .join('');

        messageDiv.appendChild(messageContent);
        if (!isUser) {
            const actions = document.createElement('div');
            actions.className = 'actions';
            const copyBtn = document.createElement('button');
            copyBtn.className = 'copy-btn';
            copyBtn.type = 'button';
            copyBtn.textContent = 'Copy';
            copyBtn.addEventListener('click', async () => {
                try {
                    await navigator.clipboard.writeText(content);
                    const original = copyBtn.textContent;
                    copyBtn.textContent = 'Copied';
                    setTimeout(() => (copyBtn.textContent = original), 1200);
                } catch (_) { /* noop */ }
            });
            actions.appendChild(copyBtn);
            messageDiv.appendChild(actions);
        }
        this.chatMessages.appendChild(messageDiv);
        this.persistMessage(content, isUser);

        // Scroll to bottom
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        this.toggleScrollBtn();
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
            this.sendButton.disabled = true;

            const response = await fetch('/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: message })
            });

            const data = await response.json();

            this.showTypingIndicator(false);
            this.sendButton.disabled = false;

            if (response.ok) {
                this.addMessage(data.response, false);
                this.maybeShowWorkout(data.response);
            } else {
                const reason = this.extractError(response.status, data);
                this.addMessage(`Oops! ${reason}`, false);
            }
        } catch (error) {
            this.showTypingIndicator(false);
            this.sendButton.disabled = false;
            this.addMessage('Sorry, I cannot connect right now. Try again later.', false);
            console.error('Error:', error);
        }
    }

    extractError(status, data) {
        if (status === 429) return 'Too many requests. Please slow down.';
        if (status >= 500) return 'Server error. Please try again.';
        return (data && (data.error || data.message)) || 'Something went wrong';
    }

    maybeShowWorkout(text) {
        if (!text || typeof text !== 'string') return;
        if (!text.toLowerCase().includes('workout')) return;
        let days = 7;
        if (/\b3\b/.test(text)) days = 3;
        else if (/\b4\b/.test(text)) days = 4;
        else if (/\b5\b/.test(text)) days = 5;
        this.showWorkoutPlan(days);
    }

    showWorkoutPlan(days) {
        this.chatContainer.classList.add('workout-mode');
        if (this.mainContainer) this.mainContainer.classList.add('split');
        this.workoutContainer.classList.add('show');
        this.createWorkoutPlan(days);
    }

    createWorkoutPlan(days) {
        const workoutGrid = document.createElement('div');
        workoutGrid.className = 'workout-grid';
        const plan = this.getWorkoutPlan(days);
        this.workoutContent.innerHTML = '';
        this.workoutContent.appendChild(workoutGrid);
        plan.forEach((dayPlan, index) => {
            setTimeout(() => {
                const dayElement = document.createElement('div');
                dayElement.className = 'workout-day';
                const dayHeader = document.createElement('div');
                dayHeader.className = 'workout-day-header';
                const dayTitle = document.createElement('div');
                dayTitle.className = 'day-title';
                dayTitle.textContent = `Day ${dayPlan.day}: ${dayPlan.title}`;
                const dayNumber = document.createElement('div');
                dayNumber.className = 'day-number';
                dayNumber.textContent = dayPlan.day;
                dayHeader.appendChild(dayTitle);
                dayHeader.appendChild(dayNumber);
                const exercisesContainer = document.createElement('div');
                exercisesContainer.className = 'workout-exercises';
                if (dayPlan.exercises.length === 0) {
                    const restDay = document.createElement('div');
                    restDay.className = 'rest-day';
                    restDay.textContent = 'Rest and Recovery';
                    exercisesContainer.appendChild(restDay);
                } else {
                    dayPlan.exercises.forEach(exercise => {
                        const exerciseElement = document.createElement('div');
                        exerciseElement.className = 'exercise-item';
                        const exerciseName = document.createElement('div');
                        exerciseName.className = 'exercise-name';
                        exerciseName.textContent = exercise.name;
                        const exerciseDetails = document.createElement('div');
                        exerciseDetails.className = 'exercise-details';
                        exerciseDetails.textContent = exercise.details;
                        exerciseElement.appendChild(exerciseName);
                        exerciseElement.appendChild(exerciseDetails);
                        exercisesContainer.appendChild(exerciseElement);
                    });
                }
                dayElement.appendChild(dayHeader);
                dayElement.appendChild(exercisesContainer);
                workoutGrid.appendChild(dayElement);
            }, index * 600);
        });
    }

    getWorkoutPlan(days) {
        const plans = { 3: [
            { day: 1, title: 'Push Day', exercises: [
                { name: 'Bench Press', details: '3 x 8–12' },
                { name: 'Overhead Press', details: '3 x 8–12' },
                { name: 'Incline DB Press', details: '3 x 10–15' },
                { name: 'Lateral Raises', details: '3 x 12–15' },
                { name: 'Tricep Dips', details: '3 x 10–15' },
            ]},
            { day: 2, title: 'Pull Day', exercises: [
                { name: 'Deadlifts', details: '3 x 6–10' },
                { name: 'Barbell Rows', details: '3 x 8–12' },
                { name: 'Pull-ups', details: '3 x 6–12' },
                { name: 'Bicep Curls', details: '3 x 10–15' },
                { name: 'Face Pulls', details: '3 x 12–15' },
            ]},
            { day: 3, title: 'Legs Day', exercises: [
                { name: 'Squats', details: '3 x 8–12' },
                { name: 'Romanian Deadlifts', details: '3 x 8–12' },
                { name: 'Leg Press', details: '3 x 10–15' },
                { name: 'Calf Raises', details: '3 x 15–20' },
                { name: 'Planks', details: '3 x 30–60s' },
            ]},
        ], 4: [
            { day: 1, title: 'Upper Body', exercises: [
                { name: 'Bench Press', details: '3 x 8–12' },
                { name: 'Pull-ups', details: '3 x 6–12' },
                { name: 'Overhead Press', details: '3 x 8–12' },
                { name: 'Barbell Rows', details: '3 x 8–12' },
                { name: 'Dips', details: '3 x 8–12' },
            ]},
            { day: 2, title: 'Lower Body', exercises: [
                { name: 'Squats', details: '3 x 8–12' },
                { name: 'Deadlifts', details: '3 x 6–10' },
                { name: 'Leg Press', details: '3 x 10–15' },
                { name: 'Calf Raises', details: '3 x 15–20' },
                { name: 'Planks', details: '3 x 30–60s' },
            ]},
            { day: 3, title: 'Rest Day', exercises: [] },
            { day: 4, title: 'Full Body', exercises: [
                { name: 'Squats', details: '3 x 8–12' },
                { name: 'Bench Press', details: '3 x 8–12' },
                { name: 'Pull-ups', details: '3 x 6–12' },
                { name: 'Overhead Press', details: '3 x 8–12' },
                { name: 'Planks', details: '3 x 30–60s' },
            ]},
        ], 5: [
            { day: 1, title: 'Push Day', exercises: [
                { name: 'Bench Press', details: '3 x 8–12' },
                { name: 'Overhead Press', details: '3 x 8–12' },
                { name: 'Incline DB Press', details: '3 x 10–15' },
                { name: 'Lateral Raises', details: '3 x 12–15' },
                { name: 'Tricep Dips', details: '3 x 10–15' },
            ]},
            { day: 2, title: 'Pull Day', exercises: [
                { name: 'Deadlifts', details: '3 x 6–10' },
                { name: 'Barbell Rows', details: '3 x 8–12' },
                { name: 'Pull-ups', details: '3 x 6–12' },
                { name: 'Bicep Curls', details: '3 x 10–15' },
                { name: 'Face Pulls', details: '3 x 12–15' },
            ]},
            { day: 3, title: 'Legs Day', exercises: [
                { name: 'Squats', details: '3 x 8–12' },
                { name: 'Romanian Deadlifts', details: '3 x 8–12' },
                { name: 'Leg Press', details: '3 x 10–15' },
                { name: 'Calf Raises', details: '3 x 15–20' },
                { name: 'Planks', details: '3 x 30–60s' },
            ]},
            { day: 4, title: 'Rest Day', exercises: [] },
            { day: 5, title: 'Full Body', exercises: [
                { name: 'Squats', details: '3 x 8–12' },
                { name: 'Bench Press', details: '3 x 8–12' },
                { name: 'Pull-ups', details: '3 x 6–12' },
                { name: 'Overhead Press', details: '3 x 8–12' },
                { name: 'Planks', details: '3 x 30–60s' },
            ]},
        ], 7: [
            { day: 1, title: 'Push Day', exercises: [
                { name: 'Bench Press', details: '3 x 8–12' },
                { name: 'Overhead Press', details: '3 x 8–12' },
                { name: 'Incline DB Press', details: '3 x 10–15' },
                { name: 'Lateral Raises', details: '3 x 12–15' },
                { name: 'Tricep Dips', details: '3 x 10–15' },
            ]},
            { day: 2, title: 'Pull Day', exercises: [
                { name: 'Deadlifts', details: '3 x 6–10' },
                { name: 'Barbell Rows', details: '3 x 8–12' },
                { name: 'Pull-ups', details: '3 x 6–12' },
                { name: 'Bicep Curls', details: '3 x 10–15' },
                { name: 'Face Pulls', details: '3 x 12–15' },
            ]},
            { day: 3, title: 'Legs Day', exercises: [
                { name: 'Squats', details: '3 x 8–12' },
                { name: 'Romanian Deadlifts', details: '3 x 8–12' },
                { name: 'Leg Press', details: '3 x 10–15' },
                { name: 'Calf Raises', details: '3 x 15–20' },
                { name: 'Planks', details: '3 x 30–60s' },
            ]},
            { day: 4, title: 'Rest Day', exercises: [] },
            { day: 5, title: 'Push Day 2', exercises: [
                { name: 'DB Bench Press', details: '3 x 8–12' },
                { name: 'Military Press', details: '3 x 8–12' },
                { name: 'Decline Push-ups', details: '3 x 10–15' },
                { name: 'Chest Flyes', details: '3 x 12–15' },
                { name: 'Skull Crushers', details: '3 x 10–15' },
            ]},
            { day: 6, title: 'Pull Day 2', exercises: [
                { name: 'Barbell Deadlifts', details: '3 x 6–10' },
                { name: 'T-Bar Rows', details: '3 x 8–12' },
                { name: 'Lat Pulldowns', details: '3 x 8–12' },
                { name: 'Hammer Curls', details: '3 x 10–15' },
                { name: 'Rear Delt Flyes', details: '3 x 12–15' },
            ]},
            { day: 7, title: 'Legs Day 2', exercises: [
                { name: 'Front Squats', details: '3 x 8–12' },
                { name: 'Sumo Deadlifts', details: '3 x 8–12' },
                { name: 'Hack Squats', details: '3 x 10–15' },
                { name: 'Seated Calf Raises', details: '3 x 15–20' },
                { name: 'Russian Twists', details: '3 x 30–60s' },
            ]},
        ]};
        return plans[days] || plans[7];
    }

    handleSendMessage() {
        const message = this.messageInput.value.trim();
        if (message.length === 0) return;
        this.addMessage(message, true);
        this.messageInput.value = '';
        this.sendMessage(message);
    }

    clearChat() {
        this.chatMessages.innerHTML = '';
        localStorage.removeItem(this.storageKey);
    }

    persistMessage(content, isUser) {
        try {
            const existing = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
            existing.push({ role: isUser ? 'user' : 'bot', content, ts: Date.now() });
            localStorage.setItem(this.storageKey, JSON.stringify(existing).slice(0, 200000));
        } catch (_) {}
    }

    restoreHistory() {
        try {
            const existing = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
            existing.slice(-50).forEach(m => this.addMessage(m.content, m.role === 'user'));
        } catch (_) {}
    }

    escapeHtml(str) {
        return str.replace(/[&<>"]+/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
    }

    toggleScrollBtn() {
        if (!this.scrollBottomBtn) return;
        const nearBottom = (this.chatMessages.scrollHeight - this.chatMessages.scrollTop - this.chatMessages.clientHeight) < 120;
        this.scrollBottomBtn.hidden = nearBottom;
    }

    scrollToBottom() {
        this.chatMessages.scrollTo({ top: this.chatMessages.scrollHeight, behavior: 'smooth' });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ChatInterface();
});