import { logh, logln } from "@/utils/log";
import { log } from "console";

class A {
	constructor(
		public value: {
			x: number;
			y: number;
			foo: string;
		}
	) {}
}

class B {
	constructor(
		public value: {
			m: boolean;
			n: boolean;
			bar: string;
		}
	) {}
}

class C {
	constructor(
		public value: {
			thing1: string;
			thing2: string;
		}
	) {}
}

const arr: (A | B | C)[] = [
	new A({
		x: 23,
		y: 24,
		foo: "bar",
	}),
	new C({
		thing1: "something",
		thing2: "nothing",
	}),
	new B({
		m: true,
		n: false,
		bar: "foo",
	}),
	new A({
		x: 77,
		y: 88,
		foo: "diggety",
	}),
];

export const testOneOfClassStuff = () => {
	logh("One of Class Stuff");

	arr.forEach((obj) => {
		if (obj instanceof A) {
			const { x, y, foo } = obj.value;
			log(
				`Object is A: x: ${x}, ` +
					`y: ${y}, foo: ${foo} `
			);
		} else if (obj instanceof B) {
			const { m, n, bar } = obj.value;
			log(
				`Object is B: m: ${m}, ` +
					`n: ${n}, bar: ${bar}`
			);
		} else if (obj instanceof C) {
			const { thing1, thing2 } = obj.value;
			log(
				`Object is C: thing1: ${thing1}, ` +
					`thing2: ${thing2}`
			);
		}
		log(obj.value);
		logln(40);
	});
};
