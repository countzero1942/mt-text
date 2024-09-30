"use server";

import { log, logh, logln } from "@/utils/log";
import { countOccurencesOf, splitStringOnce } from "@/utils/string";
import {
	exhaustiveGuard,
	getType,
	isDefined,
	toFixedArray,
} from "@/utils/types";
import { FileHandle, open } from "node:fs/promises";
import * as fs from "node:fs";

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
import { rejects } from "node:assert";
import { Head } from "next/document";
import { isGeneratorFunction } from "node:util/types";
import internal from "node:stream";
import { Interface } from "node:readline";
import { generateKey } from "node:crypto";
import { ArraySeq, NumSeq } from "@/utils/seq";

const getTextFilePath = (name: string) => `./text/parser/${name}`;

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

export type LinesType = {
	type: "LinesType";
	lines: readonly string[];
};

export const readFileLines = async (
	path: string
): Promise<readonly string[]> =>
	new Promise((resolve, reject) => {
		try {
			const text = fs.readFileSync(path, "utf8");
			const lines = text.split(/[\r\n]+/);
			resolve(lines);
		} catch (error) {
			reject(error);
		}
	});

export const fileToLines = async (
	textFileName: string
): Promise<LinesType | ErrorType> => {
	try {
		const lines = await readFileLines(
			getTextFilePath(textFileName)
		);
		return { type: "LinesType", lines };
	} catch (error) {
		return getError(error);
	}
};

export const parseLinesToHeads = async (
	lines: readonly string[]
): Promise<readonly HeadType[]> =>
	new Promise(resolve => {
		const heads: HeadType[] = new Array<HeadType>();

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

		resolve(heads);
	});

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

	const errors: ParseErr[] = [];
	const dict = new Map<string, any>();

	const logLineInfo = (li: LineInfo) => {
		const { content, row, indent } = li.lineInfo;
		log(
			`   LineInfo: row: #${row}, indent: ${indent}, ` +
				`content: "${formatLine(content)}"`
		);
	};

	const res1 = await fileToLines("00-with-errs.txt");
	if (res1.type === "ErrorType") {
		log("ERROR:");
		log(res1);
		return;
	}

	//	log(res1);

	const heads = await parseLinesToHeads(res1.lines);

	//	log(heads);

	logln(40);

	const errCount = heads.filter(h => h.type === "ParseErr").length;
	const errCount2 = heads.reduce(
		(acc, h) => (h.type === "ParseErr" ? acc + 1 : acc),
		0
	);

	log(`Error count: ${errCount2}`);

	logln(40);

	const div = () => {
		logln(30);
	};

	const logHead = (head: string) => {
		div();
		log(head);
		div();
	};

	{
		logHead("NumSeq.from(5, 15)");
		const arr = NumSeq.from(5, 15).toArray();
		log(arr);
	}

	{
		logHead("NumSeq.range(0, 10)");
		const arr = NumSeq.range(0, 10).toArray();
		log(arr);
	}

	{
		logHead("NumSeq.count(12)");
		const arr = NumSeq.count(12).toArray();
		log(arr);
	}

	{
		logHead("NumSeq.loop(5)");
		const arr = NumSeq.loop(5).toArray();
		log(arr);
	}

	{
		logHead("NumSeq.count(10).map(x => x*2)");
		const arr = NumSeq.count(10)
			.map(x => x * 2)
			.toArray();
		log(arr);
	}

	{
		logHead("NumSeq.count(10).map(x => `<${x}>`");
		const arr = NumSeq.count(10)
			.map(x => `<${x}>`)
			.toArray();
		log(arr);
	}

	{
		logHead("ArrSeq of $ with map and imap");
		const arr = ArraySeq.from(["abc", "cde", "mno", "yyz"])
			.map(s => s.toUpperCase())
			.imap((i, s) => `${i}: "${s}"`)
			.toArray();
		log(arr);
	}

	{
		logHead("NumSeq.count(10).map(x => `<${x}>`");
		const arr = NumSeq.count(10)
			.map(x => `<${x}>`)
			.toArray();
		log(arr);
	}

	{
		logHead("NumSeq.count(10).map(x => `<${x}>`");
		const arr = NumSeq.count(10)
			.map(x => `<${x}>`)
			.toArray();
		log(arr);
	}

	{
		logHead("NumSeq.filter(x => x % 2 === 0)");
		const arr = NumSeq.count(10)
			.filter(x => x % 2 === 0)
			.toArray();
		log(arr);
	}

	{
		logHead("NumSeq.count(10).skip(5)");
		const arr = NumSeq.count(10).skip(5).toArray();
		log(arr);
	}

	{
		logHead("NumSeq.count(10).take(5)");
		const arr = NumSeq.count(10).take(5).toArray();
		log(arr);
	}

	{
		logHead("NumSeq.count(20).skip(10).take(5)");
		const arr = NumSeq.count(20).skip(10).take(5).toArray();
		log(arr);
	}

	{
		logHead("Has perfect Cube root");
		const hasPerfectCubeRoot = (x: number): boolean => {
			const cr = Math.cbrt(x);
			return cr === Math.floor(cr);
		};
		const arr = NumSeq.count(1_000_000)
			.filter(hasPerfectCubeRoot)
			.toArray();
		log(arr);
	}

	{
		logHead("Has perfect Cube root");
		const hasPerfectCubeRoot = (x: number): boolean => {
			const cr = Math.cbrt(x);
			return cr === Math.floor(cr);
		};
		const arr = NumSeq.count(1_000_000)
			.filter(x => hasPerfectCubeRoot(x))
			.map(x => {
				return { x, cbrt: Math.cbrt(x) };
			})
			.toArray();
		log(arr);
	}

	{
		logHead("Has perfect Cube root mod 7");
		const hasPerfectCubeRoot = (x: number): boolean => {
			const cr = Math.cbrt(x);
			return cr === Math.floor(cr);
		};
		const arr = NumSeq.count(1_000_000)
			.filter(x => hasPerfectCubeRoot(x))
			.map(x => {
				return { x, cbrt: Math.cbrt(x) };
			})
			.filter(o => o.x % 7 === 0)
			.toArray();
		log(arr);
	}

	return;
};

