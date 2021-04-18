import React, { useEffect, useState } from "react";
import "./Sequence.scss";

import { useLocation } from "react-router-dom";
import { Sequencer } from "./../../../app/components";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

let colAmount = 20;

function Sequence() {
  const [sequenceData, setSequenceData] = useState(null);
  const [loading, setLoading] = useState(true);

  let query = useQuery();

  useEffect(() => {
    if (query.get("name") !== null) {
      loadSequenceData(query.get("name"));
    }
  }, []);

  useEffect(() => {
    setLoading(false);
  }, [sequenceData])

  function loadSequenceData() {
    setSequenceData({
      sequence_data: [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
      ],
      assignments: {
        bernie: 0,
      },
    });
  }

  return (
    <div className="sequence">
      {!loading ? (
        <>
          {" "}
          <Sequencer cols={colAmount} disabled={false} />
          <Sequencer cols={colAmount} disabled={true} />
        </>
      ) : (
        <p>Loading data</p>
      )}
    </div>
  );
}

export default Sequence;
