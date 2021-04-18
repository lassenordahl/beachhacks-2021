import React, { useEffect, useState, useCallback } from "react";
import "./Sequencer.scss";

import * as Tone from "tone";
import { Loop } from "tone";

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
}) {
  const [grid, setGrid] = useState(inputGrid);
  const [isPlaying, setIsPlaying] = useState(false);
  const noteIndex = ["C", "D", "E", "G", "A"];
  const CHOSEN_OCTAVE = 1;

  useEffect(() => {
    let music = [];

    grid.map((column) => {
      let columnNotes = [];
      column.map(
        // boolean value if note should be played from grid
        (shouldPlay, colIndex) =>
          shouldPlay && columnNotes.push(noteIndex[colIndex] + CHOSEN_OCTAVE)
      );
      music.push(columnNotes);
    });
    // Tone.Sequence()
    //@param callback
    //@param "events" to send with callback
    //@param subdivision  to engage callback
    let loop = new Tone.Sequence(
      (time, column) => {
        // Highlight column with styling
        //setCurrentColumn(column);

        //Sends the active note to our Sampler
        sampler.triggerAttackRelease(music[column], "8n", time);
      },
      [...Array(cols).keys()],
      "8n"
    ).start(0);
    return () => loop.dispose();
  }, [grid]);

  const PlayMusic = async () => {
    // Variable for storing our note in a appropriate format for our synth
    let music = [];

    grid.map((column) => {
      let columnNotes = [];
      column.map(
        // boolean value if note should be played from grid
        (shouldPlay, colIndex) =>
          shouldPlay && columnNotes.push(noteIndex[colIndex] + CHOSEN_OCTAVE)
      );
      music.push(columnNotes);
    });

    // Starts our Tone context
    await Tone.start();

    if (isPlaying) {
      // Turn of our player if music is currently playing
      setIsPlaying(false);

      await Tone.Transport.stop();

      return;
    }
    setIsPlaying(true);
    // Toggles playback of our musical masterpiece
    await Tone.Transport.start();
  };

  const handleNoteClick = (row, col) => {
    let copy = [...grid];
    copy[row][col] = copy[row][col] ? false : true;
    setGrid(copy);
  };
  return (
    <div className={`sequencer ${disabled ? "sequencer_disabled" : ""}`}>
      {grid.map((col, rowIndex) => (
        <div className="note-column">
          {col.map((isActive, colIndex) => (
            <NoteButton
              note={noteIndex[colIndex]}
              isActive={grid[rowIndex][colIndex]}
              onClick={() => handleNoteClick(rowIndex, colIndex)}
            />
          ))}
        </div>
      ))}
      <button className="play-button" onClick={() => PlayMusic()}>
        {isPlaying ? "Stop" : "Play"}
      </button>
    </div>
  );
}

export default Sequencer;
