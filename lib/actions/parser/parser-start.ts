"use server";

import { log, logh, logln } from "@/utils/log";
import { countOccurencesOf, splitStringOnce } from "@/utils/string";
import {
	exhaustiveGuard,
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
import { splitHead } from "@/parser/utils/split-head";

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
