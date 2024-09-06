import {
	addFail1,
	addSuccess1,
	addFail2,
	addSuccess2,
} from "@/actions/promise-stuff";
import {
	logEntityTypes,
	testTypeMatchAndCompare,
} from "test/lib/utils/test-types";

export default async function PromiseStuff() {
	await addSuccess1();
	await addSuccess2();
	await addFail1();
	await addFail2();
	//logEntityTypes();
	// testTypeMatchAndCompare();
	return (
		<article>
			<h2>Promise Stuff</h2>
		</article>
	);
}
