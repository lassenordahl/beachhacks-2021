import React, { useEffect, useState } from "react";
import "./Sequence.scss";

import { useLocation } from "react-router-dom";
import { Sequencer } from "./../../../app/components";
import { useRainbow } from "../../hooks"
import * as Tone from "tone";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

let colAmount = 20;

function Sequence() {
  const [sequenceData, setSequenceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
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
    let currentUser = sequenceData.assignments[name]

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
            return <Sequencer cols={colAmount} inputGrid={data} disabled={false} key={index} updateGrid={updateGrid}/>;

            return <Sequencer cols={colAmount} inputGrid={data} disabled={sequenceData.assignments[name] !== index} key={index} updateGrid={updateGrid}/>;
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
