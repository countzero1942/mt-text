import { log, logh, logln } from "@/utils/log";

const getPrototype = (item: any) => {
	return Object.prototype.toString.call(item).slice(8, -1);
};

export type getTypeReturn =
	| "Number"
	| "String"
	| "Boolean"
	| "Undefined"
	| "Null"
	| "RegEx"
	| "Array"
	| "Function"
	| "Object"
	| "Class";

const getType = (item: any): getTypeReturn => {
	if (item === null) {
		return "Null";
	}
	if (typeof item === "undefined") {
		return "Undefined";
	}
	const prototype: getTypeReturn = getPrototype(
		item
	) as getTypeReturn;
	if (prototype === "Object") {
		if (item.constructor.name === "Object") {
			return "Object";
		}
		return "Class";
	}
	return prototype;
};

const getType2 = (
	item: any
):
	| "Number"
	| "String"
	| "Boolean"
	| "Undefined"
	| "Null"
	| "RegEx"
	| "Array"
	| "Function"
	| "Object"
	| "Class" => {
	if (item === null) {
		return "Null";
	}
	if (typeof item === "undefined") {
		return "Undefined";
	}
	const prototype: getTypeReturn = getPrototype(
		item
	) as getTypeReturn;
	if (prototype === "Object") {
		if (item.constructor?.name) {
			return "Class";
		}
	}
	return prototype;
};

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

const logEntity = (x: any) => {
	const tx = getType(x);
	if (tx !== "Function") {
		log(x);
	} else {
		log(`${x}`);
	}
	logln(10);
	if (x && x.name) {
		log(`Name: ${x.name}`);
	}
	log(`Type: ${tx}`);
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

	const x10 = () => {
		return "stuff";
	};
	logEntity(x10);
	function x11() {
		return "stuff2";
	}
	logEntity(x11);

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
};

const getTypeString = (
	tx: string,
	x: any,
	ty: string,
	y: any
) => {
	return `x: ${tx} = ${x}, y: ${ty} = ${y}`;
};

export const add = (x: any, y: any) =>
	new Promise<any>((resolve, reject) => {
		const tx = getType(x);
		const ty = getType(y);
		if (tx !== ty) {
			reject(
				Error(
					`Type mismatch: ${getTypeString(
						tx,
						x,
						ty,
						y
					)}`
				)
			);
		}
		const sum = x + y;
		if (sum) {
			resolve(sum);
		} else {
			reject(Error("Can't add two values"));
		}
	});

export const subtract = (x: any, y: any) =>
	new Promise<any>((resolve, reject) => {
		const tx = getType(x);
		const ty = getType(y);
		if (tx !== ty) {
			reject(
				Error(
					`Type mismatch: ${getTypeString(
						tx,
						x,
						ty,
						y
					)}`
				)
			);
		}
		const sum = x - y;
		if (sum) {
			resolve(sum);
		} else {
			reject(Error("Can't subtract two values"));
		}
	});

export const addSuccess1 = async () => {
	try {
		const x = 2;
		const y = 3;
		const sum = await add(x, y);
		log(`add(${x}, ${y}) = ${sum}`);
	} catch (error) {
		if (error instanceof Error) {
			log("Error: ", error.message);
		} else {
			log(error);
		}
	}
};

export const addFail1 = async () => {
	try {
		const x = 2;
		const y = "abc";
		const sum = await add(x, y);
		log(`add(${x}, ${y}) = ${sum}`);
	} catch (error) {
		if (error instanceof Error) {
			log("Error:", error.message);
		} else {
			log(error);
		}
	}
};

export const addFail2 = async () => {
	try {
		const x = new Animal("cat");
		const y = new Dog("mutt");
		const sum = await add(x, y);
		log(`add(${x}, ${y}) = ${sum}`);
	} catch (error) {
		if (error instanceof Error) {
			log("Error:", error.message);
		} else {
			log(error);
		}
	}
};
