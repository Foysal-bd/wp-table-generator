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

	// Add column to the right of the clicked cell
	const addColumn = (colIndex: number) => {
		const newData = tableData.map((row) => {
			const newRow = [...row];
			newRow.splice(colIndex + 1, 0, ""); // insert empty cell
			return newRow;
		});
		setAttributes({ tableData: newData });
	};

	// Remove entire column
	const removeColumn = (colIndex: number) => {
		if (tableData[0].length <= 1) return; // keep at least 1 col
		const newData = tableData.map((row) => {
			const newRow = [...row];
			newRow.splice(colIndex, 1);
			return newRow;
		});
		setAttributes({ tableData: newData });
	};

	// Add row below current row
	const addRow = (rowIndex: number) => {
		const newRow = tableData[0].map(() => ""); // create empty row with same cols
		const newData = [...tableData];
		newData.splice(rowIndex + 1, 0, newRow);
		setAttributes({ tableData: newData });
	};

	// Remove entire row
	const removeRow = (rowIndex: number) => {
		if (tableData.length <= 1) return; // keep at least 1 row
		const newData = [...tableData];
		newData.splice(rowIndex, 1);
		setAttributes({ tableData: newData });
	};

	// Update cell value
	const updateCell = (rowIndex: number, colIndex: number, value: string) => {
		const newData = tableData.map((row, r) =>
			row.map((cell, c) => (r === rowIndex && c === colIndex ? value : cell))
		);
		setAttributes({ tableData: newData });
	};

	return (
		<div {...useBlockProps()}>
			<table>
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
									<div className="wp-table-controls">
										<Button
											isSmall
											onClick={() => addColumn(colIndex)}
										>
											+ Col
										</Button>
										<Button
											isSmall
											onClick={() => removeColumn(colIndex)}
										>
											- Col
										</Button>
										<Button
											isSmall
											onClick={() => addRow(rowIndex)}
										>
											+ Row
										</Button>
										<Button
											isSmall
											onClick={() => removeRow(rowIndex)}
										>
											- Row
										</Button>
									</div>
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
