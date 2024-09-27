import { log, logh } from "@/utils/log";
import memoizee from "memoizee";

export const getTabIndentString = memoizee(
	(numOfTabs: number): string => {
		log(`--> Get tab string of size: ${numOfTabs}`);
		return "\t".repeat(numOfTabs);
	},
	{ maxAge: 5000 }
);

export const spacesToTabs = (
	text: string,
	tabSize: number
): string => {
	const pattern = `^( {${tabSize}})+`;
	const rx = new RegExp(pattern, "gm");
	const tabbedStr = text.replace(rx, match =>
		getTabIndentString(match.length / tabSize)
	);
	return tabbedStr;
};

/**
 * Clamps number within range of min and max.
 *
 * @param num Number to clamp
 * @param min Minimum value
 * @param max Maximum value
 * @returns Clamped number
 */
export const clamp = (num: number, min: number, max: number) =>
	Math.min(Math.max(num, min), max);

/**
 * Searches source string for number of occurences of match string
 *
 * @param source Source string
 * @param match Match to find. (Empty match yields 0.)
 * @param pos Starting position (default: 0). Value is clamped.
 * @returns Number of occurences of match string in source string.
 * Will always be 0 or greater.
 */
export const countOccurencesOf = (
	source: string,
	match: string,
	pos: number = 0
): number => {
	if (match.length == 0) {
		return 0;
	}
	pos = clamp(pos, 0, source.length);
	let count = 0;
	while (true) {
		pos = source.indexOf(match, pos);
		if (pos >= 0) {
			count++;
			pos += match.length;
		} else {
			break;
		}
	}
	return count;
};

/**
 * Splits a string only once, instead of many times
 * with the built in 'split' funciton.
 *
 * @param source The string to split
 * @param split The splitter
 * @returns The readonly array of 2 split strings if splitter
 * found, or 1 string of the original 'source'
 */
export const splitStringOnce = (source: string, split: string) => {
	// abc: def
	// 01234567

	const i = source.indexOf(split);
	if (i >= 0) {
		const left = source.slice(0, i);
		const right = source.slice(i + split.length);
		const arr: ReadonlyArray<string> = [left, right];
		return arr;
	} else {
		const arr: ReadonlyArray<string> = [source];
		return arr;
	}
};
