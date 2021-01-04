import React from "react";

const message = (correct, total) => {
  const percentage = (correct / total) * 100;

  if (percentage >= 100) {
    return "Perfect!";
  } else if (percentage >= 80) {
    return "Close!";
  } else {
    return "Time to get revising!";
  }
};

const Rating = ({ correct, total }) => <p>{message(correct, total)}</p>;

export default Rating;
