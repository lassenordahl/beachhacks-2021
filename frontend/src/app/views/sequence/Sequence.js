import React, { useEffect, useState } from "react";
import "./Sequence.scss";

import { useLocation } from "react-router-dom";
import { Sequencer } from "./../../../app/components";
import * as Tone from "tone";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

let colAmount = 20;

function Sequence() {
  const [sequenceData, setSequenceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

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

  function updateTotalSequence() {
    setSequenceData();
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
    <div className="sequence">
      {!loading && sequenceData != null ? (
        <>
          {" "}
          {sequenceData.sequence_data.map(function (data, index) {
            return <Sequencer cols={colAmount} inputGrid={data} disabled={sequenceData.assignments[name] !== index} key={index} />;
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
