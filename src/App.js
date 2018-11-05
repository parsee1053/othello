import React, { Component } from 'react';
import './App.css';

const EMPTY = 0;
const BLACK = 1;
const WHITE = -1;
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

class Board extends Component {
  renderSquare(i, j) {
    return (
      <Square
        value={this.props.squares[i][j]}
        onClick={() => this.props.onClick(i, j)} />
    );
  }

  render() {
    return (
      <div className="Board">
        <div className="Board-Row">
          {this.renderSquare(0, 0)}
          {this.renderSquare(1, 0)}
          {this.renderSquare(2, 0)}
          {this.renderSquare(3, 0)}
          {this.renderSquare(4, 0)}
          {this.renderSquare(5, 0)}
          {this.renderSquare(6, 0)}
          {this.renderSquare(7, 0)}
        </div>
        <div className="Board-Row">
          {this.renderSquare(0, 1)}
          {this.renderSquare(1, 1)}
          {this.renderSquare(2, 1)}
          {this.renderSquare(3, 1)}
          {this.renderSquare(4, 1)}
          {this.renderSquare(5, 1)}
          {this.renderSquare(6, 1)}
          {this.renderSquare(7, 1)}
        </div>
        <div className="Board-Row">
          {this.renderSquare(0, 2)}
          {this.renderSquare(1, 2)}
          {this.renderSquare(2, 2)}
          {this.renderSquare(3, 2)}
          {this.renderSquare(4, 2)}
          {this.renderSquare(5, 2)}
          {this.renderSquare(6, 2)}
          {this.renderSquare(7, 2)}
        </div>
        <div className="Board-Row">
          {this.renderSquare(0, 3)}
          {this.renderSquare(1, 3)}
          {this.renderSquare(2, 3)}
          {this.renderSquare(3, 3)}
          {this.renderSquare(4, 3)}
          {this.renderSquare(5, 3)}
          {this.renderSquare(6, 3)}
          {this.renderSquare(7, 3)}
        </div>
        <div className="Board-Row">
          {this.renderSquare(0, 4)}
          {this.renderSquare(1, 4)}
          {this.renderSquare(2, 4)}
          {this.renderSquare(3, 4)}
          {this.renderSquare(4, 4)}
          {this.renderSquare(5, 4)}
          {this.renderSquare(6, 4)}
          {this.renderSquare(7, 4)}
        </div>
        <div className="Board-Row">
          {this.renderSquare(0, 5)}
          {this.renderSquare(1, 5)}
          {this.renderSquare(2, 5)}
          {this.renderSquare(3, 5)}
          {this.renderSquare(4, 5)}
          {this.renderSquare(5, 5)}
          {this.renderSquare(6, 5)}
          {this.renderSquare(7, 5)}
        </div>
        <div className="Board-Row">
          {this.renderSquare(0, 6)}
          {this.renderSquare(1, 6)}
          {this.renderSquare(2, 6)}
          {this.renderSquare(3, 6)}
          {this.renderSquare(4, 6)}
          {this.renderSquare(5, 6)}
          {this.renderSquare(6, 6)}
          {this.renderSquare(7, 6)}
        </div>
        <div className="Board-Row">
          {this.renderSquare(0, 7)}
          {this.renderSquare(1, 7)}
          {this.renderSquare(2, 7)}
          {this.renderSquare(3, 7)}
          {this.renderSquare(4, 7)}
          {this.renderSquare(5, 7)}
          {this.renderSquare(6, 7)}
          {this.renderSquare(7, 7)}
        </div>
      </div>
    );
  }
}

class Game extends Component {
  constructor() {
    super();
    const initArray = JSON.parse(JSON.stringify((new Array(8)).fill((new Array(8)).fill(EMPTY))));
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
    let pass = true;
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    for (let a = 0; a < 8; a++) {
      for (let b = 0; b < 8; b++) {
        if (squares[a][b] === EMPTY && this.check(a, b, squares) === true) {
          pass = false;
        }
      }
    }
    if (pass === true) {
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
    if (this.put(i, j, squares) === false) {
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
      if (i < 0 || i > 7 || j < 0 || j > 7) {
        return false;
      }
      if (squares[i][j] === EMPTY) {
        return false;
      }
      if (squares[i][j] === (this.state.turn === BLACK ? WHITE : BLACK)) {
        flag = true;
        continue;
      }
      if (flag === true) {
        break;
      }
      return false;
    }
    return true;
  }

  check(i, j, squares) {
    for (let d = 0; d < 8; d++) {
      if (this.checkReverse(i, j, d, squares) === true) {
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
      if (this.checkReverse(i, j, d, squares) === true) {
        this.reverse(i, j, d, squares);
        flag = true;
      }
    }
    if (flag === true) {
      squares[i][j] = this.state.turn === BLACK ? BLACK : WHITE;
      return true;
    }
    return false;
  }

  reset() {
    if (window.confirm('リセットします．よろしいですか？')) {
      const initArray = JSON.parse(JSON.stringify((new Array(8)).fill((new Array(8)).fill(EMPTY))));
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
    for (let a = 0; a < 8; a++) {
      for (let b = 0; b < 8; b++) {
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
    const end = this.state.passCount >= 2 ? true : false;
    let status;
    if (end === true) {
      if (this.count(BLACK, current.squares) > this.count(WHITE, current.squares)) {
        status = '黒の勝ちです';
      } else if (this.count(BLACK, current.squares) < this.count(WHITE, current.squares)) {
        status = '白の勝ちです';
      } else {
        status = '引き分けです';
      }
    } else {
      status = (this.state.turn === BLACK ? '黒' : '白') + 'の番です';
    }
    let score = '黒：' + this.count(BLACK, current.squares) + '　白：' + this.count(WHITE, current.squares);
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

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-Header">Othello</div>
        <Game />
      </div>
    );
  }
}

export default App;
