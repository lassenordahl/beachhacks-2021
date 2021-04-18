import React from "react";
import './Card.scss';

function Card(props) {
  return (
    <div className="card box-shadow" style={props.style}>
      <div>
        {props.children}
      </div>
    </div>
  );
}

export default Card;