// export const logSplitHeads2 = async () => {
// 	logh("Log Parse Begin 01");
// 	logln(40);
// 	log("Legend:");
// 	log("   Head: type and values yet to be parsed.");
// 	log("   <KeyValueHead>: " + "Key and value declared.");
// 	log("   <KeyHead>: " + "Key declared and value required on init.");
// 	log(
// 		"   <KeyBodyHead>: " +
// 			"Key declared and indented body to follow."
// 	);
// 	logln(40);

// 	const file = await open(getTextFile("00-with-errs.txt"));

// 	const errors: ParseErr[] = [];
// 	const dict = new Map<string, any>();

// 	const logLineInfo = (li: LineInfo) => {
// 		const { content, row, indent } = li.lineInfo;
// 		log(
// 			`   LineInfo: row: #${row}, indent: ${indent}, ` +
// 				`content: "${formatLine(content)}"`
// 		);
// 	};

// 	const logError = (err: ParseErr) => {};

// 	let lineNumber = 0;
// 	for await (const line of file.readLines()) {
// 		lineNumber++; // in N

// 		log(`ORG LINE #${lineNumber}: ` + `"${formatLine(line)}"`);

// 		const res1 = getPreLineInfo(line, lineNumber);

// 		if (res1.type === "ParseErr") {
// 			const err = res1;
// 			const { message } = err;
// 			logLineInfo(err);
// 			log(`PARSE-ERR: (${errors.length}): "${message}"`);
// 			errors.push(res1);
// 			logln(40);
// 			continue;
// 		}

// 		const lineInfo: LineInfo = {
// 			lineInfo: {
// 				content: res1.content,
// 				row: res1.row,
// 				indent: res1.indent,
// 			},
// 		};

// 		logLineInfo(lineInfo);

// 		const res2 = splitHead(lineInfo);
// 		switch (res2.type) {
// 			case "KeyValueHead":
// 				{
// 					const { keyHead, valueHead } = res2;
// 					log(
// 						`<KeyValueHead>: ` +
// 							`keyHead: "${keyHead}", ` +
// 							`valueHead: "${valueHead}"`
// 					);
// 				}
// 				break;
// 			case "KeyHead":
// 				{
// 					const { keyHead } = res2;
// 					log(`<KeyHead>: keyHead: "${keyHead}"`);
// 				}
// 				break;
// 			case "KeyBodyHead":
// 				{
// 					const { keyHead } = res2;
// 					log(`<KeyBodyHead>: keyHead: "${keyHead}"`);
// 				}
// 				break;
// 			case "EmptyLine":
// 				{
// 					log("<EmptyLine>");
// 				}
// 				break;
// 			case "ParseErr":
// 				{
// 					const err = res2;
// 					const { message } = err;
// 					log(`PARSE-ERR: (${errors.length}): "${message}"`);
// 					errors.push(err);
// 				}
// 				break;
// 			default:
// 				exhaustiveGuard(res2);
// 		}

// 		logln(40);
// 	}
// };

export const logParserLines = async () => {
	const file = await open(getTextFilePath("00-start.txt"));

	for await (const line of file.readLines()) {
		console.log(line);
	}
};
