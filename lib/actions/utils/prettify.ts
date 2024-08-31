export const toJavascriptString = (
	obj: any,
	tabSize: number = 4,
	toTabs: boolean = false
) => {
	const jsObj = JSON.stringify(obj, null, tabSize).replace(
		/\"([\w_]+?)\"\:/gm,
		"$1: "
	);
	if (toTabs) {
		const pattern = `^( {${tabSize}})+`;
		const rx = new RegExp(pattern, "gm");
		const ns = jsObj.replace(rx, function (match) {
			{
				return "\t".repeat(match.length / tabSize);
			}
		});
		return ns;
	} else {
		return jsObj;
	}
};
