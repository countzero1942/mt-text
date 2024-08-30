import React from "react";
import PrismLoader from "./PrismLoader";
import { getTsCode } from "@/actions/text-server";

export default async function PrismJSDemo() {
	const ts = await getTsCode();
	return (
		<article>
			<pre className="language-js">
				<code className="language-js">
					console.log("hello world")
				</code>
			</pre>
			<pre className="language-ts">
				<code className="language-ts">
					console.log("hello world")
				</code>
			</pre>
			<pre className="language-ts">
				<code className="language-ts">{ts}</code>
			</pre>
			<PrismLoader />
		</article>
	);
}
