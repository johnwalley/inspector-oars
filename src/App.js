import React, { useState, useEffect } from "react";
import ReactGA from "react-ga";
import posed, { PoseGroup } from "react-pose";
import { FacebookShareButton, FacebookIcon } from "react-share";
import styled from "styled-components";
import { clubs, shortNames } from "react-rowing-blades";
import shuffle from "./shuffle";
import Question from "./Question";
import Result from "./Result";
import Rating from "./Rating";
import BladesContainer from "./BladesContainer";

const numQuestions = 20;

ReactGA.initialize("UA-78521065-3");
ReactGA.pageview(window.location.pathname + window.location.search);

const StyledFacebookShareButton = styled(FacebookShareButton)`
  cursor: pointer;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  height: 100%;
`;

const Button = styled.button`
  font-size: calc(12px + 1.5vmin);
  border-radius: 0.25rem;
  padding: 8px 18px;
  margin: 8px;
  background-color: ${(props) => props.color};
  border-color: #000000;
  color: white;
  cursor: pointer;
`;

const Intro = styled.p`
  padding: 0px 28px;
  margin: 4px 0px 12px 0px;
  font-size: calc(10px + 2vmin);
`;

const Main = styled.main`
  min-height: 200px;
  height: 70%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
`;

const PosedButton = posed(Button)({
  hoverable: true,
  pressable: true,
  init: {
    scale: 1,
    boxShadow: "0px 0px 0px rgba(0,0,0,0)",
  },
  hover: {
    scale: 1.1,
    boxShadow: "0px 5px 10px rgba(0,0,0,0.2)",
  },
  press: {
    scale: 0.9,
    boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
  },
});

const Title = styled.h1`
  font-family: "Pacifico", cursive;
  background-color: #282c34;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(20px + 2vw);
  color: white;
  margin: 0;
  padding: 10px;
`;

const Counter = styled.p`
  font-size: ${(props) => `calc(${props.small ? "12px" : "20px"} + 1.5vw)`};
  font-weight: bold;
  margin: 0;
  margin-bottom: 10px;
`;

const PosedResult = posed(Result)({
  enter: {
    y: 0,
    opacity: 1,
    delay: 0,
    transition: {
      y: { type: "spring", stiffness: 1000, damping: 15 },
      default: { duration: 300 },
    },
  },
  exit: {
    y: 200,
    opacity: 0,
    transition: { duration: 150 },
  },
});

const deal = (arr, selected, n) => {
  const forbidden = [selected];

  while (forbidden.length < n) {
    const i = Math.floor(Math.random() * arr.length);

    if (!forbidden.includes(arr[i])) {
      forbidden.push(arr[i]);
    }
  }

  return forbidden;
};

function App() {
  const [intervalId, setIntervalId] = useState(0);
  const [stage, setStage] = useState(-1);
  const [counter, setCounter] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [result, setResult] = useState(null);
  const [questions, setQuestions] = useState(null);
  const [category, setCategory] = useState(null);
  const [items, setItems] = useState(
    shuffle(clubs.cambridge.concat(clubs.oxford, clubs.uk)).slice(0, 4)
  );

  useEffect(() => {
    if (stage === -1) {
      setIntervalId(
        setInterval(() => {
          setItems(
            shuffle(clubs.cambridge.concat(clubs.oxford, clubs.uk)).slice(0, 4)
          );
        }, 2000)
      );
    }
  }, [stage]);

  function handleStart(category) {
    clearInterval(intervalId);
    const questions = shuffle(clubs[category]).slice(0, numQuestions);

    ReactGA.event({
      category: "App",
      action: "Start",
      label: category,
    });

    setStage(0);
    setQuestions(questions);
    setItems(shuffle(deal(clubs[category], questions[0], 4)));
    setCategory(category);
  }

  function handleRestart() {
    ReactGA.event({
      category: "App",
      action: "Restart",
    });

    setStage(-1);
    setItems(shuffle(clubs.cambridge.concat(clubs.oxford)).slice(0, 4));
    setCorrect(0);
    setCounter(0);
  }

  function handleClick(club) {
    let result = null;

    if (club === questions[counter]) {
      setCorrect(correct + 1);
      result = "correct";
    } else {
      result = "wrong";
    }

    setResult(result);

    ReactGA.event({
      category: "Question",
      action: "Submit answer",
      label: questions[counter],
      value: result === "correct" ? 1 : 0,
    });

    setTimeout(() => {
      setStage(counter + 1 === numQuestions ? 1 : 0);
      setItems(shuffle(deal(clubs[category], questions[counter + 1], 4)));
      setCounter(counter + 1);
      setResult(null);
    }, 1000);
  }

  let content = null;

  switch (stage) {
    case -1:
      content = (
        <div>
          <BladesContainer items={items} animated />
          <Intro>
            Do you think you can identify all these rowing club blades? Take the
            Inspector Oars quiz to find out!
          </Intro>
          <PosedButton onClick={() => handleStart("cambridge")} color="#a3C1ad">
            Start Cambridge Edition
          </PosedButton>
          <PosedButton onClick={() => handleStart("oxford")} color="#002147">
            Start Oxford Edition
          </PosedButton>
          <PosedButton onClick={() => handleStart("uk")} color="#001f7e">
            Start UK Edition
          </PosedButton>
        </div>
      );
      break;
    case 0:
      content = (
        <React.Fragment>
          <Question content={shortNames[category][questions[counter]]} />
          <PoseGroup>
            {result && (
              <PosedResult key="result" className="result" result={result} />
            )}
          </PoseGroup>
          <BladesContainer
            items={items}
            correct={result && questions[counter]}
            onClick={handleClick}
          />
          <Counter>Score: {correct}</Counter>
          <Counter small>
            Question: {counter + 1} / {numQuestions}
          </Counter>
        </React.Fragment>
      );
      break;
    case 1:
      content = (
        <React.Fragment>
          <p>
            Your score: {correct}/{numQuestions}
          </p>
          <Rating correct={correct} total={numQuestions} />
          <PosedButton onClick={handleRestart} color="#28a745">
            Play again
          </PosedButton>
          <StyledFacebookShareButton
            url="https://www.inspectoroars.co.uk"
            quote={`I correctly identified ${correct} out of ${numQuestions} ${
              category.charAt(0).toUpperCase() + category.slice(1)
            } college rowing blades`}
          >
            <FacebookIcon size={64} />
          </StyledFacebookShareButton>
        </React.Fragment>
      );
      break;
    default:
      content = null;
  }

  return (
    <Container>
      <header>
        <Title>Inspector Oars</Title>
      </header>
      <Main>{content}</Main>
    </Container>
  );
}

export default App;
