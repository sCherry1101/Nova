from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import random
from datetime import datetime


PREFIX = "/"


manual_commands = {
    "hello": ["Hello!", "Hi there! How's your day?", "Greetings!"],
    "hi": ["Hi!", "Hello!", "Hey there!"],
    "bye": ["Goodbye!", "See you later!", "Take care!"],
    "help": [
        "I can chat, tell jokes, motivate you, or compliment you.",
        "Try commands like 'joke', 'time', 'compliment me', 'motivate me'."
    ],
    "joke": [
        "Why did the computer go to the doctor? It caught a virus.",
        "Why do programmers prefer dark mode? Because light attracts bugs.",
        "I would tell you a UDP joke, but you might not get it."
    ],
    "time": [f"The current time is {datetime.now().strftime('%H:%M:%S')}."],
    "who made you": ["I was created by my developer."],
    "your name": ["I am Nova, your assistant."],
    "compliment me": [
        "You are doing great today!",
        "You are very smart and creative!",
        "Keep shining, your energy is amazing!"
    ],
    "motivate me": [
        "Keep pushing, success is just around the corner!",
        "You can do anything you set your mind to.",
        "Every small step counts. Never give up!"
    ],
    "about": [
        "I am Nova, a chatbot designed to make your day fun and interactive.",
        "I chat, joke, and respond to commands starting with '/'."
    ]
}


corpus = [
    "how are you",
    "what is your name",
    "tell me something funny",
    "who created you",
    "help me",
    "good morning",
    "good night",
    "how old are you",
    "what can you do",
    "how do i code",
    "i am sad",
    "i am happy",
    "give me advice",
    "how is the weather",
]

responses = [
    "I'm fine, thank you. How about you?",
    "I am Nova, your assistant.",
    "I enjoy telling jokes!",
    "I was created by my developer.",
    "Sure! I am here to help you.",
    "Good morning!",
    "Good night!",
    "I do not have an age.",
    "I can chat, joke, and help you.",
    "I cannot code for you directly, but I can give tips.",
    "I'm sorry to hear that. Things will get better.",
    "I'm glad to hear that!",
    "Always stay positive and take action.",
    "I can't see the weather, but I hope it's nice!"
]


vectorizer = TfidfVectorizer()
X = vectorizer.fit_transform(corpus)


def chat(user_input):
    user_input_lower = user_input.lower()

   
    for key in manual_commands:
        if key in user_input_lower:
            response = random.choice(manual_commands[key])
            
            if key == "time":
                response = f"The current time is {datetime.now().strftime('%H:%M:%S')}."
            return response

    
    user_vec = vectorizer.transform([user_input_lower])
    similarity = cosine_similarity(user_vec, X)
    idx = np.argmax(similarity)
    score = similarity[0][idx]

    if score < 0.1:
        return "I don't understand that. Try typing '/help' for commands."
    return responses[idx]


if __name__ == "__main__":
    print("Nova Chatbot (type '/quit' to exit)")
    while True:
        user_input = input("You: ").strip()

        # Only respond if prefix is present
        if not user_input.startswith(PREFIX):
            continue

        command_text = user_input[len(PREFIX):].strip()

        if command_text.lower() in ["quit", "exit"]:
            print("Nova: Goodbye!")
            break

        reply = chat(command_text)
        print("Nova:", reply)
