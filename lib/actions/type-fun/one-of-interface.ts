import { logh, logln } from "@/utils/log";
import { log } from "console";

interface A {
	type: "A";
	isA: boolean;
	thing: string;
}

interface B {
	type: "B";
	isB: boolean;
	stuff: number;
}

interface C {
	type: "C";
	isC: boolean;
	dodad: number;
}

const getArray = (): ReadonlyArray<A | B | C> => {
	return [
		{ type: "A", isA: true, thing: "something" },
		{ type: "C", isC: true, dodad: 42 },
		{ type: "B", isB: true, stuff: 6.28 } as B,
		{ type: "A", isA: true, thing: "a thing" } as A,
	];
};

const getValue = <
	TObj extends Record<string, any>,
	K extends keyof TObj
>(
	obj: TObj,
	key: K
): TObj[K] => {
	return obj[key]; // o[propertyName] is of type T[K]
};

const hasKey = <
	TObj extends Record<string, any>,
	K extends keyof TObj
>(
	obj: TObj,
	key: K
): boolean => {
	return getValue(obj, key) !== undefined;
};

const getKeys = <
	TObj extends Record<string, any>,
	K extends keyof TObj
>(
	obj: TObj
): K[] => {
	return Object.keys(obj) as K[];
};

const isObject = <const TObj extends object, K extends keyof TObj>(
	obj: TObj,
	key: K
): obj is TObj => {
	return obj[key] !== undefined;
};

const isObjectWithKV = <
	TObj extends Record<string, any>,
	K extends keyof TObj
>(
	obj: TObj,
	key: K
): obj is TObj => {
	return obj[key] !== undefined;
};

const roles = ["user", "admin", "superadmin"] as const;
type Role = (typeof roles)[number];

type X = keyof A;

const myfunc = <T>(key: keyof T) => {
	log(key);
};

// type Extend<T extends {}> = {
// 	stuff: `${}`
// }

// type X = Extend<A>;

export const testGetKeysAndValuesWithFuncs = () => {
	const arr = getArray();
	arr.forEach((obj) => {
		switch (obj.type) {
			case "A":
				{
					log("Object A");
					type KeysOfUnion<T> = T extends T ? keyof T : never;
					type K1 = KeysOfUnion<A>;
					type K2 = (keyof A)[number];
					const keys = getKeys(obj);
					keys.forEach((key) => {
						log(`\tkey: ${key}, value: ${getValue(obj, key)}`);
					});
				}
				break;
			case "B":
				{
					log("Object B");
					const keys = getKeys(obj);
					keys.forEach((key) => {
						log(`\tkey: ${key}, value: ${getValue(obj, key)}`);
					});
				}
				break;
			case "C":
				{
					log("Object C");
					const keys = getKeys(obj);
					keys.forEach((key) => {
						log(`\tkey: ${key}, value: ${getValue(obj, key)}`);
					});
				}
				break;
		}
		logln(40);
	});
};

export const testTypeNarrowOnKeyStuff = () => {
	const arr = getArray();
	arr.forEach((o) => {
		if (isObject(o as A, "isA")) {
			const a = o as A;
			log(`Object is A: thing: ${a.thing}`);
			log(o);
			logln(40);
		}
	});
};

export const testOneOfInterfaceStuff = () => {
	const arr = getArray();

	logh("Test Array");

	arr.forEach((o) => {
		if (isObject(o as A, "isA")) {
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
