import React from "react";
import PrismLoader from "./PrismLoader";
import { getTsCode } from "@/actions/text-server";
import {
	demoReadFileError,
	demoReadTextError,
	demoReadTextSuccess,
} from "@/actions/utils/file";
import { log, logh, logln } from "@/actions/utils/log";
import { toJavascriptString } from "@/actions/utils/prettify";

const myJSObj = {
	foo: 23,
	bar: 77,
	this: {
		that: "something",
		"other-thing": 42,
		person: {
			"kebab-name": "Alex",
			"last-name": "kebab-son   ",
			addy: {
				street: "123 Main St    ",
				city: "Frisco",
				country: "USofA",
			},
		},
	},
	somethingCompletelyDifferent: true,
	snaky_key: "ssss",
};

const tabSize = 4;
const myJSObjStrSpaces = toJavascriptString(
	myJSObj,
	tabSize,
	false
);
const myJSObjStrTabs = toJavascriptString(
	myJSObj,
	tabSize,
	true
);

export default async function PrismJSDemo() {
	const ts = await getTsCode();
	const err = await demoReadFileError();
	const res = await demoReadTextError();
	logh("PrismJSDemo");
	log(res);
	const str = await demoReadTextSuccess();
	logh("PrismJSDemo");
	log(str);
	const errStr = toJavascriptString(err);
	return (
		<article>
			<h2>Err Json.stringify()</h2>
			<pre className="language-json">
				<code className="language-json">
					{JSON.stringify(err, null, 3)}
				</code>
			</pre>
			<h2>Err toJavascriptString()</h2>
			<pre className="language-js">
				<code className="language-js">{errStr}</code>
			</pre>
			<h2>myJSObjStrSpaces</h2>
			<pre className="language-js">
				<code className="language-js">
					{myJSObjStrSpaces}
				</code>
			</pre>
			<h2>myJSObjStrTabs</h2>
			<pre className="language-js">
				<code className="language-js">
					{myJSObjStrTabs}
				</code>
			</pre>
			<h2>text-server ts &ldquo;./text/ts.txt&rdquo;</h2>
			<pre className="language-ts">
				<code className="language-ts">{ts}</code>
			</pre>
			<PrismLoader />
		</article>
	);
}
