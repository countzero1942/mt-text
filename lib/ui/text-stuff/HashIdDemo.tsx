"use client";

import React from "react";
import Hashids from "hashids";
import { NumberFormatter, Table } from "@mantine/core";

export default function HashIdDemo() {
	const hashids = new Hashids();
	const numbers = [
		0, 1, 5, 10, 33, 87, 100, 234, 789, 1000, 4321, 8732,
		10_000, 22_233, 55_987, 100_000, 1_000_000,
		10_000_000, 100_000_000, 1_000_000_000, 1e12,
	];
	const rows = numbers.map((v, i) => {
		const encoded = hashids.encode(v);
		const decoded = hashids.decode(encoded)[0];
		return (
			<Table.Tr key={v}>
				<Table.Td>{i}</Table.Td>
				<Table.Td c="blue.8">
					<NumberFormatter
						value={v}
						thousandSeparator
					/>
				</Table.Td>
				<Table.Td c="green.7" ff="monospace">
					{encoded}
				</Table.Td>
				<Table.Td>{encoded.length}</Table.Td>
				<Table.Td c="blue.8">
					<NumberFormatter
						value={Number(decoded)}
						thousandSeparator
					/>
				</Table.Td>
			</Table.Tr>
		);
	});

	return (
		<article>
			<h2>Hash Id Demo</h2>
			<Table fz="1.25rem">
				<Table.Thead c="white">
					<Table.Tr>
						<Table.Td>Index</Table.Td>
						<Table.Td>Number</Table.Td>
						<Table.Td>Encoded</Table.Td>
						<Table.Td>Length</Table.Td>
						<Table.Td>Decoded</Table.Td>
					</Table.Tr>
				</Table.Thead>
				<Table.Tbody>{rows}</Table.Tbody>
			</Table>
		</article>
	);
}
