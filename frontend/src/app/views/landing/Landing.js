import React, { useEffect, useState } from "react";
import "./Landing.scss";

import { useHistory } from "react-router-dom";

import Button from 'react-bootstrap/Button';

function Landing() {
  const [name, setName] = useState(null);
  const [showNameInput, setNameInput] = useState(false);
  
  let history = useHistory();

  function loadApp() {
    history.push(`/sequence?name=${name}`);
  }

  function handleButtonAction() {
    if (showNameInput) {
      loadApp();
    } else {
      setNameInput(true);
    }
  }

  function showButtonText() {
    if (showNameInput) {
      return "Start";
    } else {
      return "Enter";
    }
  }

  return (
    <div className="landing">
      <div className="landing__card">
        <h1>
          Crowd<span>Sequence</span>
        </h1>
        <p>Create music with your friends, family, and other hackers!</p>
        {showNameInput ? (
          <input
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></input>
        ) : null}
        <Button className="button-wide" onClick={() => handleButtonAction()}>{showButtonText()}</Button>
      </div>
    </div>
  );
}

export default Landing;
