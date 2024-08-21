import React from "react";
import css from "./GridA.module.css";

interface FixedGridAddedProps {
	cols: number;
	width: number;
	height: number;
	borderSize: number;
}

type FixedGridProps = React.DetailedHTMLProps<
	React.HTMLAttributes<HTMLDivElement>,
	HTMLDivElement
> &
	FixedGridAddedProps;

const FixedGrid: React.FC<FixedGridProps> = (props) => {
	const { cols, width, height, borderSize, ...rest } =
		props;
	const cssProps: React.CSSProperties = {
		gridTemplateColumns: `repeat(${cols}, 1fr)`,
		width,
		height,
	};
	return (
		<div
			style={
				{
					"--border-size": `${borderSize}px`,
					...cssProps,
				} as React.CSSProperties
			}
			className={css.grid}
			{...rest}
		/>
	);
};

export default function GridA() {
	const MyFixedGrid = () => (
		<FixedGrid
			cols={5}
			width={500}
			height={500}
			borderSize={10}
		>
			{[...Array(25)].map((_, i) => {
				const n = i + 1;
				return <div key={n}>{n}</div>;
			})}
		</FixedGrid>
	);

	return (
		<article>
			<h1>Grid A Stuff</h1>
			<h2>Fixed Grid</h2>
			<MyFixedGrid />
		</article>
	);
}
