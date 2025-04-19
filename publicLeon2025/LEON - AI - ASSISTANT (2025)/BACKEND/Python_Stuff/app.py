from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import random
import webbrowser
import spacy
from collections import deque
from actions.github_actions import create_github_repo
import os

app = Flask(__name__)
CORS(app)

# Load spaCy model
nlp = spacy.load("en_core_web_sm")

# Context queue to store recent interactions
context_history = deque(maxlen=5)  # Store last 5 interactions for context

# Synonym dictionary for expanded intent matching
synonyms = {
    "greeting": ["hello", "hi", "hey", "sup", "howdy", "greetings"],
    "time": ["time", "clock", "current", "hour", "minute"],
    "youtube": ["youtube", "video", "open youtube", "watch video", "open video"],
    "weather": ["weather", "forecast", "rain", "sunny", "temperature"],
    "search": ["search", "google", "find", "look up"],
    "create_repo": ["create", "new", "repository", "repo", "github"]
}

# Intent detection function with synonyms and context handling
def detect_intent(command):
    doc = nlp(command.lower())

    # Lemmas of the tokens for general matching
    lemmas = [token.lemma_ for token in doc]

    # Named entities (for detecting specific entities like locations, dates, etc.)
    entities = [ent.text.lower() for ent in doc.ents]

    # Matching against synonyms
    for intent, keywords in synonyms.items():
        if any(keyword in lemmas for keyword in keywords):
            return intent

    # Check if there's a greeting in the command
    if any(token.text.lower() in synonyms["greeting"] for token in doc):
        return "greeting"

    return "unknown"

# Generate dynamic responses based on context and intent
def generate_response(intent, command=None):
    # Context-aware responses: adjust based on recent commands
    if len(context_history) > 0:
        last_intent = context_history[-1]
        if last_intent == "weather" and intent == "weather":
            return "Would you like me to look up the weather for a different location?"

    # Intent-based responses with templates
    if intent == "time":
        current_time = datetime.now().strftime('%I:%M %p')
        responses = [
            f"The current time is {current_time}.",
            f"It's {current_time} right now.",
            f"Currently, the time is {current_time}.",
            f"The time is {current_time} o'clock."
        ]
    elif intent == "greeting":
        responses = [
            "Hey there! How can I help today?",
            "Hello! What’s on your mind?",
            "Hi! Need assistance with something?",
            "Greetings! What can I do for you?"
        ]
    elif intent == "youtube":
        responses = [
            "Opening YouTube now.",
            "Sure, launching YouTube.",
            "Firing up YouTube for you!",
            "YouTube is ready to go!"
        ]
        webbrowser.open("https://www.youtube.com")
    elif intent == "weather":
        responses = [
            "Let me check the weather for you.",
            "Looking up the forecast right now.",
            "I'll fetch the weather details for you.",
            "Checking the weather right now!"
        ]
        # You could plug in a weather API here for real-time results.
    elif intent == "search":
        responses = [
            "What would you like me to search for?",
            "Give me the topic, and I’ll find it.",
            "I’m ready to search. What’s on your mind?",
            "What would you like to search for today?"
        ]
    elif intent == "create_repo" and command:
        words = command.split()
        
        repo_name = words[-1] if len(words) > 1 else None

        if not repo_name:  # If repo_name is None, ask for the name
            return "What should be the name of your repository?"
        # Fetch token from environment variable (make sure it's set up correctly)
        github_token = os.getenv("GITHUB_TOKEN")

        if not github_token:
            return "GitHub token not found. Cannot create repository."

        message = create_github_repo(repo_name, github_token)
        return message

    else:
        responses = [
            "I'm not sure how to respond to that.",
            "Can you clarify your request?",
            "I didn’t quite understand. Try again?",
            "Hmm, that’s a bit unclear. Can you rephrase?"
        ]
    return random.choice(responses)

# Response generation based on intent
@app.route('/process-command', methods=['POST'])
def process_command():
    data = request.get_json()
    command = data.get('command', '').strip()

    # Detect intent
    intent = detect_intent(command)
    
    # Save the intent in context history
    context_history.append(intent)

    # Generate response based on intent
    response = generate_response(intent, command)

    return jsonify({'response': response})

if __name__ == '__main__':
    app.run(debug=True)
