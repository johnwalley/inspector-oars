import React, { Component } from 'react';
import posed, { PoseGroup } from 'react-pose';
import styled from 'styled-components';
import shuffle from './shuffle';
import Blade from './Blade';
import Question from './Question';
import Result from './Result';
import './App.css';

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
  font-size: calc(30px + 2vw);
  font-weight: bold;
  margin: 0;
`;

const PosedBlade = posed(Blade)({
  pressable: true,
  init: { scale: 1, boxShadow: '0px 0px 0px rgba(0,0,0,0)' },
  press: { scale: 1, boxShadow: '0px 5px 10px rgba(0,0,0,0.2)' },
});

const Item = posed.li({
  enter: {
    x: 0,
    opacity: 1,
  },
  exit: {
    x: 100,
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
  'city',
  'cantabs',
  'nines',
  'champs',
  'neots',
  'catz',
  'emmanuel',
  'darwin',
  'caius',
  'churchill',
  'christs',
];

const names = {
  city: 'City of Cambridge',
  cantabs: 'Cantabrigian',
  nines: "Cambridge '99",
  champs: 'Champion of the Thames',
  neots: 'St Neots',
  catz: 'St Catherines College',
  emmanuel: 'Emmanuel College',
  darwin: 'Darwin College',
  caius: 'Caius College',
  churchill: 'Churchill College',
  christs: "Christ's College",
};

const initialClubs = shuffle(items).slice(0, 4);

class App extends Component {
  state = {
    counter: 0,
    correct: 0,
    result: null,
    question: names[initialClubs[0]],
    items: shuffle(initialClubs),
  };

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
    const { items, result } = this.state;

    return (
      <div className="App">
        <header>
          <Title>Inspector Oars</Title>
        </header>
        <main>
          <Question content={this.state.question} />
          <PoseGroup>
            {result && (
              <PosedResult key="result" className="result" result={result} />
            )}
          </PoseGroup>
          <ul>
            <PoseGroup>
              {items.map(id => (
                <Item key={id} onClick={() => this.handleClick(id)}>
                  <PosedBlade club={id} size="100%" />
                </Item>
              ))}
            </PoseGroup>
          </ul>
          <Counter>
            {this.state.correct} / {this.state.counter}
          </Counter>
        </main>
        <footer>
          <Footer>© 2018 John Walley</Footer>
        </footer>
      </div>
    );
  }
}

export default App;
