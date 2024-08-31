"use server";

import { readText } from "@/actions/utils/file";

interface FSError {
	message: string;
	errno: number;
	code: string;
	syscall: string;
	path: string;
}

export async function getTsCode(): Promise<string> {
	const res = await readText("./text/ts.txt");
	if (typeof res === "string") {
		return res;
	} else {
		return res.message;
	}
}
