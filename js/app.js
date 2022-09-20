document.querySelector('#dark-mode-toggle').addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const isDarkMode = document.body.classList.contains('dark');
    localStorage.setItem('darkmode', isDarkMode);

    // document.querySelector('')
})

const start_screen = document.querySelector('#start-screen');
const game_screen = document.querySelector('.main-game');
const pause_screen = document.querySelector('#pause-screen');

let cells = "";

const name_input = document.querySelector('#input-name');
const player_name = document.querySelector('#player-name');
const game_level = document.querySelector('#game-level');
const game_time = document.querySelector('#game-time');

let level_index = 0;
let level = CONSTANT.LEVEL[level_index];

let timer = null;
let pause = false;
let seconds = 0;

let su = undefined;
let su_answer = undefined;

document.querySelector('#btn-level').addEventListener('click', (e) => {
    level_index = level_index + 1 > CONSTANT.LEVEL.length - 1 ? 0 : level_index + 1;
    level = CONSTANT.LEVEL[level_index];
    e.target.innerHTML = CONSTANT.LEVEL_NAME[level_index];
})

document.querySelector('#btn-play').addEventListener('click', () => {
    if (name_input.value.trim().length > 0) {
        initSudoku();
        initCellsEvent();
        initNumberInputEvent();
        document.querySelector('#btn-delete').addEventListener('click', () => {
            cells[selected_cell].innerHTML = '';
            cells[selected_cell].setAttribute('data-value', 0);
        
            let row = Math.floor(selected_cell / CONSTANT.GRID_SIZE);
            let col = selected_cell % CONSTANT.GRID_SIZE;
        
            su_answer[row][col] = 0;
        
            removeErr();
        })
        startGame();
    } else {
        name_input.classList.add('input-err');
        setTimeout(() => {
            name_input.classList.remove('input-err');
            name_input.focus();
        }, 500)
    }
})

document.querySelector('#btn-continue').addEventListener('click', () => {
    if (name_input.value.trim().length > 0) {
        loadSudoku();
        initCellsEvent();
        initNumberInputEvent();
        document.querySelector('#btn-delete').addEventListener('click', () => {
            cells[selected_cell].innerHTML = '';
            cells[selected_cell].setAttribute('data-value', 0);
        
            let row = Math.floor(selected_cell / CONSTANT.GRID_SIZE);
            let col = selected_cell % CONSTANT.GRID_SIZE;
        
            su_answer[row][col] = 0;
        
            removeErr();
        })
        startGame();
    } else {
        name_input.classList.add('input-err');
        setTimeout(() => {
            name_input.classList.remove('input-err');
            name_input.focus();
        }, 500)
    }
})

const getGameInfo = () => JSON.parse(localStorage.getItem('game'));

const setPlayerName = (name) => localStorage.setItem('player_name', name);
const getPlayerName = () => localStorage.getItem('player_name');

const showTime = (seconds) => new Date(seconds * 1000).toISOString().substr(11, 8);

const clearSudoku = () => {
    for (let i = 0; i < Math.pow(CONSTANT.GRID_SIZE, 2); i++) {
        cells[i].innerHTML = '';
        cells[i].classList.remove('filled');
        cells[i].classList.remove('selected');
    }
}

const initSudoku = () => {
    // clear old sudoku
    cells = document.querySelectorAll('.main-grid-cell');
    clearSudoku();
    resetBg();

    su = sudokuGen(level);
    su_answer = [...su.question];

    // show sudoku to div
    for (let i = 0; i < Math.pow(CONSTANT.GRID_SIZE, 2); i++) {
        let row = Math.floor(i / CONSTANT.GRID_SIZE);
        let col = i % CONSTANT.GRID_SIZE;

        cells[i].setAttribute('data-value', su.question[row][col]);
        if(su.question[row][col] !== 0) {
            cells[i].classList.add('filled');
            cells[i].innerHTML = su.question[row][col];
        }
    }
}

