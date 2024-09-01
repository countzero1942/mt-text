import { spacesToTabs } from "@/utils/string";

namespace JS {
	export interface JSStringifyArgs {
		tabSize?: number;
		toTabs?: boolean;
	}

	export const stringify = (
		obj: any,
		{ tabSize, toTabs }: JSStringifyArgs = {}
	) => {
		const defTabSize = tabSize ?? 4;
		const jsObjStr = JSON.stringify(
			obj,
			null,
			defTabSize
		).replace(/\"([\w_]+?)\"\:/gm, "$1: ");

		if (toTabs) {
			return spacesToTabs(jsObjStr, defTabSize);
		} else {
			return jsObjStr;
		}
	};
}

export default JS;
