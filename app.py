import os 
import random
from flask import Flask, jsonify, request
import requests
from groq import Groq
from flask_cors import CORS
from dotenv import load_dotenv

from typing import Optional

app = Flask(__name__)
CORS(app)

load_dotenv()

client = Groq(api_key=os.getenv('GROQKEY'))



@app.route("/generate", methods=["GET"])
def generate():
    words = (requests.get("https://random-word-api.vercel.app/api?words=1&length=4")).json()
    w = words[0]
    prompt = f"Give a creative description and dont make it too hard(as if for a game) where the word is '{w}', but do not say the word itself."

    chatcomp = client.chat.completions.create(
        messages=[{"role": "user", "content": prompt}],
        model="llama-3.3-70b-versatile"
    )

    description = chatcomp.choices[0].message.content + f"The word is {len(w)} letters long"
    return jsonify({"description": description, "word": w})

@app.route("/guess", methods=["POST"])
def check_guess():
    data = request.json
    correct = data.get("actual_word", "").strip().lower() == data.get("guess", "").strip().lower()
    return jsonify({"correct": correct})

if __name__ == "__main__":
    app.run(debug=True)