import React, { Component } from 'react';
import posed, { PoseGroup } from 'react-pose';
import styled from 'styled-components';
import shuffle from './shuffle';
import { Blade } from 'react-rowing-blades';
import Question from './Question';
import Result from './Result';
import './App.css';

const Button = styled.button`
  font-size: 32px;
  border-radius: 0.25rem;
  padding: 10px 18px;
  background-color: #28a745;
  border-color: #28a745;
  color: white;
  cursor: pointer;
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

const Footer = styled.h2`
  font-size: calc(8px + 0.4vw);
  background-color: #282c34;
  margin: 0;
  padding: 10px;
`;

const Counter = styled.p`
  font-size: calc(20px + 1.5vw);
  font-weight: bold;
  margin: 0;
`;

const PosedBlade = posed(Blade)({});

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
  'fitz',
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

const initialClubs = shuffle(items).slice(0, 4);

class App extends Component {
  intervalId = 0;

  state = {
    stage: -1,
    counter: 1,
    correct: 0,
    result: null,
    question: names[initialClubs[0]],
    items: shuffle(initialClubs),
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
    this.setState({
      stage: 0,
      question: names[initialClubs[0]],
      items: shuffle(initialClubs),
    });
  }

  handleRestart() {
    this.intervalId = setInterval(() => {
      this.setState({
        items: shuffle(items).slice(0, 4),
      });
    }, 2000);

    this.setState({ stage: -1, counter: 1, correct: 0 });
  }

  handleClick(club) {
    let correct = this.state.correct;

    if (names[club] === this.state.question) {
      correct += 1;
      this.setState({ result: 'correct' });
    } else {
      this.setState({ result: 'wrong' });
    }

    const selectedClubs = shuffle(items).slice(0, 4);

    setTimeout(
      () =>
        this.setState({
          stage: this.state.counter === numQuestions ? 1 : 0,
          question: names[shuffle(selectedClubs.slice())[0]],
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
            <ul>
              <PoseGroup preEnterPose="preEnter">
                {items.map(id => (
                  <Item key={id}>
                    <PosedBlade club={id} className="blade" />
                  </Item>
                ))}
              </PoseGroup>
            </ul>
            <p style={{ padding: '28px 10px' }}>
              Do you think you can identify all these rowing club blades? Take
              the Inspector Oars quiz to find out!
            </p>
            <PosedButton onClick={() => this.handleStart()}>Start</PosedButton>
          </div>
        );
        break;
      case 0:
        content = (
          <React.Fragment>
            <Question content={this.state.question} />
            <PoseGroup>
              {result && (
                <PosedResult key="result" className="result" result={result} />
              )}
            </PoseGroup>
            <ul>
              <PoseGroup preEnterPose="preEnter">
                {items.map(id => (
                  <Item key={id} onClick={() => this.handleClick(id)}>
                    <PosedBlade club={id} className="blade" />
                  </Item>
                ))}
              </PoseGroup>
            </ul>
            <Counter>
              {this.state.counter} / {numQuestions}
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
            <PosedButton onClick={() => this.handleRestart()}>
              Play again
            </PosedButton>
          </div>
        );
        break;
    }

    return (
      <div className="App">
        <header>
          <Title>Inspector Oars</Title>
        </header>
        <main>{content}</main>
        <footer>
          <Footer>© 2018 John Walley</Footer>
        </footer>
      </div>
    );
  }
}

export default App;
