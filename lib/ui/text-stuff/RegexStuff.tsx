import {
	buildObject,
	getValuesFromObject,
	objectToJson,
	printObject,
} from "@/actions/dostuff";

export default async function RegexStuff() {
	await printObject();
	await getValuesFromObject();
	await buildObject();
	await objectToJson();
	return (
		<article>
			<h2>RegexStuff</h2>
			<p>The console should output "hello world"</p>
		</article>
	);
}
