"use client";
import { ColorPicker, Slider } from "@mantine/core";
import css from "./StyleMaker.module.css";
import { useThrottledState } from "@mantine/hooks";
import React, { useState } from "react";
import InlineColorPicker from "./InlineColorPicker";
import DropDownColorPicker from "./DropDownColorPicker";

export default function StyleMaker() {
	const [h1FontSize, setH1FontSize] = useState(3);
	const [h1Color, setH1Color] = useState("#00FF00");
	return (
		<article className={css.grid}>
			<header>
				<h2>Style Maker</h2>
			</header>
			<main>
				<h1
					style={
						{
							"--mantine-h1-font-size": `${h1FontSize}rem`,
							"--h1-color": h1Color,
						} as React.CSSProperties
					}
					className={css.h1}
				>
					Title Heading Number 1
				</h1>
				<h2 className={css.h2}>
					This is title heading 2
				</h2>
				<p>
					We always thank God, the Father of our Lord
					Jesus Christ, when we pray for you, because
					we have heard of your faith in Christ Jesus
					and of the love you have for all God’s
					people— the faith and love that spring from
					the hope stored up for you in heaven and
					about which you have already heard in the
					true message of the gospel that has come to
					you. In the same way, the gospel is bearing
					fruit and growing throughout the whole
					world—just as it has been doing among you
					since the day you heard it and truly
					understood God’s grace. You learned it from
					Epaphras, our dear fellow servant, who is a
					faithful minister of Christ on our behalf,
					and who also told us of your love in the
					Spirit.
				</p>
			</main>
			<nav>
				<p>Value: {h1FontSize}</p>
				<Slider
					defaultValue={3}
					min={1}
					max={5}
					step={0.125}
					label={(value) => value.toFixed(3)}
					onChange={(event) => setH1FontSize(event)}
				/>
				<DropDownColorPicker
					aria-label="H1 heading label"
					hueLabel="Hue"
					value={h1Color}
					format="rgba"
					onChange={setH1Color}
				/>
			</nav>
		</article>
	);
}
