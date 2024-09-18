import { log, logh, logln } from "@/utils/log";
import {
	compareTypeAndClassName,
	getErrorMessage,
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

/**
 * Here we resolve Types to be compared and
 * return Type Error msg on mismatch.
 *
 * @param x
 * @param y
 * @returns
 */
const resolveTypes = (
	x: any,
	y: any
): {
	isTypeAndClassNameMatch: boolean;
	typeMismatchErrorMessage?: string;
} => {
	const info = compareTypeAndClassName(x, y);
	const {
		isTypeAndClassNameMatch,
		isTypeMatch,
		typeA,
		typeB,
		isClassNameMatch,
		classNameA,
		classNameB,
	} = info;
	log(info);
	// everthing good
	if (isTypeAndClassNameMatch) {
		return {
			isTypeAndClassNameMatch,
		};
	}
	// type match of "Class", class name mismatch
	if (isTypeMatch) {
		const typeMismatchErrorMessage =
			`Type x: "Class:${classNameA}" !== ` +
			`Type y: "Class:${classNameB}"`;
		return {
			isTypeAndClassNameMatch,
			typeMismatchErrorMessage,
		};
	}
	// type mismatch
	const typeMismatchErrorMessage =
		`Type x: "${typeA}" !== ` + `Type y: "${typeB}"`;
	return {
		isTypeAndClassNameMatch,
		typeMismatchErrorMessage,
	};
};

/**
 * Our 'add' async function
 *
 * @param x
 * @param y
 * @returns
 */
export const add = (x: any, y: any) =>
	new Promise<any>((resolve, reject) => {
		const {
			isTypeAndClassNameMatch,
			typeMismatchErrorMessage,
		} = resolveTypes(x, y);

		if (!isTypeAndClassNameMatch) {
			reject(TypeError(typeMismatchErrorMessage));
		}

		const sum = x + y;
		if (sum) {
			resolve(sum);
		} else {
			reject(Error("Can't add two values"));
		}
	});

/**
 * Our 'subtract' async function.
 *
 * @param x
 * @param y
 * @returns
 */
export const subtract = (x: any, y: any) =>
	new Promise<any>((resolve, reject) => {
		const {
			isTypeAndClassNameMatch,
			typeMismatchErrorMessage,
		} = resolveTypes(x, y);

		if (!isTypeAndClassNameMatch) {
			reject(TypeError(typeMismatchErrorMessage));
		}

		const sum = x - y;
		if (sum) {
			resolve(sum);
		} else {
			reject(Error("Can't subtract two values"));
		}
	});

export const addSuccess1 = async () => {
	logh("addSuccess1");
	try {
		const x = 2;
		const y = 3;
		const sum = await add(x, y);
		log(`add(${x}, ${y}) = ${sum}`);
	} catch (error) {
		log(getErrorMessage(error as Error));
	}
};

export const addSuccess2 = async () => {
	logh("addSuccess2");
	try {
		const x = "abc";
		const y = "def";
		const sum = await add(x, y);
		log(`add(${x}, ${y}) = ${sum}`);
	} catch (error) {
		log(getErrorMessage(error as Error));
	}
};

export const addFail1 = async () => {
	logh("addFail1");
	try {
		const x = 2;
		const y = "abc";
		const sum = await add(x, y);
		log(`add(${x}, ${y}) = ${sum}`);
	} catch (error) {
		log(getErrorMessage(error as Error));
	}
};

export const addFail2 = async () => {
	logh("addFail2");
	try {
		const x = new Animal("cat");
		const y = new Dog("mutt");
		const sum = await add(x, y);
		log(`add(${x}, ${y}) = ${sum}`);
	} catch (error) {
		log(getErrorMessage(error as Error));
	}
};
