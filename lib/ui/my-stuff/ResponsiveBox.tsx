import { Box } from "@mantine/core";
import css from "./ResponsiveBox.module.css";
import clsx from "clsx";

export function ResponsiveBox() {
	return (
		<>
			<Box
				className={css.border}
				bg={{
					base: "blue.7",
					xs: "red.7",
					sm: "green.7",
					md: "orange.7",
					lg: "grape.7",
					xl: "cyan.7",
				}}
				bd={{
					base: "2px solid blue.3",
					xs: "2px solid red.3",
					sm: "3px solid green.3",
					md: "3px solid orange.3",
					lg: "4px solid grape.3",
					xl: "5px solid cyan.3",
				}}
				w={{
					base: 200,
					xs: 250,
					sm: 300,
					md: 400,
					lg: 500,
					xl: 600,
				}}
				c="white"
				ta="center"
				mx="auto"
				my={20}
				py={{
					base: 10,
					xs: 15,
					sm: 20,
					md: 25,
					lg: 30,
					xl: 40,
				}}
				fz={{
					base: ".75rem",
					xs: "1rem",
					sm: "1.5rem",
					md: "2rem",
					lg: "2.5rem",
					xl: "3rem",
				}}
			>
				Responsive Style Props
			</Box>
			<Box className={css.box}>
				Responsive Style Props
			</Box>
		</>
	);
}
