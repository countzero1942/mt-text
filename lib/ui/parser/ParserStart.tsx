import {
	logParserLines,
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
import { testLogAreaOfShapes } from "@/actions/type-fun/get-type-of-things";

export default async function ParserStart() {
	//	await logParserLines();
	// await logSplitHeads();
	testLogAreaOfShapes();
	//	await new Promise((resolve) => setTimeout(resolve, 100));
	return (
		<article>
			<h2>Parser Start</h2>
			<p>Blah blah blah</p>
		</article>
	);
}
