import React, { useEffect, useState } from "react";
import "./Sequence.scss";

import { useLocation } from "react-router-dom";
import { Sequencer } from "./../../../app/components";
import { useRainbow } from "../../hooks"
import * as Tone from "tone";

// sound samples
import hihatFile1 from "../../samples/drums/hihat1.wav"
import hihatFile2 from "../../samples/drums/hihat2.wav"
import kickFile from "../../samples/drums/kick.wav"
import snareFile from "../../samples/drums/snare.wav"
import shakerFile from "../../samples/drums/shaker1.wav"

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

let colAmount = 20;

const sampler1 = new Tone.Sampler({
  urls: {
    A1: "A1.mp3",
  },
  baseUrl: "https://tonejs.github.io/audio/casio/",
}).toDestination();

const sampler2 = new Tone.Sampler({
  urls: {
    A1: "A1.mp3",
  },
  baseUrl: "https://tonejs.github.io/audio/salamander/",
}).toDestination();

const sampler3 = new Tone.Players({
  urls: {
    'C1':hihatFile1,
    'D1':hihatFile2,
    'E1':kickFile,
    'G1':snareFile,
    'A1': shakerFile
  },
  baseUrl: "",
}).toDestination();

function Sequence() {
  const [sequenceData, setSequenceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentCol, setCurrCol] = useState(null);
  const [endOfLoop, setEOL] = useState(null);
  const samplers = [sampler1, sampler2, sampler3];
  const noteIndex = ["C", "D", "E", "G", "A"];
  const CHOSEN_OCTAVE = 1;

  const [color, setColor] = useState(0);
  
  const { getColor } = useRainbow(0, 100)

  let query = useQuery();
  let name = query.get("name");

  useEffect(() => {
    if (query.get("name") !== null) {
      loadSequenceData(query.get("name"));
    }
  }, []);

  useEffect(() => {
    setLoading(false);
    if(sequenceData) {
      // hold individual music lists for each track/sequencer
    let tracks = [];
    sequenceData['sequence_data'].map((grid, gridIndex) => {
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
      //console.log(gridIndex, music)
      tracks.push(music);
    })
    //console.log(tracks);
    // Tone.Sequence()
    //@param callback
    //@param "events" to send with callback
    //@param subdivision  to engage callback
    let loop = new Tone.Sequence(
      (time, column) => {
        // Highlight column with styling
        setCurrCol(column);

        //Sends the active note to our Sampler
        tracks.map((music, trackIndex) => {
          if(trackIndex === 2) {
            // if(music[column].length > 0)
            music[column].map((note) => {
              samplers[trackIndex].player(note).start(time, 0,"8n");
            })
          } else {
            samplers[trackIndex].triggerAttackRelease(music[column], "8n", time);
          }
        })
      },
      [...Array(colAmount).keys()],
      "8n"
    ).start(0);
    // cleanup function to dispose old sequence if there are updates
    return () => loop.dispose();
    }
  }, [sequenceData]);

  function loadSequenceData() {
    setSequenceData({
      sequence_data: [
        [...Array(20).keys()].map((x) => [...Array(5).keys()].map(() => false)), 
        [...Array(20).keys()].map((x) => [...Array(5).keys()].map(() => false)), 
        [...Array(20).keys()].map((x) => [...Array(5).keys()].map(() => false))
      ],
      assignments: {
        bernie: 0,
      },
    });
  }

  function updateGrid(updatedGrid) {
    // this function currently will update the first sequence to whatever the last edit was, 
    // bc the updated grid will be from a diff sequence and we use a static current user.
    // should be fine in the final when those are disabled 
    let currentUser = sequenceData.assignments[name];
    let sequence_copy = {...sequenceData};
    sequence_copy['sequence_data'][currentUser] = updatedGrid;
    setSequenceData(sequence_copy);
    // make an api call with updatedGrid
    // setSequenceData(currentUser);
    setColor(getColorScore())
  }

  function getColorScore() {

    if (sequenceData ===  null) {
      return 0;
    }
    
    let current = 0
    let totalPossible = 3 * 5 * 20;

    for (let i = 0; i < sequenceData.sequence_data.length; i++) {
      let current_2d_array = sequenceData.sequence_data[i];

      for (let x = 0; x < current_2d_array.length; x++) {
        for (let y = 0; y < current_2d_array[x].length; y++) {
          if (current_2d_array[x][y]) {
            current += y
          }
        }
      }
    }

    return (current * 3) / totalPossible * 100
  }

  async function playMusic() {
    // Starts our Tone context
    await Tone.start();

    if (isPlaying) {
      // Turn of our player if music is currently playing
      setIsPlaying(false);

      await Tone.Transport.stop();

      return;
    }

    if(!endOfLoop) {
      let gain = new Tone.Gain();// ned this to get the toSeconds function to get accurate times
      let loop = new Tone.Loop((time) => {
        // callback for end of loop goes  here
        console.log("end of loop");
      }, (gain.toSeconds("8n") * colAmount)).start(0);
      setEOL(loop);
    }
    setIsPlaying(true);
    // Toggles playback of our musical masterpiece
    await Tone.Transport.start();
  };

  return (
    <div className="sequence" style={{ backgroundColor: "#" + getColor(color)}}>
      {!loading && sequenceData != null ? (
        <>
          {" "}
          {sequenceData.sequence_data.map(function (data, index) {
            return <Sequencer cols={colAmount} inputGrid={data} disabled={false} key={index} updateGrid={updateGrid} currentCol={currentCol}/>;

            return <Sequencer 
              cols={colAmount} 
              inputGrid={data} 
              disabled={sequenceData.assignments[name] !== index} 
              key={index} 
              updateGrid={updateGrid}
              currentCol={currentCol} 
            />;
          })}
        </>
      ) : (
        <p>Loading data</p>
      )}
      <button className="play-button" onClick={() => playMusic()}>
        {isPlaying ? "Stop" : "Play"}
      </button>
    </div>
  );
}

export default Sequence;
