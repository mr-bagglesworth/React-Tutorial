// import stuff
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// __________________________

// view this at: http://localhost:3000/
// npm start in terminal in project folder to run

// a little bit of a git history here, should have done it form the start
// - does show the past hisotry of moves before and after, could be worth checking out


// Taken from https://reactjs.org/tutorial/tutorial.html
// NOTES

// COMPONENTS
// - square put into board, which is put into game

// DEV TOOLS
// - last item on the right is react dev tools (once chrome extension is installed)

// STATE
// - better to maintain state higher up the DOM tree (i.e. in parent components)
// - code is easier to debug and manage this way
// - in the context of this game, it makes it possible to determine the winner


// FUNCTION COMPONENTS
// - a simpler way to write components that only have render methods
// - i.e. components that don't have (or inherit) their own state
// - don't have to worry about this keyword (see 2nd implementation of square)


// MUTATION
// - makes the time travel thing possible
// - basically copy all arrays, objects, etc, rather than referencing them (i.e. use immutable stuff)
// https://reactjs.org/tutorial/tutorial.html#adding-time-travel
// - slice() is used to create a new copy of the squares array after every move



// TIME TRAVEL / HISTORY
// - first implementation does not allow for time travel
// - also achieved by moving state controlled or whatever up to the next highest component, which is game
// Delete the constructor in Board.
// Replace this.state.squares[i] with this.props.squares[i] in Board’s renderSquare.
// Replace this.handleClick(i) with this.props.onClick(i) in Board’s renderSquare
// --- history bits in game components render method


// This shows how history (an array of objects represneting each move) will look:
// https://reactjs.org/tutorial/tutorial.html#adding-time-travel
// - question is which component should own the history state? - top level Game component will



// TIME TRAVEL /SHOWING PAST MOVES
// https://reactjs.org/tutorial/tutorial.html#showing-the-past-moves
// - use map()
// - keep track of components in between state changes with keys
// - recommended to assign proper keys when building dynamic lists
//  - if proper keys not assigned, uses array index by default
//  - keys only need to be unique between components and siblings
// - stepNumber: 0, in Game constructor




// __________________________
// square - first implementation
// class Square extends React.Component {


// square - second implementation
function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
        {props.value}
        </button>
    );
}




// board
class Board extends React.Component {

    // - Board recieves squares and onClick props from Game
    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    };

    // render rows
    render() {
        return (
        <div>
            <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
            </div>
            <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
            </div>
            <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
            </div>
        </div>
        );
    }
}







// Game Component
// - this contains the history state - track history of moves
// - Board recieves squares and onClick props from Game
class Game extends React.Component {

    
    // store history of moves
    // - set up initial state with this:
    constructor(props) {
        super(props);
        this.state = {
          history: [{
            squares: Array(9).fill(null),
          }],
          stepNumber: 0, // first step in history = 0
          xIsNext: true,
        };
    }


    // handleClick previously in Board component. handle clicks from squares:
    handleClick(i) {
        // before time travel, was 'this.state.history'
        // - now keeps track with stepNumber
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();

        // return early if someone has won the game
        if (calculateWinner(squares) || squares[i]) {
            return;
        }

        // set item to X or O, according to state
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        // set state on board
        // - save history to state with concat - copies original array, makes it immutable
        this.setState({
            history: history.concat([{
                squares: squares,
            }]),
            stepNumber : history.length, // keep track of stepNumber after each click
            xIsNext : !this.state.xIsNext,
        }); 
    }



    // jumpTo method - for history / time travel
    jumpTo(step) {
        this.setState({
            stepNumber: step, // reflects the move currently displayed to the user
            xIsNext: (step % 2) === 0, // if step number is even, xIsNext = true
        })
    }



    
    // render Game component
    render() {
        // history
        // - used to calculate winner
        const history = this.state.history;
        // before time travel, was history[history.length - 1]
        // - now renders currently selected move according to stepNumber
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        // map over moves
        const moves = history.map((step, move) => {
            // if there is a move, go to the move, else start over
            const desc = move ? 'Go to move #' + move : 'Go to game start';
            // for each move create an li, with the above text to go to each move
            // - run jumpTo on each
            // - use move index as key
            return (
                <li key={move}>
                    <button onClick={ () => this.jumpTo(move)}>{desc}</button>
                </li>
            );

        });
        
        // board shows state of the game from history
        // status shows the winner
        return (
        <div className="game">
            <div className="game-board">
                <Board
                    squares={current.squares}
                    onClick={(i) => this.handleClick(i)}
                />
            </div>
            <div className="game-info">
                <div>{status}</div>
                {/* add time travel - view history of moves in a game */}
                <ol>{moves}</ol>
            </div>
        </div>
        );
    }
}






// calculate winner function
// - this is displayed in the board's render function
function calculateWinner(squares) {
    // each array represents a winning set of squares by index
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


// ========================================



ReactDOM.render(
    <Game />,
    document.getElementById('root')
);


// regular js needs to be added AFTER render function in order to work
// - probably want to do this a reacty way though
// - this is done above with:
// <button className="square" onClick={() => alert('click')}>



// const highLight = (e) => e.target.classList.toggle('highlight');
// const sqs = document.querySelectorAll('.square');
// sqs.forEach(sq => sq.addEventListener('click', highLight));
// console.log(sqs);