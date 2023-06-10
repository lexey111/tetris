const standardFigs = 'SZILTOJ'.split('').filter(s => s !== ' ');
const complexFigs = 'SSS ZZZ II LLL TTT OO JJJ'.split('').filter(s => s !== ' ');

export function getRandomFigure(complex = false) {
	return complex
		? complexFigs[Math.floor(Math.random() * complexFigs.length)]
		: standardFigs[Math.floor(Math.random() * standardFigs.length)];
}
