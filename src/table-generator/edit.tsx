/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";
import { useBlockProps } from "@wordpress/block-editor";
import { Button } from "@wordpress/components";

/**
 * Internal dependencies
 */
import "./editor.scss";
import { BlockEditProps } from "@wordpress/blocks";

type TableGeneratorAttributes = {
	tableData: string[][];
	headers: string[];
};

export default function Edit({
	attributes,
	setAttributes,
}: BlockEditProps<TableGeneratorAttributes>) {
	const { tableData = [[""]], headers = ["Column 1"] } = attributes;

	// --- Column controls ---
	const addColumn = (colIndex: number) => {
		const newHeaders = [...headers];
		newHeaders.splice(colIndex + 1, 0, `Column ${headers.length + 1}`);

		const newData = tableData.map((row) => {
			const newRow = [...row];
			newRow.splice(colIndex + 1, 0, "");
			return newRow;
		});

		setAttributes({ tableData: newData, headers: newHeaders });
	};

	const removeColumn = (colIndex: number) => {
		if (headers.length <= 1) return;
		const newHeaders = [...headers];
		newHeaders.splice(colIndex, 1);

		const newData = tableData.map((row) => {
			const newRow = [...row];
			newRow.splice(colIndex, 1);
			return newRow;
		});

		setAttributes({ tableData: newData, headers: newHeaders });
	};

	// --- Row controls ---
	const addRow = (rowIndex: number) => {
		const newRow = headers.map(() => "");
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
			row.map((cell, c) => (r === rowIndex && c === colIndex ? value : cell)),
		);
		setAttributes({ tableData: newData });
	};

	// --- Header editing ---
	const updateHeader = (colIndex: number, value: string) => {
		const newHeaders = [...headers];
		newHeaders[colIndex] = value;
		setAttributes({ headers: newHeaders });
	};

	return (
		<div {...useBlockProps({ className: "wp-table-generator" })}>
			<div className="wp-table-wrapper">
				<table className="wp-table">
					<thead>
						<tr>
							{headers.map((header, colIndex) => (
								<th key={`header-${colIndex}`}>
									<input
										className="wp-table-header-input"
										value={header}
										onChange={(e) => updateHeader(colIndex, e.target.value)}
									/>
									<div className="wp-table-col-btns">
										<Button
											label="Add Column"
											onClick={() => addColumn(colIndex)}
											className="wp-table-btn"
										>
											+
										</Button>
										<Button
											icon="minus"
											label="Remove Column"
											onClick={() => removeColumn(colIndex)}
											className="wp-table-btn"
										>
											-
										</Button>
									</div>
								</th>
							))}
							<th className="wp-table-empty-th"></th>
						</tr>
					</thead>

					<tbody>
						{tableData.map((row, rowIndex) => (
							<tr key={rowIndex}>
								{row.map((cell, colIndex) => (
									<td key={`${rowIndex}-${colIndex}`}>
										<input
											type="text"
											value={cell}
											onChange={(e) =>
												updateCell(rowIndex, colIndex, e.target.value)
											}
											className="wp-table-cell-input"
										/>
									</td>
								))}
								<td className="wp-table-row-btns">
									<Button
										label="Add Row"
										onClick={() => addRow(rowIndex)}
										className="wp-table-btn"
									>
										+
									</Button>
									<Button
										label="Remove Row"
										onClick={() => removeRow(rowIndex)}
										className="wp-table-btn"
									>
										-
									</Button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
