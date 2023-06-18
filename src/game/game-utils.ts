import type {TCell} from "./game-globals";
import {Figures} from "../figures/figures";

const standardFigs = 'SZILTOJ'.split('').filter(s => s !== ' ');
const complexFigs = 'SSS ZZZ II LLL TTT OO JJJ'.split('').filter(s => s !== ' ');

export function getRandomFigure(complex = false) {
	return complex
		? complexFigs[Math.floor(Math.random() * complexFigs.length)]
		: standardFigs[Math.floor(Math.random() * standardFigs.length)];
}

function traverseBottomTop(field, callback: (row, col) => void) {
	for (let row = 0; row < field.length; row++) {
		for (let col = 0; col < field[row].length; col++) {
			callback(row, col);
		}
	}
}

function traverseBottomTopRight(field, callback: (row, col) => void) {
	for (let row = 0; row < field.length; row++) {
		for (let col = field[row].length - 1; col >= 0; col--) {
			callback(row, col);
		}
	}
}

function makeAllSolids(field) {
	traverseBottomTop(field, (row, col) => {
		const block = field[row][col];

		if (!block || !block.falling) {
			// empty cell or solid block
			return;
		}
		field[row][col].solid = true;
		field[row][col].falling = false;
	});
}

export function fallDown(field) {
	let finished = false;
	let stopRow = -1;

	traverseBottomTop(field, (row, col) => {
		const block = field[row][col];

		if (!block || !block.falling || block.solid) {
			// empty cell or solid block
			return;
		}

		if (row === 0 && block.falling) {
			finished = true;
			stopRow = row;
			makeAllSolids(field);
			return;
		}

		const blockBelow = row > 0 ? field[row - 1][col] : undefined;
		if (block.falling && (blockBelow && !blockBelow.falling)) {
			finished = true;
			stopRow = row;
			makeAllSolids(field);
		}
	});

	if (!finished) {
		traverseBottomTop(field, (row, col) => {
			const block = field[row][col];

			if (!block || !block.falling || block.solid) {
				// empty cell or solid block
				return;
			}
			// move it down!
			field[row - 1][col] = {...block};
			field[row][col] = undefined;
		});
	}

	for (let rowIdx = 0; rowIdx < 20; rowIdx++) {
		const line = field[rowIdx];
		const filled = line.filter(cell => cell?.solid).length === line.length;

		if (filled) {
			line.forEach(cell => cell.markToRemove = true);
			for (let y = rowIdx; y < 20; y++) {
				for (let x = 0; x < field[y].length; x++) {
					if (field[y][x]?.solid) {
						field[y][x].fallAsRemove = true;
					}
				}
			}
		}
	}
	return {
		finished,
		stopRow
	};
}

export function removeFilledLines(field) {
	let count = 0;
	for (let rowIdx = 0; rowIdx < 20; rowIdx++) {
		const line = field[rowIdx];
		const filled = line.filter(cell => cell?.solid).length === line.length;

		if (filled) {
			field[rowIdx] = new Array(line.length).fill(undefined);
			count++;

			// move all the rows above down 1 cell
			for (let i = rowIdx + 1; i < 20; i++) {
				for (let j = 0; j < line.length; j++) {
					if (field[i][j]?.solid) {
						field[i - 1][j] = {...field[i][j]};
						field[i][j] = undefined;
					}
				}
			}
			rowIdx--; // step backward
		}
	}

	traverseBottomTop(field, (y, x) => {
		if (field[y][x]) {
			field[y][x].fallAsRemove = undefined;
		}
	});

	return count;
}


export function printGame(GameField) {
	for (let i = GameField.length - 1; i >= 0; i--) {
		let s = (i).toString().padStart(2, ' ') + ' ';

		for (let j = 0; j < GameField[i].length; j++) {
			if (!GameField[i][j]) {
				s += '.';
			}
			if (GameField[i][j]?.falling) {
				s += 'F';
			}
			if (GameField[i][j]?.solid) {
				s += 'S';
			}
			if (GameField[i][j]?.markedToDelete) {
				s += 'x';
			}
		}
		console.log(s);
	}
}

export function addFigureToField(GameField: Array<TCell[]>, type: string) {
	const symbol = Figures[type];
	if (!symbol) {
		throw new Error(`Unknown figure "${type}"!`);
	}

	const maxHeight = symbol.length;
	let maxWidth = symbol.reduce((prev, current) => {
		return Math.max(prev, current.length);
	}, 0);

	const x = Math.floor(5 - maxWidth / 2);
	const y = 20 + maxHeight;

	for (let line = 0; line < maxHeight; line++) {
		let matrix = symbol[line].split('');
		for (let cell = 0; cell < matrix.length; cell++) {
			if (matrix[cell] !== ' ') {
				GameField[y - line][x + cell] = {falling: true}
			}
		}
	}
}

