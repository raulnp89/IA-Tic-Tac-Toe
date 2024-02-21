import React from "react";
import Board from "./BoardComponent";

function checkWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function areMovesLeft(squares) {
  return squares.includes(null);
}

function minimax(squares, depth, isMaximizingPlayer) {
  let score = checkWinner(squares);

  if (score === 10) return score;

  if (score === -10) return score;

  if (areMovesLeft(squares) === false) return 0;

  if (isMaximizingPlayer) {
    let best = -1000;

    for (let i = 0; i < 9; i++) {
      if (squares[i] === null) {
        squares[i] = "O";

        best = Math.max(best, minimax(squares, depth + 1, !isMaximizingPlayer));

        squares[i] = null;
      }
    }
    return best;
  } else {
    let best = 1000;

    for (let i = 0; i < 9; i++) {
      if (squares[i] === null) {
        squares[i] = "X";

        best = Math.min(best, minimax(squares, depth + 1, !isMaximizingPlayer));

        squares[i] = null;
      }
    }
    return best;
  }
}
function findBestMove(squares) {
  // Ajusta la probabilidad de movimiento aleatorio
  if (Math.random() < 0.1) {
    let availableMoves = squares
      .map((square, index) => (square === null ? index : null))
      .filter((index) => index !== null);
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  }

  let bestVal = -1000;
  let bestMove = -1;

  for (let i = 0; i < 9; i++) {
    if (squares[i] === null) {
      squares[i] = "O";

      // Ajusta el nivel de profundidad en el algoritmo Minimax
      let moveVal = minimax(squares, 0, false, 8); // Puedes probar con diferentes valores

      // Introduce algún factor de aleatoriedad en la evaluación de los movimientos
      moveVal += Math.random() * 0.001; // Puedes ajustar el factor de aleatoriedad

      squares[i] = null;

      if (moveVal > bestVal || (moveVal === bestVal && Math.random() < 0.5)) {
        bestMove = i;
        bestVal = moveVal;
      }
    }
  }

  return bestMove;
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
        },
      ],
      stepNumber: 0,
      xIsNext: true,
      isAIThinking: false,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (checkWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState(
      {
        history: history.concat([
          {
            squares: squares,
          },
        ]),
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext,
      },
      () => {
        if (!this.state.xIsNext) {
          this.setState({ isAIThinking: true }, () => {
            setTimeout(() => {
              const bestMove = findBestMove(
                this.state.history[this.state.stepNumber].squares
              );
              this.handleClick(bestMove);
              this.setState({ isAIThinking: false });
            }, 1000);
          });
        }
      }
    );
  }

  resetGame() {
    this.setState({
      history: [
        {
          squares: Array(9).fill(null),
        },
      ],
      stepNumber: 0,
      xIsNext: true,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = checkWinner(current.squares);

    let status;
    if (winner) {
      status = "Winner: " + (winner === "X" ? "Human" : "IA");
    } else if (current.squares.every((square) => square)) {
      status = "It's a draw!";
    } else {
      status =
        "Next player: " +
        (this.state.xIsNext
          ? "Human"
          : this.state.isAIThinking
          ? "IA (thinking...)"
          : "IA");
    }

    return (
      <div className='game'>
        <div className='game-board'>
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className='game-info'>
          <div>{status}</div>
          <button onClick={() => this.resetGame()}>New Game</button>
        </div>
      </div>
    );
  }
}

export default Game;
