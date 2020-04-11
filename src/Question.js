import React from 'react';
import styled from 'styled-components';

const Question = styled.h1`
  font-size: calc(30px + 2vw);
  padding-top: 8px;
  margin: 0;
`;

export default ({ content }) => <Question>{content}</Question>;
