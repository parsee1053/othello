import React, { Component } from 'react';
import './App.css';

const EMPTY = 0;
const BLACK = 1;
const WHITE = -1;
const BOARD_SIZE = 8;
const dx = [-1, 0, 1, -1, 1, -1, 0, 1];
const dy = [-1, -1, -1, 0, 0, 1, 1, 1];

const Square = (props) => {
  return (
    <button className={'Square ' + (props.value === BLACK ? 'Black' : (props.value === WHITE ? 'White' : 'Empty'))}
      onClick={props.onClick}>
      {props.value !== EMPTY ? '\u25cf' : null}
    </button>
  );
};

function Board(props) {
  function renderSquare(i, j) {
    return (
      <Square
        key={i + "-" + j}
        value={props.squares[i][j]}
        onClick={() => props.onClick(i, j)} />
    );
  }

  return (
    <div className="Board">
      {Array(BOARD_SIZE).fill(0).map((_, row) => {
        return (
          <div key={row} className="Board-Row">
            {Array(BOARD_SIZE).fill(row).map((value, index) => renderSquare(value, index))}
          </div>
        );
      })}
    </div>
  );
}

class Game extends Component {
  constructor() {
    super();
    const initArray = JSON.parse(JSON.stringify((new Array(BOARD_SIZE)).fill((new Array(BOARD_SIZE)).fill(EMPTY))));
    initArray[3][3] = WHITE;
    initArray[4][3] = BLACK;
    initArray[3][4] = BLACK;
    initArray[4][4] = WHITE;
    this.state = {
      history: [
        {
          squares: initArray,
        }
      ],
      stepNumber: 0,
      turn: BLACK,
      passCount: 0,
    };

    this.reset = this.reset.bind(this);
  }

  componentDidUpdate() {
    let isPass = true;
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    for (let a = 0; a < BOARD_SIZE; a++) {
      for (let b = 0; b < BOARD_SIZE; b++) {
        if (squares[a][b] === EMPTY && this.check(a, b, squares)) {
          isPass = false;
        }
      }
    }
    if (isPass) {
      let passCount = this.state.passCount;
      if (this.state.passCount === 0) {
        passCount++;
        this.setState({
          turn: this.state.turn === BLACK ? WHITE : BLACK,
          passCount: passCount,
        });
      } else if (this.state.passCount === 1) {
        passCount++;
        this.setState({
          passCount: passCount,
        });
      }
    }
  }

  handleClick(i, j) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (this.state.passCount >= 2) {
      return;
    }
    if (!this.put(i, j, squares)) {
      alert('その場所には置けません');
      return;
    }
    this.setState({
      history: history.concat([
        {
          squares: squares,
        }
      ]),
      stepNumber: history.length,
      turn: this.state.turn === BLACK ? WHITE : BLACK,
      passCount: 0,
    });
  }

  checkReverse(i, j, d, squares) {
    let flag = false;
    while (true) {
      i += dx[d];
      j += dy[d];
      if (i < 0 || i >= BOARD_SIZE || j < 0 || j >= BOARD_SIZE) {
        return false;
      }
      if (squares[i][j] === EMPTY) {
        return false;
      }
      if (squares[i][j] === (this.state.turn === BLACK ? WHITE : BLACK)) {
        flag = true;
        continue;
      }
      if (flag) {
        break;
      }
      return false;
    }
    return true;
  }

  check(i, j, squares) {
    for (let d = 0; d < 8; d++) {
      if (this.checkReverse(i, j, d, squares)) {
        return true;
      }
    }
    return false;
  }

  reverse(i, j, d, squares) {
    while (true) {
      i += dx[d];
      j += dy[d];
      if (squares[i][j] === (this.state.turn === BLACK ? BLACK : WHITE)) {
        break;
      }
      squares[i][j] = this.state.turn === BLACK ? BLACK : WHITE;
    }
  }

  put(i, j, squares) {
    let flag = false;
    if (squares[i][j] !== EMPTY) {
      return false;
    }
    for (let d = 0; d < 8; d++) {
      if (this.checkReverse(i, j, d, squares)) {
        this.reverse(i, j, d, squares);
        flag = true;
      }
    }
    if (flag) {
      squares[i][j] = this.state.turn === BLACK ? BLACK : WHITE;
      return true;
    }
    return false;
  }

  reset() {
    if (window.confirm('リセットします．よろしいですか？')) {
      const initArray = JSON.parse(JSON.stringify((new Array(BOARD_SIZE)).fill((new Array(BOARD_SIZE)).fill(EMPTY))));
      initArray[3][3] = WHITE;
      initArray[4][3] = BLACK;
      initArray[3][4] = BLACK;
      initArray[4][4] = WHITE;
      this.setState({
        history: [
          {
            squares: initArray,
          }
        ],
        stepNumber: 0,
        turn: BLACK,
        passCount: 0,
      });
    }
  }

  count(color, squares) {
    let count = 0;
    for (let a = 0; a < BOARD_SIZE; a++) {
      for (let b = 0; b < BOARD_SIZE; b++) {
        if (squares[a][b] === color) {
          count++;
        }
      }
    }
    return count;
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const isEnd = this.state.passCount >= 2 ? true : false;
    const blackCount = this.count(BLACK, current.squares);
    const whiteCount = this.count(WHITE, current.squares);
    let status;
    if (isEnd) {
      if (blackCount > whiteCount) {
        status = '黒の勝ちです';
      } else if (blackCount < whiteCount) {
        status = '白の勝ちです';
      } else {
        status = '引き分けです';
      }
    } else {
      status = (this.state.turn === BLACK ? '黒' : '白') + 'の番です';
    }
    let score = '黒：' + blackCount + '　白：' + whiteCount;
    return (
      <div className="Game">
        <div className="Game-Info">
          <div className="Info-Status">{status}</div>
          <div className="Info-Score">{score}</div>
        </div>
        <div className="Game-Board">
          <Board
            squares={current.squares}
            onClick={(i, j) => this.handleClick(i, j)}
          />
        </div>
        <div className="Game-Button">
          <button onClick={this.reset}>リセット</button>
        </div>
      </div>
    );
  }
}

export default function App() {
  return (
    <div className="App">
      <div className="App-Header">Othello</div>
      <Game />
    </div>
  );
}
