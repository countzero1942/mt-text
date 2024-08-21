"use client";

import { Box, Button, darken, Grid } from "@mantine/core";
import css from "./GridDemo.module.css";
import { GraphHelpers } from "next/dist/compiled/webpack/webpack";

export default function GridDemo() {
	return (
		<article>
			<h1>Grid Demo</h1>
			<h2>Simple Grid</h2>
			<Grid
				bg={darken("var(--mantine-color-grape-9)", 0.7)}
				h={200}
				bd="2 solid red"
				gutter={10}
				p={20}
			>
				<Grid.Col
					bg="grape.7"
					ta="center"
					mx="auto"
					span={4}
				>
					<Box>1</Box>
				</Grid.Col>
				<Grid.Col bg="grape.7" ta="center" span={4}>
					<Box>2</Box>
				</Grid.Col>
				<Grid.Col bg="grape.7" ta="center" span={4}>
					<Box>3</Box>
				</Grid.Col>
			</Grid>
		</article>
	);
}
