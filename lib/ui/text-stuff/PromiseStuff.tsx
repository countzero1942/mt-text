import {
	addFail1,
	addSuccess1,
	addFail2,
	logEntityTypes,
} from "@/actions/promise-stuff";

export default function PromiseStuff() {
	// await addSuccess1();
	// await addFail1();
	// await addFail2();
	logEntityTypes();
	return (
		<article>
			<h2>Promise Stuff</h2>
		</article>
	);
}
