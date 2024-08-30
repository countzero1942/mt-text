"use server";

const log = (...data: any) => console.log(...data);
const logh = (header: string) => {
	log("");
	const line = "-".repeat(header.length);
	log(line);
	log(header);
	log(line);
};

export async function printObject() {
	await new Promise((resolve) => setTimeout(resolve, 1));

	const obj = {
		a: "string",
		b: 42,
		c: {
			ca: "sub string",
			cb: 99,
		},
	};

	logh("Print Object");
	log(obj);
}

export async function getValuesFromObject() {
	await new Promise((resolve) => setTimeout(resolve, 1));

	const obj = {
		a: "string",
		b: 42,
		c: {
			ca: "sub string",
			cb: 99,
		},
	};

	logh("Get Values from Object");
	log(obj);
	log("");

	let { a, b, c } = obj;
	log(`a: ${a}, b: ${b}: c:`);
	log(c);
}

export async function buildObject() {
	await new Promise((resolve) => setTimeout(resolve, 1));

	interface DynamicObject {
		[key: string]: any;
	}

	var obj: DynamicObject = {};

	obj.a = 42;
	obj.b = "a string";
	obj.c = {} as DynamicObject;
	obj.c.ca = 77;
	obj.c.cb = "foobar";
	obj["kebab-case"] = "kebab";

	logh("Build Object");

	log(obj);

	logh("How undefined keys are handled");
	log(
		`Undefined keys: obj.u = ${obj.u}, obj[u2] = ${obj["u2"]} `
	);
}

export async function objectToJson() {
	await new Promise((resolve) => setTimeout(resolve, 1));

	interface DynamicObject {
		[key: string]: any;
	}

	var obj: DynamicObject = {};

	obj.a = 42;
	obj.b = "a string";
	obj.c = {} as DynamicObject;
	obj.c.ca = 77;
	obj.c.cb = "foobar";
	obj["kebab-case"] = "kebab";

	const json = JSON.stringify(obj, null, 2);

	logh("Object to Json");
	log(json);
}
