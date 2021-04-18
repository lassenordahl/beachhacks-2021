import React from "react";

var Rainbow = require('rainbowvis.js');
var myRainbow = new Rainbow();

function useRainbow( minNumber, maxNumber ) {

  var rainbow = new Rainbow();

  // rainbow.setSpectrum("#002e4d", "#059aff")
  rainbow.setNumberRange(minNumber, maxNumber);

  function getColor(number) {
    return rainbow.colourAt(number);
  }

  return {
    getColor,
  }
}

export default useRainbow;