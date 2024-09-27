import {
	EmptyLine,
	LineInfo,
	ParseErr,
} from "@/parser/types/general";
import {
	KeyBodyHead,
	KeyHead,
	KeyValueHead,
} from "@/parser/types/head";
import { log } from "@/utils/log";
import { countOccurencesOf, splitStringOnce } from "@/utils/string";
import { toFixedArray } from "@/utils/types";

export const splitHead = (
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
	//	const parts = line.split(": ", 2).map(s => s.trim());

	const parts = splitStringOnce(line, ": ").map(s => s.trim());
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
			const [keyHead, valueHead] = toFixedArray(parts, 2);
			return {
				type: "KeyValueHead",
				keyHead,
				valueHead,
				...lineInfo,
			};
		}
		// case: "key", "key:", "key:value", "key:key:value..."
		case 1: {
			const [keyHead] = toFixedArray(parts, 1);
			const colonCount = countOccurencesOf(keyHead, ":");
			switch (colonCount) {
				case 0:
					// case: "key" => Key Declaration
					return {
						type: "KeyHead",
						keyHead,
						...lineInfo,
					};

				default:
					// case: "key:" "key: stuff:8:" => Key Body Decl
					if (line.endsWith(":")) {
						return {
							type: "KeyBodyHead",
							keyHead: keyHead.slice(0, -1),
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
