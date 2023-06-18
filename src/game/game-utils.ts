import type {TCell} from "./game-globals";
import {Figures} from "../figures/figures";

const standardFigs = 'SZILTOJ'.split('').filter(s => s !== ' ');
const complexFigs = 'SSS ZZZ II LLL TTT OO JJJ'.split('').filter(s => s !== ' ');

export function getRandomFigure(complex = false) {
	return complex
		? complexFigs[Math.floor(Math.random() * complexFigs.length)]
		: standardFigs[Math.floor(Math.random() * standardFigs.length)];
}

function traverseBottomTop(GameField, callback: (row, col) => void) {
	for (let i = 0; i < GameField.length; i++) {
		for (let j = 0; j < GameField[i].length; j++) {
			callback(i, j);
		}
	}
}

function makeAllSolids(GameField) {
	traverseBottomTop(GameField, (row, col) => {
		const block = GameField[row][col];

		if (!block || !block.falling) {
			// empty cell or solid block
			return;
		}
		GameField[row][col].solid = true;
		GameField[row][col].falling = false;
	});
}

export function fallDown(GameField) {
	let finished = false;
	let stopRow = -1;

	traverseBottomTop(GameField, (row, col) => {
		const block = GameField[row][col];

		if (!block || !block.falling || block.solid) {
			// empty cell or solid block
			return;
		}

		if (row === 0 && block.falling) {
			finished = true;
			stopRow = row;
			makeAllSolids(GameField);
			return;
		}

		const blockBelow = row > 0 ? GameField[row - 1][col] : undefined;
		if (block.falling && (blockBelow && !blockBelow.falling)) {
			finished = true;
			stopRow = row;
			makeAllSolids(GameField);
		}
	});

	if (!finished) {
		traverseBottomTop(GameField, (row, col) => {
			const block = GameField[row][col];

			if (!block || !block.falling || block.solid) {
				// empty cell or solid block
				return;
			}
			// move it down!
			GameField[row - 1][col] = {...block};
			GameField[row][col] = undefined;
		});
	}

	for (let rowIdx = 0; rowIdx < 20; rowIdx++) {
		const line = GameField[rowIdx];
		const filled = line.filter(cell => cell?.solid).length === line.length;

		if (filled) {
			line.forEach(cell => cell.markToRemove = true);
			for (let y = rowIdx; y < 20; y++) {
				for (let x = 0; x < GameField[y].length; x++) {
					if (GameField[y][x]?.solid) {
						GameField[y][x].fallAsRemove = true;
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

export function removeFilledLines(GameField) {
	let count = 0;
	for (let rowIdx = 0; rowIdx < 20; rowIdx++) {
		const line = GameField[rowIdx];
		const filled = line.filter(cell => cell?.solid).length === line.length;

		if (filled) {
			GameField[rowIdx] = new Array(line.length).fill(undefined);
			count++;

			// move all the rows above down 1 cell
			for (let i = rowIdx + 1; i < 20; i++) {
				for (let j = 0; j < line.length; j++) {
					if (GameField[i][j]?.solid) {
						GameField[i - 1][j] = {...GameField[i][j]};
						GameField[i][j] = undefined;
					}
				}
			}
			rowIdx--; // step backward
		}
	}

	traverseBottomTop(GameField, (y, x) => {
		if (GameField[y][x]) {
			GameField[y][x].fallAsRemove = undefined;
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

export function cleanField(GameField) {
	traverseBottomTop(GameField, (row, col) => {
		GameField[row][col] = undefined;
	});
}
