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
      <FaCheckCircle size="200" color="rgba(40,255,40,1)" />
    ) : (
      <FaTimesCircle size="200" color="rgba(255,0,0,1)" />
    )}
  </Icon>
));

export default Result;
