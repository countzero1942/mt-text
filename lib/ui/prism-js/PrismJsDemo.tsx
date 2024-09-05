import React from "react";
import PrismLoader from "./PrismLoader";
import { getTsCode } from "@/actions/text-server";
import { demoReadFileError } from "@/actions/utils/file";
import JS from "@/utils/js";

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
const myJSObjStrSpaces = JS.stringify(myJSObj, {
	tabSize,
	toTabs: false,
});
const myJSObjStrTabs = JS.stringify(myJSObj, {
	toTabs: true,
});

export default async function PrismJSDemo() {
	const err = await demoReadFileError();
	const ts = await getTsCode();
	return (
		<article>
			<h2>Err Json.stringify()</h2>
			<pre className="language-json">
				<code className="language-json">
					{JSON.stringify(err, null, 3)}
				</code>
			</pre>
			<h2>Err JS.stringify()</h2>
			<pre className="language-js">
				<code className="language-js">
					{JS.stringify(err, { toTabs: true })}
				</code>
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
