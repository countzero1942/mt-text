"use server";

import * as fs from "fs";

export async function getTsCode(): Promise<string> {
	try {
		const txt = await fs.promises.readFile(
			"./text/ts.txt",
			"utf8"
		);
		return txt;
	} catch (err) {
		console.log(err);
		return "error";
	}
}
