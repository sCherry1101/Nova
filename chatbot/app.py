# app.py
from flask import Flask, request, jsonify, render_template
from nova import chat  

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('chat.html') 

@app.route('/get_response', methods=['POST'])
def get_response():
    user_input = request.json.get("message", "")
    response = chat(user_input)
    return jsonify({"response": response})

if __name__ == "__main__":
    app.run(debug=True)
