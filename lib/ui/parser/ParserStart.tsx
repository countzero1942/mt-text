import {
	logParserLines,
	logPushArray,
	logSplitHeads,
} from "@/actions/parser/parser-start";
import { log, logh, logln } from "@/utils/log";
import {
	addFail1,
	addFail2,
	addSuccess1,
	addSuccess2,
} from "@/actions/promise-stuff";
import { resolve } from "path";
import { testNoInfer } from "@/actions/type-fun/get-type-of-things";
import { testGetKeysAndValuesWithFuncs } from "@/actions/type-fun/one-of-interface";

export default async function ParserStart() {
	//	await logParserLines();
	// logPushArray();
	await logSplitHeads();
	//	await new Promise((resolve) => setTimeout(resolve, 100));
	// testGetKeysAndValuesWithFuncs();

	return (
		<article>
			<h2>Parser Start</h2>
			<p>Blah blah blah</p>
		</article>
	);
}
