import { log, logh, logln } from "@/utils/log";
import {
	compareTypeAndClassName,
	getClassName,
	getErrorMessage,
	getType,
	isTypeAndClassNameMatch,
	isTypeMatch,
} from "@/utils/types";

class Animal {
	kind: string;
	legs: number;
	tail: boolean;
	constructor(
		kind: string,
		legs: number = 4,
		tail: boolean = true
	) {
		this.kind = kind;
		this.legs = legs;
		this.tail = tail;
	}
	public toString() {
		return (
			`<Animal: kind: ${this.kind}, legs: ${this.legs}, ` +
			`tail: ${this.tail}>`
		);
	}
}

class Dog extends Animal {
	breed: string;
	constructor(breed: string) {
		super("Dog", 4, true);
		this.breed = breed;
	}
	public toString() {
		return (
			`<Animal:Dog: breed: ${this.breed}, legs: ${this.legs}, ` +
			`tail: ${this.tail}>`
		);
	}
}

class Thing {}

const logEntity = (x: any) => {
	const tx = getType(x);

	if (tx === "Function") {
		log(`${x}`);
	} else if (tx === "Error") {
		log(getErrorMessage(x));
	} else {
		log(x);
	}

	logln(10);
	if (x && x.name) {
		log(`Name: ${x.name}`);
	}
	log(`Type: ${tx}`);
	if (tx === "Class" || tx === "Error") {
		log(`Class name: ${getClassName(x)}`);
	}
	logln(40);
};

export const logEntityTypes = () => {
	logh("Get Entity Types");
	const x1 = 23;
	logEntity(x1);
	const x2 = "abc";
	logEntity(x2);
	const x3 = true;
	logEntity(x3);
	const x4 = undefined;
	logEntity(x4);
	const x5 = null;
	logEntity(x5);
	const x6 = /\w+/gmu;
	logEntity(x6);
	const x7 = [1, 2, 3];
	logEntity(x7);
	const x8 = 1234567890123456789012345n;
	logEntity(x8);
	const x9 = Symbol("A new symbol");
	logEntity(x9);
	const x9b = new Date();
	logEntity(x9b);

	const x10 = () => {
		return "stuff";
	};
	logEntity(x10);
	function x11() {
		return "stuff2";
	}
	logEntity(x11);

	const x15 = new Set(["a", "b", "c"]);
	logEntity(x15);

	const x16 = new Map([
		["apples", 500],
		["bananas", 300],
		["oranges", 200],
	]);
	logEntity(x16);

	const x20 = {
		a: "a string",
		b: 42,
		c: {
			x: 2.81,
			y: true,
		},
	};
	logEntity(x20);

	const x30 = new Animal("Cat");
	logEntity(x30);
	const x31 = new Dog("Mutt");
	logEntity(x31);

	const x40 = new Error("An error");
	logEntity(x40);
	const x41 = new RangeError("Range error");
	logEntity(x41);
};

export const testTypeMatchAndCompare = () => {
	const logIsTypeMatch = (a: any, b: any) => {
		log(a);
		logln(10);
		log(b);
		logln(10);
		log("isTypeMatch(a, b): ", isTypeMatch(a, b));
		logln(60);
	};
	const logIsTypeAndClassMatch = (a: any, b: any) => {
		log(a);
		logln(10);
		log(b);
		logln(10);
		log(
			"isTypeAndClassMatch(a, b): ",
			isTypeAndClassNameMatch(a, b)
		);
		logln(20);
		log(compareTypeAndClassName(a, b));
		logln(60);
	};

	const set = new Set(["a", "b", "c"]);
	const map = new Map([
		["apples", 500],
		["bananas", 300],
		["oranges", 200],
	]);
	const array1 = [1, 2, 3, 4];
	const array2 = [2, 3, 4, 5];
	const obj1 = {
		a: 23,
		b: 33,
		c: { x: "a string", y: /\w+/gmu },
	};
	const obj2 = {
		n: 33,
		m: 6.28,
		p: { x: "stuff", y: /\s+/gmu },
	};
	const date = new Date();
	const cat = new Animal("Cat");
	const dog = new Dog("Mutt");
	const snake = new Animal("Snake");
	const thing = new Thing();
	const regex1 = /\w+/gmu;
	const regex2 = /\s*/gmu;

	logh("Is Type Match");
	logIsTypeMatch(23, 43);
	logIsTypeMatch(23, "abc");
	logIsTypeMatch(regex1, regex2);
	logIsTypeMatch(regex1, "abc");
	logIsTypeMatch(cat, dog);
	logIsTypeMatch(cat, snake);
	logIsTypeMatch(cat, thing);
	logIsTypeMatch(array1, thing);
	logIsTypeMatch(obj1, obj2);
	logIsTypeMatch(obj1, thing);

	log();
	logh("Is Type and Class Match");
	logIsTypeAndClassMatch(23, 43);
	logIsTypeAndClassMatch(23, "abc");
	logIsTypeAndClassMatch(regex1, regex2);
	logIsTypeAndClassMatch(regex1, "abc");
	logIsTypeAndClassMatch(cat, dog);
	logIsTypeAndClassMatch(cat, snake);
	logIsTypeAndClassMatch(cat, thing);
	logIsTypeAndClassMatch(array1, thing);
	logIsTypeAndClassMatch(obj1, obj2);
	logIsTypeAndClassMatch(obj1, thing);
};
