import { logh, logln } from "@/utils/log";
import { log } from "console";
import { UnwrapPromise } from "next/dist/lib/coalesced-function";

type JobRole = "Manager" | "Team Leader" | "Secretary" | "Coder";

type Shapes =
	| {
			kind: "circle";
			radius: number;
	  }
	| {
			kind: "square";
			length: number;
	  }
	| {
			kind: "rectangle";
			length: number;
			width: number;
	  };

type LessShapes = Exclude<Shapes, { kind: "square" }>;

const shapes: Shapes[] = [
	{ kind: "circle", radius: 10 },
	{ kind: "rectangle", length: 20, width: 10 },
	{ kind: "square", length: 30 },
	{ kind: "circle", radius: 25 },
];

export const testLogAreaOfShapes = () => {
	logh("Log Union Shapes and Calc Area");
	shapes.forEach((shape) => {
		const { kind } = shape;
		if (kind === "circle") {
			const { radius } = shape;
			const area = Math.PI * shape.radius ** 2;
			log(
				`Circle: radius: ${radius}, area: ${area.toPrecision(6)}`
			);
		} else if (kind === "square") {
			const { length } = shape;
			const area = length ** 2;
			log(`Square: length: ${length}, area: ${area}`);
		} else if (kind === "rectangle") {
			const { length, width } = shape;
			const area = length * width;
			log(
				`Rectangle: length: ${length}, ` +
					`width: ${width}, area: ${area}`
			);
		}
		logln(40);
	});
};
