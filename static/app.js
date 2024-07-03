const boardElement = document.getElementById('board');
const statusElement = document.getElementById('status');
const enableClicksElement = document.getElementById('enableClicks');
let currentPlayer = 1;
let winner = null;
let allowMouseClicks = enableClicksElement.checked;

enableClicksElement.addEventListener('change', () => {
    allowMouseClicks = enableClicksElement.checked;
    if (allowMouseClicks && !winner) {
        boardElement.addEventListener('click', handleBoardClick);
    } else {
        boardElement.removeEventListener('click', handleBoardClick);
    }
});

async function fetchBoard() {
    const response = await fetch('http://localhost:13200/board');
    const data = await response.json();
    currentPlayer = data.current_player;
    winner = data.winner;
    updateBoard(data.board);
    updateStatus();
}

function updateBoard(board) {
    boardElement.innerHTML = '';

    // Draw the grid lines
    for (let i = 0; i < 19; i++) {
        for (let j = 0; j < 19; j++) {
            if (i < 19) {
                const verticalLine = document.createElement('div');
                verticalLine.classList.add('line', 'vertical');
                verticalLine.style.left = `${(j + 0.5) * 20}px`;
                verticalLine.style.top = '0';
                verticalLine.style.height = '100%';
                boardElement.appendChild(verticalLine);
            }
            if (j < 19) {
                const horizontalLine = document.createElement('div');
                horizontalLine.classList.add('line', 'horizontal');
                horizontalLine.style.top = `${(i + 0.5) * 20}px`;
                horizontalLine.style.left = '0';
                horizontalLine.style.width = '100%';
                boardElement.appendChild(horizontalLine);
            }
        }
    }

    // Draw the pieces on the board
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (board[i][j] !== 0) {
                const cell = document.createElement('div');
                cell.classList.add('cell', `player${board[i][j]}`);
                cell.style.left = `${(j + 0.5) * 20}px`;
                cell.style.top = `${(i + 0.5) * 20}px`;
                boardElement.appendChild(cell);
            }
        }
    }

    if (allowMouseClicks && !winner) {
        boardElement.addEventListener('click', handleBoardClick);
    } else {
        boardElement.removeEventListener('click', handleBoardClick);
    }
}

function updateStatus() {
    if (winner) {
        statusElement.textContent = `Player ${winner} wins!`;
    } else {
        statusElement.textContent = `Current Player: ${currentPlayer}`;
    }
}

function handleBoardClick(event) {
    const rect = boardElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const i = Math.floor(y / 20);
    const j = Math.floor(x / 20);
    makeMove(i, j);
}

async function makeMove(x, y) {
    if (winner) return; // If there's a winner, ignore further moves
    const response = await fetch('http://localhost:13200/move', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ x, y })
    });
    const data = await response.json();
    fetchBoard(); // Update the board after the move
    if (data.winner) {
        winner = data.winner;
        updateStatus();
    }
}

async function resetGame() {
    await fetch('http://localhost:13200/reset', { method: 'POST' });
    fetchBoard(); // Reset the board
}

// Initial fetch to setup the board
fetchBoard();