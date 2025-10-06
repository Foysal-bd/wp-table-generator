/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";
import { useBlockProps, RichText } from "@wordpress/block-editor";
import { BlockEditProps } from "@wordpress/blocks";

/**
 * Internal dependencies
 */
import "./editor.scss";
import { GripIcon, MinusIcon, PlusIcon } from "../assets/icon";

type TableGeneratorAttributes = {
	tableData: string[][];
	headers: string[];
};

export default function Edit({
	attributes,
	setAttributes,
}: BlockEditProps<TableGeneratorAttributes>) {
	const { tableData = [[""]], headers = ["Column 1"] } = attributes;
	console.log(tableData);

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
									<RichText
										tagName="span"
										className="wp-table-header-input"
										value={header}
										onChange={(value: string) => updateHeader(colIndex, value)}
										placeholder={__("Header...", "table-generator")}
										allowedFormats={["core/bold", "core/italic", "core/link"]}
									/>
									<div className="wp-table-col-btns">
										<div
											onClick={() => addColumn(colIndex)}
											className="wp-table-btn"
										>
											<PlusIcon />
										</div>
										<div
											onClick={() => removeColumn(colIndex)}
											className="wp-table-btn"
										>
											<MinusIcon />
										</div>
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
										<RichText
											tagName="div"
											value={cell}
											onChange={(value: string) =>
												updateCell(rowIndex, colIndex, value)
											}
											placeholder={__("Enter text...", "table-generator")}
											className="wp-table-cell-input"
											allowedFormats={["core/bold", "core/italic", "core/link"]}
										/>
									</td>
								))}
								<td className="wp-table-row-btns">
									<div
										onClick={() => addRow(rowIndex)}
										className="wp-table-btn"
									>
										<PlusIcon />
									</div>
									<div
										onClick={() => removeRow(rowIndex)}
										className="wp-table-btn"
									>
										<MinusIcon />
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
