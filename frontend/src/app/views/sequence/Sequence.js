import React, { useEffect, useState } from "react";
import "./Sequence.scss";

import { useLocation } from "react-router-dom";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function Sequence() {

  const [ sequenceData, setSequenceData ] = useState(null);

  let query = useQuery();

  useEffect(() => {
    if (query.get("name") !== null) {
      loadSequenceData(query.get("name"))
    }
  }, [])

  function loadSequenceData() {
    setSequenceData({
      "sequence_data": [
        [
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0
        ],
        [
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0
        ],
        [
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0
        ]
      ],
      "assignments": {
        "bernie": 0
      }
    });
  }


  return (
    <div className="sequence">
      
    </div>
  );
}

export default Sequence;
