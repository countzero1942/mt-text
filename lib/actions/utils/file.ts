"use server";

import { readFile } from "node:fs/promises";
import { log, logh, logln } from "@/actions/utils/log";

export interface FSError {
	message: string;
	errno: number;
	code: string;
	syscall: string;
	path: string;
}

export async function readText(
	path: string
): Promise<string | FSError> {
	try {
		const txt = await readFile(path, {
			encoding: "utf8",
		});
		return txt;
	} catch (err) {
		// @ts-ignore
		const e: FSError = { message: err.message, ...err };
		return e;
	}
}

export async function demoReadFileError(): Promise<FSError> {
	try {
		const txt = await readFile("./text/tss.txt", {
			encoding: "utf8",
		});
		return {} as FSError;
	} catch (err) {
		// @ts-ignore
		const e: FSError = { message: err.message, ...err };

		logh("Demo readFile Error");
		log(err);
		logln();
		log("error message: ", e.message);
		log("error number:", e.errno);
		log("error code:", e.code);
		log("error path:", e.path);
		log("error system call:", e.syscall);

		return e;
	}
}

export async function demoReadTextError(): Promise<FSError> {
	const result = await readText("./text/tss.txt");
	logh("Demo Read Text Error");
	if (typeof result === "string") {
		log(result);
		return {} as FSError;
	} else {
		log(result);
		return result;
	}
}

export async function demoReadTextSuccess(): Promise<string> {
	const result = await readText("./text/ts.txt");
	logh("Demo Read Text Success");
	if (typeof result === "string") {
		log(result);
		return "Demo Read Text Success";
	} else {
		log(result);
		return "Demo Read Text Failure";
	}
}
