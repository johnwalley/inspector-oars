import React from 'react';
import styled from 'styled-components';
import posed, { PoseGroup } from 'react-pose';
import Blade from 'react-rowing-blades';

const BladeContainer = styled.ul`
  list-style: none;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  flex-direction: row;
  display: flex;
  max-width: 90vw;
  padding: 0px;
  margin: 8px 0px 0px 0px;
`;

const Item = posed.li({
  pressable: true,
  normal: { filter: 'grayscale(0%) blur(0px)', scale: 1 },
  correct: { filter: 'grayscale(0%) blur(0px)', scale: 1.6 },
  wrong: { filter: 'grayscale(100%) blur(10px)', scale: 1 },
  init: { scale: 1 },
  press: { scale: 1.2 },
  preEnter: {
    y: 40,
    opacity: 0,
  },
  enter: {
    y: 0,
    opacity: 1,
    transition: {
      y: { type: 'spring', stiffness: 1000, damping: 15 },
      default: { duration: 100 },
    },
  },
  exit: {
    y: -40,
    opacity: 0,
  },
});

const StyledItem = styled(Item)`
  display: block;
  width: 18vw;
  height: 100%;
  margin: 10px 10px 0px 10px;
  -webkit-tap-highlight-color: rgba(255, 255, 255, 0);

  @media (orientation: portrait) {
    width: 38vw;
    height: 100%;
    margin: 10px;
  }
`;

const StyledBlade = styled(Blade)`
  cursor: pointer;
`;

const BladesContainer = ({
  items,
  correct = null,
  onClick = () => {},
  animated = false,
}) => (
  <BladeContainer>
    <PoseGroup preEnterPose="preEnter">
      {items.map((id, i) => (
        <StyledItem
          key={animated ? Math.floor(Math.random() * 1000000) : i}
          onClick={() => onClick(id)}
          pose={
            correct === null ? 'normal' : correct === id ? 'correct' : 'wrong'
          }
        >
          <StyledBlade club={id} />
        </StyledItem>
      ))}
    </PoseGroup>
  </BladeContainer>
);

export default BladesContainer;
