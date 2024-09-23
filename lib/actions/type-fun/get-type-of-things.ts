import { logh, logln } from "@/utils/log";
import { log } from "console";

const badChooseThing = <T extends string>(things: {
	choices: T[];
	choice: T;
}) => {
	return things;
};

const chooseThing = <T extends string>(things: {
	choices: T[];
	choice: NoInfer<T>;
}) => {
	return things;
};

const fruit1 = badChooseThing({
	choices: ["apple", "orange", "kiwi"],
	choice: "banana",
});

const fruit2 = chooseThing({
	choices: ["apple", "orange", "kiwi"],
	choice: "apple",
});

export const testNoInfer = () => {
	log("Bad choose thing:");
	log(fruit1);
	log("Good choose thing:");
	log(fruit2);
};
