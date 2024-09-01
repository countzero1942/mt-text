import { log, logh } from "@/utils/log";
import memoizee from "memoizee";

export const getTabIndentString2 = (
	numOfTabs: number
): string => {
	log(`--> Get tab string of size: ${numOfTabs}`);
	return "\t".repeat(numOfTabs);
};

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
	const tabbedStr = text.replace(rx, (match) =>
		getTabIndentString(match.length / tabSize)
	);
	return tabbedStr;
};
