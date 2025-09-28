/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";
import {
	useBlockProps,
	BlockEditProps,
} from "@wordpress/block-editor";
import { Button } from "@wordpress/components";

/**
 * Internal dependencies
 */
import "./editor.scss";

type TableGeneratorAttributes = {
	tableData: string[][];
};

export default function Edit({
	attributes,
	setAttributes,
}: BlockEditProps<TableGeneratorAttributes>) {
	const { tableData = [[""]]} = attributes;

	// --- Column controls ---
	const addColumn = (colIndex: number) => {
		const newData = tableData.map((row) => {
			const newRow = [...row];
			newRow.splice(colIndex + 1, 0, "");
			return newRow;
		});
		setAttributes({ tableData: newData });
	};

	const removeColumn = (colIndex: number) => {
		if (tableData[0].length <= 1) return;
		const newData = tableData.map((row) => {
			const newRow = [...row];
			newRow.splice(colIndex, 1);
			return newRow;
		});
		setAttributes({ tableData: newData });
	};

	// --- Row controls ---
	const addRow = (rowIndex: number) => {
		const newRow = tableData[0].map(() => "");
		const newData = [...tableData];
		newData.splice(rowIndex + 1, 0, newRow);
		setAttributes({ tableData: newData });
	};

	const removeRow = (rowIndex: number) => {
		if (tableData.length <= 1) return;
		const newData = [...tableData];
		newData.splice(rowIndex, 1);
		setAttributes({ tableData: newData });
	};

	// --- Cell editing ---
	const updateCell = (rowIndex: number, colIndex: number, value: string) => {
		const newData = tableData.map((row, r) =>
			row.map((cell, c) => (r === rowIndex && c === colIndex ? value : cell))
		);
		setAttributes({ tableData: newData });
	};

	return (
		<div
			{...useBlockProps({ className: "wp-table-generator" })}
		>
			<table>
				<thead>
					<tr>
						{tableData[0].map((_, colIndex) => (
							<th key={`col-${colIndex}`}>
								<div className="wp-table-col-controls">
									<Button
										isSmall
										variant="secondary"
										onClick={() => addColumn(colIndex)}
									>
										+ Col
									</Button>
									<Button
										isSmall
										variant="secondary"
										onClick={() => removeColumn(colIndex)}
									>
										- Col
									</Button>
								</div>
							</th>
						))}
						<th className="wp-table-empty-header"></th>
					</tr>
				</thead>

				<tbody>
					{tableData.map((row, rowIndex) => (
						<tr key={rowIndex}>
							{row.map((cell, colIndex) => (
								<td key={colIndex}>
									<input
										type="text"
										value={cell}
										onChange={(e) =>
											updateCell(rowIndex, colIndex, e.target.value)
										}
									/>
								</td>
							))}
							<td className="wp-table-row-controls">
								<Button
									isSmall
									variant="secondary"
									onClick={() => addRow(rowIndex)}
								>
									+ Row
								</Button>
								<Button
									isSmall
									variant="secondary"
									onClick={() => removeRow(rowIndex)}
								>
									- Row
								</Button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
