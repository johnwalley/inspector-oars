import React, { useState, useEffect } from 'react';
import ReactGA from 'react-ga';
import posed, { PoseGroup } from 'react-pose';
import styled from 'styled-components';
import shuffle from './shuffle';
import Question from './Question';
import Result from './Result';
import Rating from './Rating';
import BladesContainer from './BladesContainer';

const numQuestions = 20;

ReactGA.initialize('UA-78521065-3');
ReactGA.pageview(window.location.pathname + window.location.search);

const Container = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  height: 100%;
`;

const Button = styled.button`
  font-size: calc(14px + 1.5vmin);
  border-radius: 0.25rem;
  padding: 10px 18px;
  background-color: #28a745;
  border-color: #28a745;
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
  flex: auto;
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
    boxShadow: '0px 0px 0px rgba(0,0,0,0)',
  },
  hover: {
    scale: 1.1,
    boxShadow: '0px 5px 10px rgba(0,0,0,0.2)',
  },
  press: {
    scale: 0.9,
    boxShadow: '0px 2px 5px rgba(0,0,0,0.1)',
  },
});

const Title = styled.h1`
  font-family: 'Pacifico', cursive;
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
  font-size: calc(20px + 1.5vw);
  font-weight: bold;
  margin: 0;
`;

const PosedResult = posed(Result)({
  enter: {
    y: 0,
    opacity: 1,
    delay: 0,
    transition: {
      y: { type: 'spring', stiffness: 1000, damping: 15 },
      default: { duration: 300 },
    },
  },
  exit: {
    y: 200,
    opacity: 0,
    transition: { duration: 150 },
  },
});

const clubs = [
  'caius',
  'christs',
  'churchill',
  'clare',
  'clarehall',
  'corpus',
  'darwin',
  'downing',
  'emmanuel',
  'fat',
  'girton',
  'homerton',
  'hh',
  'jesus',
  'kings',
  'lmbc',
  'magdalene',
  'murray',
  'newnham',
  'pembroke',
  'peterhouse',
  'queens',
  'robinson',
  'selwyn',
  'sidney',
  'catz',
  'edmunds',
  'tithall',
  'wolfson',
];

const names = {
  caius: 'Caius',
  christs: "Christ's College",
  churchill: 'Churchill College',
  clare: 'Clare',
  clarehall: 'Clare Hall',
  corpus: 'Corpus Christi College',
  darwin: 'Darwin College',
  downing: 'Downing College',
  emmanuel: 'Emmanuel',
  fat: 'First and Third Trinity',
  fitz: 'Fitzwilliam College',
  girton: 'Girton College',
  homerton: 'Homerton College',
  hh: 'Hughes Hall',
  jesus: 'Jesus College',
  kings: "King's College",
  lmbc: 'Lady Margaret',
  magdalene: 'Magdalene',
  murray: 'Murray Edwards College',
  newnham: 'Newnham College',
  pembroke: 'Pembroke College',
  peterhouse: 'Peterhouse',
  queens: "Queens' College",
  robinson: 'Robinson College',
  selwyn: 'Selwyn College',
  sidney: 'Sidney Sussex',
  catz: "St. Catharine's College",
  edmunds: "St. Edmund's College",
  tithall: 'Trinity Hall',
  wolfson: 'Wolfson College',
};

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
  const [items, setItems] = useState(shuffle(clubs).slice(0, 4));

  useEffect(
    () => {
      if (stage === -1) {
        setIntervalId(
          setInterval(() => {
            setItems(shuffle(clubs).slice(0, 4));
          }, 2000)
        );
      }
    },
    [stage]
  );

  function handleStart() {
    clearInterval(intervalId);
    const questions = shuffle(clubs).slice(0, numQuestions);

    ReactGA.event({
      category: 'App',
      action: 'Start',
    });

    setStage(0);
    setQuestions(questions);
    setItems(shuffle(deal(clubs, questions[0], 4)));
  }

  function handleRestart() {
    const questions = shuffle(clubs).slice(0, numQuestions);

    ReactGA.event({
      category: 'App',
      action: 'Restart',
    });

    setStage(-1);
    setItems(shuffle(clubs).slice(0, 4));
    setCorrect(0);
    setCounter(0);
    setQuestions(questions);
  }

  function handleClick(club) {
    let result = null;

    if (club === questions[counter]) {
      setCorrect(correct + 1);
      result = 'correct';
    } else {
      result = 'wrong';
    }

    setResult(result);

    ReactGA.event({
      category: 'Question',
      action: 'Submit answer',
      label: questions[counter],
      value: result === 'correct' ? 1 : 0,
    });

    setTimeout(() => {
      setStage(counter + 1 === numQuestions ? 1 : 0);
      setItems(shuffle(deal(items, questions[counter + 1], 4)));
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
          <PosedButton onClick={handleStart}>Start</PosedButton>
        </div>
      );
      break;
    case 0:
      content = (
        <React.Fragment>
          <Question content={names[questions[counter]]} />
          <PoseGroup>
            {result && (
              <PosedResult key="result" className="result" result={result} />
            )}
          </PoseGroup>
          <BladesContainer items={items} onClick={handleClick} />
          <Counter>
            {counter + 1} / {numQuestions}
          </Counter>
        </React.Fragment>
      );
      break;
    case 1:
      content = (
        <div>
          <p>
            Your score: {correct}/{numQuestions}
          </p>
          <Rating correct={correct} total={numQuestions} />
          <PosedButton onClick={handleRestart}>Play again</PosedButton>
        </div>
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
