import React, { useState } from "react";
import './App.css';

import styled, { keyframes, css } from 'styled-components';
import { shake, fadeIn} from 'react-animations';

const Fade = styled.div`
  animation: 4s ${keyframes`${fadeIn}`};
`;

const shakeAnimation = keyframes`${shake}`;

const ShakeButton = styled.button`
  ${props =>
    props.shake &&
    css`
      animation: 0.5s ${shakeAnimation};
    `}
`;

function App() {
  const [description, setDescription] = useState("");
  const [word, setWord] = useState(""); 
  const [guess, setGuess] = useState("");
  const [result, setResult] = useState("");
  const [revealed, setReveal] = useState("");
  const [shakeGuessButton, setShakeGuessButton] = useState(false);

  const getRiddle = async () => {
    const res = await fetch("http://localhost:5000/generate");
    const data = await res.json();
    setDescription(data.description);
    setWord(data.word); 
    setResult("");
    setGuess("");
    setReveal("");
  };

  const submitGuess = async () => {
    const res = await fetch("http://localhost:5000/guess", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ guess, actual_word: word }), 
    });
    const data = await res.json();
    setResult(data.correct ? "Nice, you got it!" : "Try again.");

    if (!data.correct) {
    setShakeGuessButton(true);
    setTimeout(() => setShakeGuessButton(false), 500); 
  }
  };

  const reveal = () => {
    setReveal(word);
  };

  return (
    <div className="Game">
      <div className="card">
      <Fade bottom></Fade>
      <Fade><h1>Guess the Word</h1></Fade>
      <button onClick={getRiddle}>New Riddle</button>
      <p><strong>Description:</strong> {description}</p>
      <input
        value={guess}
        onChange={(e) => setGuess(e.target.value)}
      />
      <ShakeButton shake={shakeGuessButton} onClick={submitGuess}>
  Submit Guess
</ShakeButton>
      <p>{result}</p>
      <button onClick={reveal}>Reveal</button>
      <p>{revealed}</p>
      </div>
    </div>
  );
}

export default App;
