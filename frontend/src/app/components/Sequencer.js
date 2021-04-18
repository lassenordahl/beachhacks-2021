import React, {useState} from "react";
import * as Tone from "tone";

const default_sampler = new Tone.Sampler({
  urls: {
    A1: "A1.mp3",
  },
  baseUrl: "https://tonejs.github.io/audio/casio/"
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
    <button className={class_used} {...rest}>
      {note}
    </button>
  );
};

export default function Sequencer({sampler=default_sampler, cols=8}) {
  const [grid, setGrid] = useState(GenerateGrid(cols));
  const [isPlaying, setIsPlaying] = useState(false);
  const noteIndex = {0: "C", 1: "D", 2: "E", 3: "G", 4: "A"};
  const CHOSEN_OCTAVE = 1;

  function playNote(note) {
    sampler.triggerAttackRelease(`${note}1`, "8n");
  }
  const PlayMusic = async () => {
    // Variable for storing our note in a appropriate format for our synth
    let music = [];

    grid.map((column) => {
      let columnNotes = [];
      column.map(
        // boolean value if note should be played from grid
        (shouldPlay, colIndex) =>
          shouldPlay &&
          columnNotes.push(noteIndex[colIndex] + CHOSEN_OCTAVE)
      );
      music.push(columnNotes);
    });

    // Starts our Tone context
    await Tone.start();

    // Tone.Sequence()
    //@param callback
    //@param "events" to send with callback
    //@param subdivision  to engage callback
    const Sequencer = new Tone.Sequence(
      (time, column) => {
        // Highlight column with styling
        //setCurrentColumn(column);

        //Sends the active note to our Sampler
        sampler.triggerAttackRelease(music[column], "8n", time);
      },
      [0, 1, 2, 3, 4, 5, 6, 7],
      "8n"
    );

    if (isPlaying) {
      // Turn of our player if music is currently playing
      setIsPlaying(false);
      //setCurrentColumn(null);

      await Tone.Transport.stop();
      await Sequencer.stop();
      await Sequencer.clear();
      await Sequencer.dispose();

      return;
    }
    setIsPlaying(true);
    // Toggles playback of our musical masterpiece
    await Sequencer.start();
    await Tone.Transport.start();
  };

  const handleNoteClick = (row, col) => {
    let copy = [...grid];
    copy[row][col] = copy[row][col] ? false : true;
    setGrid(copy);
  }
  return (
    <div className="sequencer">
      {grid.map((col, rowIndex) => (
        <div className="note-column">
          {col.map((isActive, colIndex) => (
            <NoteButton note={noteIndex[colIndex]} isActive={grid[rowIndex][colIndex]} onClick={() => handleNoteClick(rowIndex, colIndex)}/>
          ))}
        </div>
      ))}
      <button className="play-button" onClick={() => PlayMusic()}>
        {isPlaying ? "Stop" : "Play"}
      </button>
    </div>
  );
}
