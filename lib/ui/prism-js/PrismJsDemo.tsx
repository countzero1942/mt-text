import React from "react";
import PrismLoader from "./PrismLoader";
import { getTsCode } from "@/actions/text-server";
import {
	demoReadFileError,
	demoReadTextError,
	demoReadTextSuccess,
} from "@/actions/utils/file";
import { log, logh, logln } from "@/actions/utils/log";

export default async function PrismJSDemo() {
	const ts = await getTsCode();
	const err = await demoReadFileError();
	const res = await demoReadTextError();
	logh("PrismJSDemo");
	log(res);
	const str = await demoReadTextSuccess();
	logh("PrismJSDemo");
	log(str);
	return (
		<article>
			<pre className="language-json">
				<code className="language-json">
					{JSON.stringify(err, null, 4)}
				</code>
			</pre>
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
