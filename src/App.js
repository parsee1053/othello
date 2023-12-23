import React, { useEffect, useState } from 'react';
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
      {[...Array(BOARD_SIZE).keys()].map(row => (
        <div key={row} className="Board-Row">
          {[...Array(BOARD_SIZE).keys()].map(col => renderSquare(row, col))}
        </div>
      ))}
    </div>
  );
}

function Game() {
  const [history, setHistory] = useState([{ squares: initializeSquares() }]);
  const [stepNumber, setStepNumber] = useState(0);
  const [turn, setTurn] = useState(BLACK);
  const [passCount, setPassCount] = useState(0);

  function initializeSquares() {
    const squares = Array.from({ length: BOARD_SIZE }, () => Array.from({ length: BOARD_SIZE }, () => EMPTY));
    squares[BOARD_SIZE / 2 - 1][BOARD_SIZE / 2 - 1] = WHITE;
    squares[BOARD_SIZE / 2][BOARD_SIZE / 2 - 1] = BLACK;
    squares[BOARD_SIZE / 2 - 1][BOARD_SIZE / 2] = BLACK;
    squares[BOARD_SIZE / 2][BOARD_SIZE / 2] = WHITE;
    return squares;
  }

  useEffect(() => {
    const current = history[stepNumber];
    const squares = current.squares.slice();
    const isPass = !squares.some((row, a) =>
      row.some((cell, b) => cell === EMPTY && check(a, b, squares))
    );
    if (isPass) {
      let newPassCount = passCount;
      if (passCount === 0) {
        newPassCount++;
        setTurn(turn === BLACK ? WHITE : BLACK);
        setPassCount(newPassCount);
      } else if (passCount === 1) {
        newPassCount++;
        setPassCount(newPassCount);
      }
    }
  }, [history, stepNumber, passCount]);

  function handleClick(i, j) {
    const current = history[stepNumber];
    const squares = current.squares.slice();
    if (passCount >= 2) {
      return;
    }
    if (!put(i, j, squares)) {
      alert('その場所には置けません');
      return;
    }
    setHistory(history.concat([{ squares: squares }]));
    setStepNumber(history.length);
    setTurn(turn === BLACK ? WHITE : BLACK);
    setPassCount(0);
  }

  function checkReverse(i, j, d, squares) {
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
      if (squares[i][j] === (turn === BLACK ? WHITE : BLACK)) {
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

  function check(i, j, squares) {
    for (let d = 0; d < 8; d++) {
      if (checkReverse(i, j, d, squares)) {
        return true;
      }
    }
    return false;
  }

  function reverse(i, j, d, squares) {
    while (true) {
      i += dx[d];
      j += dy[d];
      if (squares[i][j] === (turn === BLACK ? BLACK : WHITE)) {
        break;
      }
      squares[i][j] = turn === BLACK ? BLACK : WHITE;
    }
  }

  function put(i, j, squares) {
    if (squares[i][j] !== EMPTY) {
      return false;
    }
    let reversed = false;
    for (let d = 0; d < 8; d++) {
      if (checkReverse(i, j, d, squares)) {
        reverse(i, j, d, squares);
        reversed = true;
      }
    }
    if (reversed) {
      squares[i][j] = turn === BLACK ? BLACK : WHITE;
    }
    return reversed;
  }

  function reset() {
    if (window.confirm('リセットします．よろしいですか？')) {
      setHistory([{ squares: initializeSquares() }]);
      setStepNumber(0);
      setTurn(BLACK);
      setPassCount(0);
    }
  }

  function count(color, squares) {
    return squares.flat().filter(square => square === color).length;
  }

  const current = history[stepNumber];
  const blackCount = count(BLACK, current.squares);
  const whiteCount = count(WHITE, current.squares);
  const isEnd = passCount >= 2;
  const status = isEnd
    ? blackCount > whiteCount
      ? '黒の勝ちです'
      : blackCount < whiteCount
        ? '白の勝ちです'
        : '引き分けです'
    : `${turn === BLACK ? '黒' : '白'}の番です`;
  const score = `黒：${blackCount}　白：${whiteCount}`;

  return (
    <div className="Game">
      <div className="Game-Info">
        <div className="Info-Status">{status}</div>
        <div className="Info-Score">{score}</div>
      </div>
      <div className="Game-Board">
        <Board
          squares={current.squares}
          onClick={(i, j) => handleClick(i, j)}
        />
      </div>
      <div className="Game-Button">
        <button onClick={reset}>リセット</button>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div className="App">
      <div className="App-Header">Othello</div>
      <Game />
    </div>
  );
}
