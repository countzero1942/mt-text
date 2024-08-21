import { Box } from "@mantine/core";
import css from "./CssVars.module.css";
import clsx from "clsx";

export function CssVars() {
	return (
		<>
			<Box className={clsx(css.text, css.text1)}>
				Static Var
			</Box>
			<Box className={clsx(css.text, css.text2)}>
				rem Static Var
			</Box>
			<Box className={clsx(css.text, css.text3)}>
				Dynamic Var
			</Box>
			<Box className={clsx(css.text, css.text4)}>
				calc Dynamic Var
			</Box>
			<Box className={clsx(css.text, css.text5)}>
				rem Dynamic Var
			</Box>
			<Box className={clsx(css.text, css.text6)}>
				Dynamic calc with %
			</Box>
		</>
	);
}
