"use server";

import { logh, logln } from "@/utils/log";
import { countOccurencesOf } from "@/utils/string";
import { isDefined } from "@/utils/types";
import RenderFromTemplateContext from "next/dist/client/components/render-from-template-context";
import { log } from "node:console";
import { open } from "node:fs/promises";

const getTextFile = (name: string) => `./text/parser/${name}`;

type PreLineInfo = {
	readonly type: "PreLineInfo";
	readonly line: string;
	readonly indent: number;
	readonly lineNumber: number;
};

type LineInfo = {
	readonly lineInfo: {
		readonly line: string;
		readonly indent: number;
		readonly lineNumber: number;
		readonly lineColumn?: number;
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
				line,
				lineNumber,
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
		line: content,
		indent: tabs,
		lineNumber,
	};
	return preLineInfo;
};

const setLineColumn = (
	lineInfo: LineInfo,
	lineColumn: number
): LineInfo => {
	const { line, indent, lineNumber } = lineInfo.lineInfo;
	return {
		lineInfo: {
			line,
			indent,
			lineNumber,
			lineColumn,
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
): KeyValueHead | EmptyLine | ParseErr => {
	const { line, lineNumber } = lineInfo.lineInfo;

	// case: empty line
	if (line === "" || line === ":") {
		return {
			type: "EmptyLine",
			...lineInfo,
		};
	}

	// split line into keyHead and valueHead
	const parts = line.split(": ").map(s => s.trim());
	log("Parts:", parts);

	// create ParseErr error Object
	const getParseErr = (message: string): ParseErr => {
		return { type: "ParseErr", message, ...lineInfo };
	};

	// Error messages
	const missingColonErr = "Key is missing assignment colon.";
	const colonNeedsSpaceErr =
		"There must be space between " +
		"key assignment colon and value.";
	const confusingColon =
		"Cannot discern placement of assignment colon.";

	// switch on keyHead and valueHead parts
	switch (parts.length) {
		// case: "key: value" => OK
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
		// case: "key" or "key:" or "key:value" or "key:key:value..."
		case 1: {
			const colonCount = countOccurencesOf(line, ":");
			switch (colonCount) {
				case 0:
					// case: "key" => ERR
					return getParseErr(missingColonErr);

				case 1:
					// case: "key:" => OK
					if (line.endsWith(":")) {
						return {
							type: "KeyValueHead",
							keyHead: line.replace(":", ""),
							valueHead: "",
							...lineInfo,
						};
					}
					// case: "key:value" => ERR
					return getParseErr(colonNeedsSpaceErr);

				// "key:key:value..." => ERR
				default:
					return getParseErr(confusingColon);
			}
		}
		// case: "key: key: value" => ERR
		default: {
			return getParseErr(confusingColon);
		}
	}
};

export const logSplitHeads = async () => {
	logh("Log Parse Begin 01");

	const file = await open(getTextFile("00-with-errs.txt"));

	const errors: ParseErr[] = [];
	const dict = new Map<string, any>();

	const logLineInfo = (li: LineInfo) => {
		const { line, lineNumber, indent } = li.lineInfo;
		log(
			`   (line#${lineNumber}), indent: ${indent}, ` +
				`line: "${formatLine(line)}"`
		);
	};
	const logError = (err: ParseErr) => {
		log(`PARSE-ERR: (${errors.length}): "${err.message}"`);
		logLineInfo(err as LineInfo);
		logln(40);
	};

	let lineNumber = 1;
	for await (const line of file.readLines()) {
		log(`ORG LINE(#${lineNumber}): ` + `"${formatLine(line)}"`);

		const res1 = getPreLineInfo(line, lineNumber);

		if (res1.type === "ParseErr") {
			const err = res1;
			errors.push(res1);
			logError(err);
			continue;
		}

		const lineInfo: LineInfo = {
			lineInfo: {
				line: res1.line,
				lineNumber: res1.lineNumber,
				indent: res1.indent,
			},
		};

		const res2 = splitHead(lineInfo);
		switch (res2.type) {
			case "KeyValueHead":
				{
					const { keyHead, valueHead } = res2;
					log(
						`KeyValueHead: keyHead: "${keyHead}", ` +
							`valueHead: "${valueHead}"`
					);
					logLineInfo(lineInfo);
					logln(40);
				}
				break;
			case "EmptyLine":
				{
					log("EmptyLine");
					logLineInfo(lineInfo);
					logln(40);
				}
				break;
			case "ParseErr":
				{
					const err = res2;
					errors.push(err);
					logError(err);
				}
				break;
		}

		lineNumber++;
	}
};

export const logParserLines = async () => {
	const file = await open(getTextFile("00-start.txt"));

	for await (const line of file.readLines()) {
		console.log(line);
	}
};
