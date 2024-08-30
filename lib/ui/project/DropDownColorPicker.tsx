"use client";

import {
	Button,
	ColorPicker,
	ColorPickerProps,
	ColorSwatch,
	Group,
	Popover,
} from "@mantine/core";
import { on } from "events";
import React, { useState } from "react";

const DropDownColorPicker: React.FC<ColorPickerProps> = (
	props
) => {
	let { value, onChange, ...rest } = props;

	const initValue = value ?? "hsla(0, 100%, 50%, 1)";

	const [color, setColor] = useState(initValue);

	const handleOnChange = (color: string) => {
		setColor(color);
		if (onChange) {
			onChange(color);
		}
		value = color;
	};

	if (onChange) {
		onChange(color);
	}

	return (
		<>
			<Group>
				<Popover width={"auto"} position="bottom-start">
					<Popover.Target>
						<Button px={5}>
							<ColorSwatch
								style={{
									border: "1px solid black",
								}}
								color={color}
							/>
						</Button>
					</Popover.Target>
					<Popover.Dropdown>
						<ColorPicker
							value={color}
							onChange={handleOnChange}
							{...rest}
						/>
					</Popover.Dropdown>
				</Popover>
				<p>{color}</p>
			</Group>
		</>
	);
};
export default DropDownColorPicker;
