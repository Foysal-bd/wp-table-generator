/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";
import {
	useBlockProps,
	RichText,
	InspectorControls,
	ColorPalette,
} from "@wordpress/block-editor";
import {
	PanelBody,
	SelectControl,
	ToggleControl,
	RangeControl,
	BaseControl,
} from "@wordpress/components";
import type { CSSProperties } from "react";
import { BlockEditProps } from "@wordpress/blocks";

/**
 * Internal dependencies
 */
import "./editor.scss";
import { GripIcon, MinusIcon, PlusIcon } from "../assets/icon";

type TableGeneratorAttributes = {
	tableData: string[][];
	headers: string[];
	textAlign?: "left" | "center" | "right";
	textColor?: string;
	headerTextColor?: string;
	backgroundColor?: string;
	headerBackgroundColor?: string;
	striped?: boolean;
	stripedBackgroundColor?: string;
	borderColor?: string;
	borderWidth?: number;
};

export default function Edit({
	attributes,
	setAttributes,
}: BlockEditProps<TableGeneratorAttributes>) {
	const {
		tableData = [[""]],
		headers = ["Column 1"],
		textAlign = "left",
		textColor = "#333333",
		headerTextColor = "#222222",
		backgroundColor = "#ffffff",
		headerBackgroundColor = "#f8fafc",
		striped = true,
		stripedBackgroundColor = "#f9fafb",
		borderColor = "#e5e7eb",
		borderWidth = 1,
	} = attributes;

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

	const headerCellStyle: CSSProperties = {
		borderColor,
		borderWidth,
		borderStyle: "solid",
		textAlign,
		color: headerTextColor,
		backgroundColor: headerBackgroundColor,
	};

	const bodyCellBaseStyle: CSSProperties = {
		borderColor,
		borderWidth,
		borderStyle: "solid",
		textAlign,
		color: textColor,
		backgroundColor,
	};

	return (
		<div {...useBlockProps({ className: "wp-table-generator" })}>
			<InspectorControls>
				<PanelBody title={__("Table Styles", "table-generator")} initialOpen>
					<SelectControl
						label={__("Text alignment", "table-generator")}
						value={textAlign}
						onChange={(value: string) =>
							setAttributes({
								textAlign: (value as "left" | "center" | "right") || "left",
							})
						}
						options={[
							{ label: __("Left", "table-generator"), value: "left" },
							{ label: __("Center", "table-generator"), value: "center" },
							{ label: __("Right", "table-generator"), value: "right" },
						]}
					/>

					<BaseControl
						__nextHasNoMarginBottom
						label={__("Body text color", "table-generator")}
					>
						<ColorPalette
							value={textColor}
							onChange={(color?: string) =>
								setAttributes({ textColor: color || "#333333" })
							}
						/>
					</BaseControl>

					<BaseControl
						__nextHasNoMarginBottom
						label={__("Body background", "table-generator")}
					>
						<ColorPalette
							value={backgroundColor}
							onChange={(color?: string) =>
								setAttributes({ backgroundColor: color || "#ffffff" })
							}
						/>
					</BaseControl>

					<BaseControl
						__nextHasNoMarginBottom
						label={__("Header text color", "table-generator")}
					>
						<ColorPalette
							value={headerTextColor}
							onChange={(color?: string) =>
								setAttributes({ headerTextColor: color || "#222222" })
							}
						/>
					</BaseControl>

					<BaseControl
						__nextHasNoMarginBottom
						label={__("Header background", "table-generator")}
					>
						<ColorPalette
							value={headerBackgroundColor}
							onChange={(color?: string) =>
								setAttributes({ headerBackgroundColor: color || "#f8fafc" })
							}
						/>
					</BaseControl>

					<ToggleControl
						label={__("Striped rows", "table-generator")}
						checked={striped}
						onChange={(value: boolean) => setAttributes({ striped: value })}
					/>
					{striped && (
						<>
							<p>{__("Striped row background", "table-generator")}</p>
							<ColorPalette
								value={stripedBackgroundColor}
								onChange={(color?: string) =>
									setAttributes({ stripedBackgroundColor: color || "#f9fafb" })
								}
							/>
						</>
					)}

					<BaseControl
						__nextHasNoMarginBottom
						label={__("Border color", "table-generator")}
					>
						<ColorPalette
							value={borderColor}
							onChange={(color?: string) =>
								setAttributes({ borderColor: color || "#e5e7eb" })
							}
						/>
					</BaseControl>

					<RangeControl
						label={__("Border width (px)", "table-generator")}
						value={borderWidth}
						min={0}
						max={8}
						onChange={(value?: number) =>
							setAttributes({ borderWidth: value ?? 0 })
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div className="wp-table-wrapper">
				<table className="wp-table">
					<thead>
						<tr>
							{headers.map((header, colIndex) => (
								<th key={`header-${colIndex}`} style={headerCellStyle}>
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
								{row.map((cell, colIndex) => {
									const isStriped = striped && rowIndex % 2 === 1;
									const cellStyle = {
										...bodyCellBaseStyle,
										backgroundColor: isStriped
											? stripedBackgroundColor
											: bodyCellBaseStyle.backgroundColor,
									} as CSSProperties;
									return (
										<td key={`${rowIndex}-${colIndex}`} style={cellStyle}>
											<RichText
												tagName="div"
												value={cell}
												onChange={(value: string) =>
													updateCell(rowIndex, colIndex, value)
												}
												placeholder={__("Enter text...", "table-generator")}
												className="wp-table-cell-input"
												allowedFormats={[
													"core/bold",
													"core/italic",
													"core/link",
												]}
											/>
										</td>
									);
								})}
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
