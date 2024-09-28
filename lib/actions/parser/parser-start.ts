"use server";

import { log, logh, logln } from "@/utils/log";
import { countOccurencesOf, splitStringOnce } from "@/utils/string";
import {
	exhaustiveGuard,
	getType,
	isDefined,
	toFixedArray,
} from "@/utils/types";
import { open } from "node:fs/promises";
import {
	EmptyLine,
	LineInfo,
	ParseErr,
} from "@/parser/types/general";
import { getPreLineInfo } from "@/parser/utils/pre-line-info";
import { HeadType, splitHead } from "@/parser/utils/split-head";
import { resolve } from "node:path";
import { ErrorType, getError } from "@/utils/error";
import { getClassName } from "@/utils/types";

const getTextFile = (name: string) => `./text/parser/${name}`;

const setLineColumn = (
	lineInfo: LineInfo,
	lineColumn: number
): LineInfo => {
	return {
		lineInfo: {
			...lineInfo.lineInfo,
			column: lineColumn,
		},
	};
};

const formatLine = (line: string) => {
	return line
		.replaceAll("\t", "\\t")
		.replaceAll("\r", "\\r")
		.replaceAll("\n", "\\n");
};

export const parseLinesToHeads = (
	lines: readonly string[]
): ReadonlyArray<HeadType> => {
	const heads: HeadType[] = [];

	let lineNumber = 0;
	for (const line of lines) {
		lineNumber++; // in N

		const res1 = getPreLineInfo(line, lineNumber);

		if (res1.type === "ParseErr") {
			heads.push(res1);
			continue;
		}

		const lineInfo: LineInfo = {
			lineInfo: {
				content: res1.content,
				row: res1.row,
				indent: res1.indent,
			},
		};

		const res2 = splitHead(lineInfo);
		heads.push(res2);
	}

	return heads;
};

export type LinesType = {
	type: "LinesType";
	lines: ReadonlyArray<string>;
};

export const fileToLines = async (
	textFileName: string
): Promise<LinesType | ErrorType> => {
	try {
		const lines: string[] = [];

		const file = await open(getTextFile(textFileName));
		for await (const line of file.readLines()) {
			lines.push(line);
		}

		return {
			type: "LinesType",
			lines,
		};
	} catch (error) {
		return getError(error);
	}
};

class Thing {
	constructor(public stuff: string) {}
}

class CustomError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "CustomError";
	}
}

export const logTestError = () => {
	try {
		if (true) {
			throw "A string";
		}
	} catch (error) {
		log(getError(error));
	}
	logln(40);
	try {
		if (true) {
			throw Error("This is Error class.");
		}
	} catch (error) {
		log(getError(error));
	}
	logln(40);

	try {
		if (true) {
			throw RangeError("This is RangeError class.");
		}
	} catch (error) {
		log(getError(error));
	}
	logln(40);

	try {
		if (true) {
			throw new CustomError("This is CustomError class.");
		}
	} catch (error) {
		log(getError(error));
	}
	logln(40);

	const handleClassOrObjectError = (error: any) => {
		const err = getError(error);
		log(err);
		const type = getType(error);
		switch (type) {
			case "Class":
				log("class", getClassName(error as Object));
				break;
			case "Object":
				log("Object");
				break;
			default:
				break;
		}
		log(err.message);
	};

	try {
		if (true) {
			throw new Thing("This is Thing class");
		}
	} catch (error) {
		handleClassOrObjectError(error);
	}
	logln(40);

	try {
		if (true) {
			throw { key: "value" };
		}
	} catch (error) {
		handleClassOrObjectError(error);
	}
	logln(40);
};

export const logSplitHeads = async () => {
	logh("Log Parse Begin 01");
	logln(40);
	log("Legend:");
	log("   Head: type and values yet to be parsed.");
	log("   <KeyValueHead>: " + "Key and value declared.");
	log("   <KeyHead>: " + "Key declared and value required on init.");
	log(
		"   <KeyBodyHead>: " +
			"Key declared and indented body to follow."
	);
	logln(40);

	const file = await open(getTextFile("00-with-errs.txt"));

	const errors: ParseErr[] = [];
	const dict = new Map<string, any>();

	const logLineInfo = (li: LineInfo) => {
		const { content, row, indent } = li.lineInfo;
		log(
			`   LineInfo: row: #${row}, indent: ${indent}, ` +
				`content: "${formatLine(content)}"`
		);
	};

	const logError = (err: ParseErr) => {};

	let lineNumber = 0;
	for await (const line of file.readLines()) {
		lineNumber++; // in N

		log(`ORG LINE #${lineNumber}: ` + `"${formatLine(line)}"`);

		const res1 = getPreLineInfo(line, lineNumber);

		if (res1.type === "ParseErr") {
			const err = res1;
			const { message } = err;
			logLineInfo(err);
			log(`PARSE-ERR: (${errors.length}): "${message}"`);
			errors.push(res1);
			logln(40);
			continue;
		}

		const lineInfo: LineInfo = {
			lineInfo: {
				content: res1.content,
				row: res1.row,
				indent: res1.indent,
			},
		};

		logLineInfo(lineInfo);

		const res2 = splitHead(lineInfo);
		switch (res2.type) {
			case "KeyValueHead":
				{
					const { keyHead, valueHead } = res2;
					log(
						`<KeyValueHead>: ` +
							`keyHead: "${keyHead}", ` +
							`valueHead: "${valueHead}"`
					);
				}
				break;
			case "KeyHead":
				{
					const { keyHead } = res2;
					log(`<KeyHead>: keyHead: "${keyHead}"`);
				}
				break;
			case "KeyBodyHead":
				{
					const { keyHead } = res2;
					log(`<KeyBodyHead>: keyHead: "${keyHead}"`);
				}
				break;
			case "EmptyLine":
				{
					log("<EmptyLine>");
				}
				break;
			case "ParseErr":
				{
					const err = res2;
					const { message } = err;
					log(`PARSE-ERR: (${errors.length}): "${message}"`);
					errors.push(err);
				}
				break;
			default:
				exhaustiveGuard(res2);
		}

		logln(40);
	}
};

export const logParserLines = async () => {
	const file = await open(getTextFile("00-start.txt"));

	for await (const line of file.readLines()) {
		console.log(line);
	}
};