const loadSudoku = () => {
    let game = getGameInfo();

    game_level.innerHTML = CONSTANT.LEVEL_NAME[game.level];
    su = game.su;
    su_answer = su.answer;
    seconds = game.seconds;
    game_time.innerHTML = showTime(seconds);
    level_index = game.level;

        // show sudoku to div
        for (let i = 0; i < Math.pow(CONSTANT.GRID_SIZE, 2); i++) {
            let row = Math.floor(i / CONSTANT.GRID_SIZE);
            let col = i % CONSTANT.GRID_SIZE;
    
            cells[i].setAttribute('data-value', su_answer[row][col]);
            cells[i].innerHTML = su_answer[row][col] !== 0 ? su_answer[row][col] : '';
            if(su.question[row][col] !== 0) {
                cells[i].classList.add('filled');
                cells[i].innerHTML = su.question[row][col];
            }
        }
}

const hoverBg = (index) => {
    let row = Math.floor(index / CONSTANT.GRID_SIZE);
    let col = index % CONSTANT.GRID_SIZE;

    let box_start_row = row - row % 3;
    let box_start_col = col - col % 3;

    for (let i = 0; i < CONSTANT.BOX_SIZE; i++) {
        for (let j = 0; j < CONSTANT.BOX_SIZE; j++) {
            let cell = cells[9 * (box_start_row + i) + (box_start_col + j)];
            cell.classList.add('hover');
         }
    }

    let step = 9;
    while (index - step >= 0) {
        cells[index - step].classList.add('hover');
        step += 9;
    }

    step = 9;
    while (index + step < 81) {
        cells[index + step].classList.add('hover');
        step += 9;
    }

    step = 1;
    while (index - step >= 9 * row) {
        cells[index - step].classList.add('hover');
        step += 1;
    }

    step = 1;
    while (index + step < 9 * row + 9) {
        cells[index + step].classList.add('hover');
        step += 1;
    }
}

const resetBg = () => {
    cells.forEach(e => e.classList.remove('hover'));
}

const checkErr = (value) => {
    const addErr = (cell) => {
        if (parseInt(cell.getAttribute('data-value')) === value) {
            cell.classList.add('err');
            cell.classList.add('cell-err');
            setTimeout(() => {
                cell.classList.remove('cell-err');
            }, 500);
        }
    }

    let index = selected_cell;

    let row = Math.floor(index / CONSTANT.GRID_SIZE);
    let col = index % CONSTANT.GRID_SIZE;

    let box_start_row = row - row % 3;
    let box_start_col = col - col % 3;

    for (let i = 0; i < CONSTANT.BOX_SIZE; i++) {
        for (let j = 0; j < CONSTANT.BOX_SIZE; j++) {
            let cell = cells[9 * (box_start_row + i) + (box_start_col + j)];
            if (!cell.classList.contains('selected')) addErr(cell);
         }
    }

    let step = 9;
    while (index - step >= 0) {
        addErr(cells[index - step]);
        step += 9;
    }

    step = 9;
    while (index + step < 81) {
        addErr(cells[index + step]);
        step += 9;
    }

    step = 1;
    while (index - step >= 9 * row) {
        addErr(cells[index - step]);
        step += 1;
    }

    step = 1;
    while (index + step < 9 * row + 9) {
        addErr(cells[index + step]);
        step += 1;
    }
}


const removeErr = () => cells.forEach(e => e.classList.remove('err'));

const saveGameInfo = () => {
    let game = {
        level: level_index,
        seconds: seconds,
        su: {
            original: su.original,
            question: su.question,
            answer: su_answer
        }
    }
    localStorage.setItem('game', JSON.stringify(game));
}

const removeGameInfo = () => {
    localStorage.removeItem('game');
    document.querySelector('#btn-continue').style.display = 'none';
}

const isGameWin = () => sudokuCheck(su_answer);

