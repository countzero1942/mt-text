"use server";

import { logh, logln } from "@/utils/log";
import { countOccurencesOf, splitStringOnce } from "@/utils/string";
import {
	exhaustiveGuard,
	isDefined,
	toFixedArray,
} from "@/utils/types";
import RenderFromTemplateContext from "next/dist/client/components/render-from-template-context";
import { NextServer } from "next/dist/server/next";
import { log } from "node:console";
import { open } from "node:fs/promises";

const getTextFile = (name: string) => `./text/parser/${name}`;

type PreLineInfo = {
	readonly type: "PreLineInfo";
	readonly content: string;
	readonly indent: number;
	readonly row: number;
};

type LineInfo = {
	readonly lineInfo: {
		readonly content: string;
		readonly indent: number;
		readonly row: number;
		readonly column?: number;
	};
};

type EmptyLine = Simplify<
	{
		readonly type: "EmptyLine";
	} & LineInfo
>;

type KeyValueHead = Simplify<
	{
		readonly type: "KeyValueHead";
		readonly keyHead: string;
		readonly valueHead: string;
	} & LineInfo
>;

type KeyHead = Simplify<
	{
		readonly type: "KeyHead";
		readonly keyHead: string;
	} & LineInfo
>;

type KeyBodyHead = Simplify<
	{
		readonly type: "KeyBodyHead";
		readonly keyHead: string;
	} & LineInfo
>;

type ParseErr = Simplify<
	{
		readonly type: "ParseErr";
		readonly message: string;
	} & LineInfo
>;

type TabsAndContent = {
	tabs: number;
	content: string;
};

const getTabsAndContent = (line: string): TabsAndContent => {
	const tabRegEx = /^(?<tabs>\t+)?(?<content>.*)/g;
	type TabContentGroups =
		| {
				tabs?: string;
				content?: string;
		  }
		| undefined;
	const res = tabRegEx.exec(line);

	const groups: TabContentGroups = res?.groups;

	return {
		tabs: groups?.tabs?.length ?? 0,
		content: groups?.content ?? "",
	};
};

const getPreLineInfo = (
	line: string,
	lineNumber: number
): PreLineInfo | ParseErr => {
	const getSpaceError = (): ParseErr => {
		return {
			type: "ParseErr",
			message: "Spaces cannot be used to indent lines, only tabs.",
			lineInfo: {
				indent: 0,
				content: line,
				row: lineNumber,
			},
		};
	};

	if (line.startsWith(" ")) {
		return getSpaceError();
	}

	const { tabs, content } = getTabsAndContent(line.trimEnd());

	if (content.startsWith(" ")) {
		return getSpaceError();
	}

	const preLineInfo: PreLineInfo = {
		type: "PreLineInfo",
		content,
		indent: tabs,
		row: lineNumber,
	};
	return preLineInfo;
};

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

const splitHead = (
	lineInfo: LineInfo
): KeyValueHead | KeyHead | KeyBodyHead | EmptyLine | ParseErr => {
	const { content: line, row: lineNumber } = lineInfo.lineInfo;

	// case: empty line
	if (line === "" || line === ":") {
		return {
			type: "EmptyLine",
			...lineInfo,
		};
	}

	// split line into keyHead and valueHead
	const parts = line.split(": ", 2).map(s => s.trim());
	log("   Parts:", parts);

	// create ParseErr error Object
	const getParseErr = (message: string): ParseErr => {
		return { type: "ParseErr", message, ...lineInfo };
	};

	// Error messages
	const confusingColon =
		"Cannot discern placement of key assignment colon. Must be ': '.";

	// switch on keyHead and valueHead parts
	switch (parts.length) {
		// case: "key: value", "key: value: value" => KeyValue Decl
		case 2: {
			const [keyHead, valueHead] = parts;
			if (keyHead === undefined || valueHead == undefined) {
				throw Error("Never");
			}
			return {
				type: "KeyValueHead",
				keyHead,
				valueHead,
				...lineInfo,
			};
		}
		// case: "key", "key:", "key:value", "key:key:value..."
		case 1: {
			const colonCount = countOccurencesOf(line, ":");
			switch (colonCount) {
				case 0:
					// case: "key" => Key Declaration
					return {
						type: "KeyHead",
						keyHead: line,
						...lineInfo,
					};

				default:
					// case: "key:" "key: stuff:8:" => Key Body Decl
					if (line.endsWith(":")) {
						return {
							type: "KeyBodyHead",
							keyHead: line.slice(0, -1),
							...lineInfo,
						};
					}
					// case: "key:key:value", ... => ERR
					return getParseErr(confusingColon);
			}
		}
		default:
			throw Error("Never");
	}
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
