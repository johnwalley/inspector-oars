import React, { Component } from 'react';
import ReactGA from 'react-ga';
import posed, { PoseGroup } from 'react-pose';
import styled from 'styled-components';
import shuffle from './shuffle';
import { Blade } from 'react-rowing-blades';
import Question from './Question';
import Result from './Result';
import Rating from './Rating';

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

const Item = posed.li({
  pressable: true,
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

const items = [
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

const numQuestions = 20;

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

class App extends Component {
  intervalId = 0;

  state = {
    stage: -1,
    counter: 0,
    correct: 0,
    result: null,
    items: shuffle(items).slice(0, 4),
  };

  componentDidMount() {
    this.intervalId = setInterval(() => {
      this.setState({
        items: shuffle(items).slice(0, 4),
      });
    }, 2000);
  }

  handleStart() {
    clearInterval(this.intervalId);
    const questions = shuffle(items).slice(0, numQuestions);

    ReactGA.event({
      category: 'App',
      action: 'Start',
    });

    this.setState({
      stage: 0,
      questions: questions,
      items: shuffle(deal(items, questions[0], 4)),
    });
  }

  handleRestart() {
    const questions = shuffle(items).slice(0, numQuestions);

    this.intervalId = setInterval(() => {
      this.setState({
        items: shuffle(items).slice(0, 4),
      });
    }, 2000);

    ReactGA.event({
      category: 'App',
      action: 'Restart',
    });

    this.setState({
      stage: -1,
      counter: 0,
      correct: 0,
      questions: questions,
      items: shuffle(items).slice(0, 4),
    });
  }

  handleClick(club) {
    let correct = this.state.correct;
    let result = null;

    if (club === this.state.questions[this.state.counter]) {
      correct += 1;
      result = 'correct';
    } else {
      result = 'wrong';
    }

    this.setState({ result: result });

    ReactGA.event({
      category: 'Question',
      action: 'Submit answer',
      label: this.state.questions[this.state.counter],
      value: result === 'correct' ? 1 : 0,
    });

    const selectedClubs = shuffle(
      deal(items, this.state.questions[this.state.counter + 1], 4)
    );

    setTimeout(
      () =>
        this.setState({
          stage: this.state.counter + 1 === numQuestions ? 1 : 0,
          items: selectedClubs,
          correct: correct,
          counter: this.state.counter + 1,
          result: null,
        }),
      1000
    );
  }

  render() {
    const { stage, items, result } = this.state;

    let content = null;

    switch (stage) {
      case -1:
        content = (
          <div>
            <BladeContainer>
              <PoseGroup preEnterPose="preEnter">
                {items.map((id, i) => (
                  <StyledItem key={Math.floor(Math.random() * 1000000)}>
                    <StyledBlade club={id} />
                  </StyledItem>
                ))}
              </PoseGroup>
            </BladeContainer>
            <Intro>
              Do you think you can identify all these rowing club blades? Take
              the Inspector Oars quiz to find out!
            </Intro>
            <PosedButton onClick={() => this.handleStart()}>Start</PosedButton>
          </div>
        );
        break;
      case 0:
        content = (
          <React.Fragment>
            <Question
              content={names[this.state.questions[this.state.counter]]}
            />
            <PoseGroup>
              {result && (
                <PosedResult key="result" className="result" result={result} />
              )}
            </PoseGroup>
            <BladeContainer>
              <PoseGroup preEnterPose="preEnter">
                {items.map((id, i) => (
                  <StyledItem key={i} onClick={() => this.handleClick(id)}>
                    <StyledBlade club={id} />
                  </StyledItem>
                ))}
              </PoseGroup>
            </BladeContainer>
            <Counter>
              {this.state.counter + 1} / {numQuestions}
            </Counter>
          </React.Fragment>
        );
        break;
      case 1:
        content = (
          <div>
            <p>
              Your score: {this.state.correct}/{numQuestions}
            </p>
            <Rating correct={this.state.correct} total={numQuestions} />
            <PosedButton onClick={() => this.handleRestart()}>
              Play again
            </PosedButton>
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
}

export default App;
