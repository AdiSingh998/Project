import React, { useState } from "react";
import './App.css'

function App() {
  const [description, setDescription] = useState("");
  const [word, setWord] = useState(""); 
  const [guess, setGuess] = useState("");
  const [result, setResult] = useState("");
  const [revealed, setreveal] = useState("")

  const getRiddle = async () => {
    const res = await fetch("http://localhost:5000/generate");
    const data = await res.json();
    setDescription(data.description);
    setWord(data.word); 
    setResult("");
    setGuess("");
  };
const submitGuess = async () => {
    const res = await fetch("http://localhost:5000/guess", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ guess, actual_word: word }), 
    });
    const data = await res.json();
    setResult(data.correct ? "Nice, you got it!" : "Try again.");
  };
const reveal= async () => {
  setreveal(word)

}

  return (
    <div className="Game">
      <h1>Guess the Word</h1>
      <button onClick={getRiddle}>New Riddle</button>
      <p><strong>Description:</strong> {description}</p>
      <input
        value={guess}
        onChange={(e) => setGuess(e.target.value)}
        
      />
      <button onClick={submitGuess}>Submit Guess</button>
      <p>{result}</p>

      <button onClick={reveal}>Reveal</button>
      <p>{revealed}</p>
    </div>
  );
}

export default App;