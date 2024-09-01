export const log = (...data: any) => console.log(...data);
export const logh = (header: string) => {
	log();
	const line = "-".repeat(header.length);
	log(line);
	log(header);
	log(line);
};
export const logln = (length: number = 20) =>
	console.log("-".repeat(length));
