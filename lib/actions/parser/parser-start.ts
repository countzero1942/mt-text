"use server";

import { logh, logln } from "@/utils/log";
import { log } from "node:console";
import { open } from "node:fs/promises";

const getTextFile = (name: string) =>
	`./text/parser/${name}`;

interface EmptyLine {
	isEmptyLine: boolean;
}

interface Head {
	isError?: boolean;
	isKeyValue: boolean;
	key: string;
	value: string;
}

interface ParseErr {
	isError: boolean;
	message: string;
	line: string;
	lineNumber: number;
	lineColumn?: number;
}

const splitHead = (
	line: string,
	lineNumber: number
): Head | ParseErr => {
	const parts = line.split(": ");
	if (parts.length === 2) {
		const [key, value] = parts;
		return {
			isKeyValue: true,
			key,
			value,
		};
	}

	const message =
		parts.length === 0
			? "Key is missign assignment colon."
			: "Line has multiple assigment colons.";

	return {
		isError: true,
		line,
		message,
		lineNumber,
	};
};

export const logSplitHeads = async () => {
	const file = await open(getTextFile("00-start.txt"));

	const isError = (
		res: Head | ParseErr
	): res is ParseErr => res.isError === true;

	let i = 0;
	for await (const line of file.readLines()) {
		const res = splitHead(line, i);
		if (isError(res)) {
			const { line, lineNumber, message } = res;
			logh("Error");
			log(`Error message: "${message}"`);
			log(`Line: "${line}"`);
			log(`Line number: ${lineNumber}`);
		} else {
			const { key, value } = res;
			logh("Key-value");
			log(`Key: ${key}`);
			log(`Value: ${value}`);
		}
		logln(40);

		i++;
	}
};

export const logParserLines = async () => {
	const file = await open(getTextFile("00-start.txt"));

	for await (const line of file.readLines()) {
		console.log(line);
	}
};
