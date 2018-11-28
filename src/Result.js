import React from 'react';
import styled from 'styled-components';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const Icon = styled.div`
  position: absolute;
  width: 100vw;
  z-index: 100;
  display: flex;
  justify-content: center;
`;

const Result = React.forwardRef(({ result }, ref) => (
  <Icon ref={ref}>
    {result === 'correct' ? (
      <FaCheckCircle size="200" color="lightgreen" />
    ) : (
      <FaTimesCircle size="200" color="red" />
    )}
  </Icon>
));

export default Result;
