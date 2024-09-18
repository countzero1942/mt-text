import { logh, logln } from "@/utils/log";
import { log } from "console";

interface A {
	isA: boolean;
	thing: string;
}

interface B {
	isB: boolean;
	stuff: number;
}

interface C {
	isC: boolean;
	dodad: number;
}

const getArray = (): (A | B | C)[] => {
	return [
		{ isA: true, thing: "something" } as A,
		<C>{ isC: true, dodad: 42 },
		{ isB: true, stuff: 6.28 } as B,
		{ isA: true, thing: "a thing" } as A,
	];
};

function getProperty<T, K extends keyof T>(
	o: T,
	propertyName: K
): T[K] {
	return o[propertyName]; // o[propertyName] is of type T[K]
}

function hasProperty<T, K extends keyof T>(
	o: T,
	propertyName: K
): boolean {
	return getProperty(o, propertyName) !== undefined;
}

function isObject<T, K extends keyof T>(
	o: T,
	propertyName: K
): o is T {
	return o[propertyName] !== undefined;
}

export const testOneOfInterfaceStuff = () => {
	const arr = getArray();

	const a = arr[0];

	logh("Test One of Stuff");
	log(a);
	const x = getProperty(a as A, "isA");
	log(`isB: ${x}`);
	const b = hasProperty(a as A, "isA");
	log(`isA?: ${b}`);

	logh("Test Array");

	arr.forEach((o) => {
		if (isObject(<A>o, "isA")) {
			const a = o as A;
			log(`Object is A: thing: ${a.thing}`);
			log(o);
			logln(40);
		} else if (isObject(o as B, "isB")) {
			const b = o as B;
			log(`Object is B: stuff: ${b.stuff}`);
			log(o);
			logln(40);
		} else if (isObject(o as C, "isC")) {
			const c = o as C;
			log(`Object is C: dodad: ${c.dodad}`);
			log(o);
			logln(40);
		}
	});
};
