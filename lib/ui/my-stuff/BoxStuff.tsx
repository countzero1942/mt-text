import { Box, Title } from "@mantine/core";
import css from "./BoxStuff.module.css";
import "./BoxStuff.css";

export function BoxStuff() {
	return (
		<>
			<Box p={20}>
				<Title order={2}>Hello World</Title>
				<h2>Hello World</h2>
				<Title order={3}>Hello World</Title>
				<Box className={css.border}>
					This is some text.
				</Box>
				<Box>This is some text.</Box>
			</Box>
		</>
	);
}
