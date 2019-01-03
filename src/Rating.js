import React from 'react';
import styled from 'styled-components';

const Rating = styled.p``;

const message = (correct, total) => {
  const percentage = (correct / total) * 100;

  if (percentage >= 100) {
    return 'Perfect!';
  } else if (percentage >= 80) {
    return 'Close!';
  } else {
    return 'Time to get revising!';
  }
};

export default ({ correct, total }) => (
  <Rating>{message(correct, total)}</Rating>
);

