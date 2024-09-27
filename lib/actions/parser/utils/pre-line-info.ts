import { ParseErr } from "@/parser/types/general";

export type PreLineInfo = {
	readonly type: "PreLineInfo";
	readonly content: string;
	readonly indent: number;
	readonly row: number;
};

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

export const getPreLineInfo = (
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