export function cleanupGameField(GameField) {
	traverseBottomTop(GameField, (row, col) => {
		GameField[row][col] = undefined;
	});
}


export function moveFigureLeft(GameField) {
	let canMove = true;

	traverseBottomTop(GameField, (row, col) => {
		const block = GameField[row][col];

		if (!block || !block.falling) {
			return;
		}

		if (col === 0 || GameField[row][col - 1]?.solid) {
			canMove = false;
		}
	});

	if (!canMove) {
		return;
	}

	traverseBottomTop(GameField, (row, col) => {
		const block = GameField[row][col];

		if (!block || !block.falling) {
			return;
		}

		if (block.falling) {
			GameField[row][col - 1] = {...GameField[row][col]};
			GameField[row][col] = undefined;
		}
	});
}

export function moveFigureRight(GameField) {
	let canMove = true;

	const width = GameField[0].length;

	traverseBottomTop(GameField, (row, col) => {
		const block = GameField[row][col];

		if (!block || !block.falling) {
			return;
		}

		if (col === width - 1 || GameField[row][col + 1]?.solid) {
			canMove = false;
		}
	});

	if (!canMove) {
		return;
	}

	traverseBottomTopRight(GameField, (row, col) => {
		const block = GameField[row][col];

		if (!block || !block.falling) {
			return;
		}

		if (block.falling) {
			GameField[row][col + 1] = {...GameField[row][col]};
			GameField[row][col] = undefined;
		}
	});
}

export function rotateFigure(field) {
	// 1. scan for figure
	let figure = [];
	let minIdx = field[0].length;
	let maxIdx = 0;
	let firstRow = -1;

	for (let row = field.length - 1; row >= 0; row--) {
		let line = '';
		for (let col = 0; col < field[row].length; col++) {
			if (field[row][col]?.falling) {
				line += '#';
				if (col < minIdx) {
					minIdx = col;
				}
				if (col > maxIdx) {
					maxIdx = col;
				}
				if (firstRow < row) {
					firstRow = row;
				}
			} else {
				line += ' ';
			}
		}
		if (line.trim()) {
			figure.push(line);
		}
	}
	const rawWidth = maxIdx - minIdx + 1;
	const rawHeight = figure.length;
	if (rawWidth === rawHeight) {
		// square, nothing to do
		return false;
	}

	// 2. Transpond figure
	figure = figure.map(line => line.substring(minIdx, minIdx + rawWidth));
	if (firstRow > 22) {
		return false;
	}

	const newFigure = [];
	for (let i = 0; i < rawWidth; i++) {
		newFigure[i] = new Array(rawHeight);
	}

	for (let row = 0; row < newFigure.length; row++) {
		for (let col = 0; col < newFigure[row].length; col++) {
			if (figure[col][row] !== ' ') {
				newFigure[newFigure.length - row - 1][col] = '#';
			}
		}
	}

	// 3. Cleanup copy of field...
	const tempField = copyField(field);

	traverseBottomTop(tempField, (row, col) => {
		if (tempField[row][col]?.falling) {
			tempField[row][col] = undefined;
		}
	});

	// 4. ...and put new figure there, if possible
	let allow = true;
	let nRow = 0;

	for (let row = firstRow; row > firstRow - newFigure.length; row--) {
		for (let col = minIdx; col < minIdx + rawHeight; col++) {
			const nCol = col - minIdx;

			if (nRow >= 0 && nRow < newFigure.length && nCol >= 0 && nCol < rawHeight) {
				if (row < 0 || col < 0 || col >= tempField[0].length) {
					allow = false;
				}
				if (newFigure[nRow][nCol]) {
					if (tempField[row][col]?.solid) {
						allow = false;
					}
					if (allow) {
						tempField[row][col] = {falling: true};
					}
				}
			}
		}
		nRow++;
	}

	// 5. If allowed, copy transponded figure to the real field
	if (!allow) {
		return false;
	}
	traverseBottomTop(field, (row, col) => {
		if (tempField[row][col]) {
			field[row][col] = {...tempField[row][col]};
		} else {
			field[row][col] = undefined;
		}
	});
	return true;
}

export function createGameField() {
	const field = new Array<Array<TCell>>(25);
	for (let i = 0; i < field.length; i++) {
		field[i] = new Array(10).fill(undefined);
	}
	return field;
}

function copyField(GameField) {
	const tempField = createGameField()

	traverseBottomTop(GameField, (row, col) => {
		if (GameField[row][col]) {
			tempField[row][col] = {...GameField[row][col]};
		}
	});
	return tempField;
}
