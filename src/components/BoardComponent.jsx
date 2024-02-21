import React from "react";

function Square(props) {
  return (
    <button className='square' onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div className='game-board'>
        {[...Array(3)].map((_, i) => (
          <div className='board-row' key={i}>
            {[...Array(3)].map((_, j) => this.renderSquare(i * 3 + j))}
          </div>
        ))}
      </div>
    );
  }
}

export default Board;
