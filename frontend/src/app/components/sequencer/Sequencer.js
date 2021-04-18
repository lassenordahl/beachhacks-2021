import React, { useEffect, useState, useCallback } from "react";
import "./Sequencer.scss";

import * as Tone from "tone";

const default_sampler = new Tone.Sampler({
  urls: {
    A1: "A1.mp3",
  },
  baseUrl: "https://tonejs.github.io/audio/casio/",
}).toDestination();

// Function which creates a 5xn grid,
// with our chosen notes on the vertical axis
function GenerateGrid(n) {
  const grid = [];
  for (let i = 0; i < n; i++) {
    grid.push(new Array(5).fill(false));
  }
  return grid;
}

const NoteButton = ({ note, isActive, ...rest }) => {
  const class_used = isActive ? "note note--active" : "note";
  return (
    <button className={`${class_used} sequencer__note_block`} {...rest}>
      {/* {note} */}
    </button>
  );
};

function Sequencer({
  sampler = default_sampler,
  cols = 8,
  disabled = false,
  inputGrid,
  updateGrid,
  currentCol,
  name
}) {
  const [grid, setGrid] = useState(inputGrid);
  const noteIndex = ["C", "D", "E", "G", "A"];
  const CHOSEN_OCTAVE = 1;

  const handleNoteClick = (row, col) => {
    let copy = [...grid];
    copy[row][col] = copy[row][col] ? false : true;
    setGrid(copy);
    updateGrid(copy)
  };

  useEffect(() => {
    setGrid(inputGrid);
  }, [inputGrid]);

  return (
    <div className={`sequencer ${disabled ? "sequencer_disabled" : ""}`}>
      <div>{name}</div>
      {grid.map((col, rowIndex) => (
        <div className={currentCol === rowIndex ? "note-column note-column--active" : "note-column"}>
          {col.map((isActive, colIndex) => (
            <NoteButton
              note={noteIndex[colIndex]}
              isActive={grid[rowIndex][colIndex]}
              onClick={() => handleNoteClick(rowIndex, colIndex)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default Sequencer;
