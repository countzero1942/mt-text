"use client";

import {
	ColorPicker,
	ColorPickerProps,
	ColorSwatch,
	Group,
} from "@mantine/core";
import { on } from "events";
import React, { useState } from "react";

const InlineColorPicker: React.FC<ColorPickerProps> = (
	props
) => {
	let { value, onChange, ...rest } = props;

	const [color, setColor] = useState(
		"hsla(0, 100%, 50%, 1)"
	);

	const handleOnChange = (color: string) => {
		setColor(color);
		if (onChange) {
			onChange(color);
		}
		value = color;
	};

	return (
		<>
			<Group>
				<ColorSwatch color={color} />
				<p>{color}</p>
			</Group>
			<ColorPicker
				value={color}
				onChange={handleOnChange}
				{...rest}
			/>
		</>
	);
};
export default InlineColorPicker;
