"use server";

import { logh, logln } from "@/utils/log";
import { isDefined } from "@/utils/types";
import RenderFromTemplateContext from "next/dist/client/components/render-from-template-context";
import { log } from "node:console";
import { open } from "node:fs/promises";

const getTextFile = (name: string) => `./text/parser/${name}`;

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

const splitHead = (
	lineInfo: LineInfo
): KeyValueHead | EmptyLine | ParseErr => {
	const { line } = lineInfo.lineInfo;

	if (line === "" || line === ":") {
		return {
			type: "EmptyLine",
			...lineInfo,
		};
	}

	const parts = line.split(": ").map(s => s.trim());

	if (parts.length === 2) {
		const [keyHead, valueHead] = parts;
		if (keyHead === undefined || valueHead == undefined) {
			throw Error("Never");
		}
		return {
			type: "KeyValueHead",
			keyHead,
			valueHead,
			...setLineColumn(lineInfo, 5),
		};
	}

	const message =
		parts.length === 0
			? "Key is missing assignment colon."
			: "Line has multiple assigment colons.";

	return {
		type: "ParseErr",
		message,
		...lineInfo,
	};
};

type ExtractGroupNames<S extends string> =
	S extends `${string}(?<${infer Name}>${infer Rest}`
		? Record<Name, string> & ExtractGroupNames<Rest>
		: Record<never, any>;

interface MyMatch {
	tabs?: string;
	content?: string;
}

type MyType = {
	tabs?: string;
	content?: string;
};

const getLineIndent = (line: string) => {
	const tabRegEx = /^(?<tabs>\t+)?(?<content>.*)/g;
	type TabContentGroups =
		| {
				tabs?: string;
				content?: string;
		  }
		| undefined;

	const res = tabRegEx.exec(line);

	log(`Match line: "${line}"`);
	log(`Regex string: "${tabRegEx.source}"`);
	log(res);
	logln(20);
	const groups1: MyMatch | undefined = res?.groups;
	const groups2: TabContentGroups = res?.groups;
	log("groups1");
	log(groups1);
	logln(20);
	log("groups2");
	log(
		`tab count: ${groups2?.tabs?.length ?? 0}, ` +
			`content: "${groups2?.content}"`
	);
	logln(40);
};

type TabsContent = {
	tabs: number;
	content: string;
};

const getTabsContent1 = (line: string): TabsContent => {
	const tabRegEx = /^(?<tabs>\t+)?(?<content>.*)/g;
	type TabContentGroups =
		| {
				tabs?: string;
				content?: string;
		  }
		| undefined;
	const res = tabRegEx.exec(line);

	const groups: TabContentGroups = res?.groups;

	log("res1:");
	log(res);

	return {
		tabs: groups?.tabs?.length ?? 0,
		content: groups?.content ?? "",
	};
};

const getTabsContent2 = (line: string): TabsContent => {
	const tabRegEx = /^(\t+)?(.*)/g;
	const res = tabRegEx.exec(line);
	if (res === null) {
		throw Error("Never");
	}
	const tabs = res[1]?.length ?? 0;
	const content = res[2] ?? "";

	log("res2:");
	log(res);

	return {
		tabs,
		content,
	};
};

const scrubLine = (line: string) => {
	return line.replaceAll("\t", "\\t");
};

const testExtractTabsContent = (line: string) => {
	log(`line: "${scrubLine(line)}"`);
	logln(20);
	const res1 = getTabsContent1(line);
	log("getTabsContent1:");
	log(res1);
	logln(20);
	const res2 = getTabsContent2(line);
	log("getTabsContent2:");
	log(res2);
	logln(40);
};

const testLines = () => {
	logh("Test Extract Tabs and Content");

	testExtractTabsContent("");
	testExtractTabsContent("\t");
	testExtractTabsContent("Content");
	testExtractTabsContent("\tContent");
	testExtractTabsContent("\t\tContent");
};

const testGetLineIndent = () => {
	logh("Test Extract Tabs and Content");
	getLineIndent("");
	getLineIndent("\t");
	getLineIndent("Content");
	getLineIndent("\tContent");
	getLineIndent("\t\tContent");
};

const getLineInfo = (line: string, lineNumber: number) => {};

export const logSplitHeads = async () => {
	const file = await open(getTextFile("00-start.txt"));

	// testGetLineIndent();
	testLines();
	let i = 0;
	for await (const line of file.readLines()) {
		// const res = splitHead(line, i);
		// if (isError(res)) {
		// 	const { line, lineNumber, message } = res;
		// 	logh("Error");
		// 	log(`Error message: "${message}"`);
		// 	log(`Line: "${line}"`);
		// 	log(`Line number: ${lineNumber}`);
		// } else {
		// 	const { key, value } = res;
		// 	logh("Key-value");
		// 	log(`Key: ${key}`);
		// 	log(`Value: ${value}`);
		// }
		// logln(40);

		i++;
	}
};

export const logParserLines = async () => {
	const file = await open(getTextFile("00-start.txt"));

	for await (const line of file.readLines()) {
		console.log(line);
	}
};
