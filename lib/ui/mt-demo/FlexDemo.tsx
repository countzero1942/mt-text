import { Flex, Button, darken, Grid } from "@mantine/core";
import { GraphHelpers } from "next/dist/compiled/webpack/webpack";

export default function FlexDemo() {
	return (
		<article>
			<h1>Flex Demo</h1>
			<h2>Responsive Flex</h2>
			<Flex
				direction={{ base: "column", xs: "row" }}
				gap={{
					base: "sm",
					xs: "md",
					md: "xl",
				}}
				justify={{ xs: "center" }}
				my={20}
				py={20}
				px={10}
				bg={darken("var(--mantine-color-grape-9)", 0.7)}
				bd={"2px solid grape.3"}
			>
				<Button>Button 1</Button>
				<Button>Button 2</Button>
				<Button>Button 3</Button>
			</Flex>
			<Grid></Grid>
		</article>
	);
}