const showResult = () => {
    clearInterval(timer);
    alert('win');
    // show result screen
}

const initNumberInputEvent = () => {
    const number_inputs = document.querySelectorAll('.number');
    number_inputs.forEach((e, index) => {
        e.addEventListener('click', () => {
            if(!cells[selected_cell].classList.contains('filled')) {
                cells[selected_cell].innerHTML = index + 1;
                cells[selected_cell].setAttribute('data-value', index + 1);
                // add to answer
                let row = Math.floor(selected_cell / CONSTANT.GRID_SIZE);
                let col = selected_cell % CONSTANT.GRID_SIZE;
                su_answer[row][col] = index + 1;
                // save game
                saveGameInfo()
                removeErr();
                checkErr(index + 1);
                cells[selected_cell].classList.add('zoom-in');
                setTimeout(() => {
                    cells[selected_cell].classList.remove('zoom-in');
                }, 500);

                //check game win
                if (isGameWin()) {
                    removeGameInfo();
                    showResult();
                }
            }
        })
    })
}

const initCellsEvent = () => {
    cells.forEach((e, index) => {
        e.addEventListener('click', () => {
            if(!e.classList.contains('filled')) {
                cells.forEach(e => e.classList.remove('selected'));
                selected_cell = index;
                e.classList.remove('err');
                e.classList.add('selected');
                resetBg();
                hoverBg(index);
            }
        })
    })
}

const startGame = () => {
    start_screen.classList.remove('active');
    game_screen.classList.add('active');

    player_name.innerHTML = name_input.value.trim();
    setPlayerName(name_input.value.trim());

    game_level.innerHTML = CONSTANT.LEVEL_NAME[level_index];

    seconds = 0;
    showTime(seconds);

    timer = setInterval(() => {
        if(!pause) {
            seconds = seconds + 1;
            game_time.innerHTML = showTime(seconds);
        }
    }, 1000)
}

const returnStartScreen = () => {
    clearInterval(timer);
    pause = false;
    seconds = 0;
    start_screen.classList.add('active');
    game_screen.classList.remove('active');
    pause_screen.classList.remove('active');
    result_screen.classList.remove('active');
}

const initGrid = () => {
    //create grid
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            const cell = document.createElement('div');
            const grid = document.querySelector('.main-sudoku-grid');

            cell.classList.add('main-grid-cell');
            if(r == 2 || r == 5) {
                cell.style.marginBottom = '10px';
            }
            if(c == 2 || c == 5) {
                cell.style.marginRight = '10px';
            }
            // cell.addEventListener('click', (e) => {
            //     console.log(e.target);
            // })
            grid.appendChild(cell);
        }
    }
    
    //create numbers
    const numbers = document.querySelector('.numbers');
    for (let i = 1; i <= 9; i++) {
        const number = document.createElement('div');
        number.innerHTML = i;
        number.classList.add("number");
        numbers.appendChild(number);
    }
    const deleteNum = document.createElement('div');
    deleteNum.classList.add('delete');
    deleteNum.setAttribute('id', 'btn-delete');
    deleteNum.innerHTML = 'X';
    numbers.appendChild(deleteNum);
}

document.querySelector('#btn-pause').addEventListener('click', () => {
    pause_screen.classList.add('active');
    pause = true;
});

document.querySelector('#btn-resume').addEventListener('click', () => {
    pause_screen.classList.remove('active');
    pause = false;
});

document.querySelector('#btn-new-game').addEventListener('click', () => {
    returnStartScreen();
})

const init = () => {
    const darkmode = localStorage.getItem('darkmode');
    document.body.classList.add(darkmode ? 'dark' : '');

    const game = getGameInfo();

    document.querySelector('#btn-continue').style.display = game ? 'grid' : 'none';

    if (getPlayerName()) {
        name_input.value = getPlayerName();
    } else {
        name_input.focus();
    }
    initGrid();
}

init();