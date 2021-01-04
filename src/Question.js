import React from "react";
import styled from "styled-components";

const QuestionWrapper = styled.h1`
  font-size: calc(30px + 2vw);
  padding-top: 8px;
  margin: 0;
`;

const Question = ({ content }) => <QuestionWrapper>{content}</QuestionWrapper>;

export default Question;
