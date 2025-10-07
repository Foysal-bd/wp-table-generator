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
import {MinusIcon, PlusIcon } from "../assets/icon";

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
	fontSize?: string;
	fontFamily?: string;
	fontWeight?: string;
	fontStyle?: string;
	textDecoration?: string;
	textTransform?: string;
	letterSpacing?: string;
	lineHeight?: string;
};

export default function Edit({
	attributes,
	setAttributes,
}: BlockEditProps<TableGeneratorAttributes>) {
	const {
		tableData = [[""]],
		headers = ["Header"],
		textAlign = "left",
		textColor = "#333333",
		headerTextColor = "#222222",
		backgroundColor = "#ffffff",
		headerBackgroundColor = "#f8fafc",
		striped = true,
		stripedBackgroundColor = "#f9fafb",
		borderColor = "#e5e7eb",
		borderWidth = 1,
		fontSize,
		fontFamily,
		fontWeight,
		fontStyle,
		textDecoration,
		textTransform,
		letterSpacing,
		lineHeight,
	} = attributes;

	// --- Column controls ---
	const addColumn = (colIndex: number) => {
		const newHeaders = [...headers];
		newHeaders.splice(colIndex + 1, 0, `Header`);

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
		fontSize,
		fontFamily,
		fontWeight,
		fontStyle,
		textDecoration,
		textTransform: textTransform as "none" | "capitalize" | "uppercase" | "lowercase" | undefined,
		letterSpacing,
		lineHeight,
	};

	const bodyCellBaseStyle: CSSProperties = {
		borderColor,
		borderWidth,
		borderStyle: "solid",
		textAlign,
		color: textColor,
		backgroundColor,
		fontSize,
		fontFamily,
		fontWeight,
		fontStyle,
		textDecoration,
		textTransform: textTransform as "none" | "capitalize" | "uppercase" | "lowercase" | undefined,
		letterSpacing,
		lineHeight,
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
				<PanelBody title={__("Typography", "table-generator")} initialOpen={false}>
					<BaseControl
						__nextHasNoMarginBottom
						label={__("Font Size", "table-generator")}
					>
						<input
							type="text"
							value={fontSize || ""}
							onChange={(e) => setAttributes({ fontSize: e.target.value })}
							placeholder="e.g., 16px, 1.2em"
							style={{ width: "100%" }}
						/>
					</BaseControl>

					<BaseControl
						__nextHasNoMarginBottom
						label={__("Font Family", "table-generator")}
					>
						<input
							type="text"
							value={fontFamily || ""}
							onChange={(e) => setAttributes({ fontFamily: e.target.value })}
							placeholder="e.g., Arial, sans-serif"
							style={{ width: "100%" }}
						/>
					</BaseControl>

					<SelectControl
						label={__("Font Weight", "table-generator")}
						value={fontWeight || ""}
						onChange={(value: string) => setAttributes({ fontWeight: value })}
						options={[
							{ label: __("Default", "table-generator"), value: "" },
							{ label: __("100 - Thin", "table-generator"), value: "100" },
							{ label: __("200 - Extra Light", "table-generator"), value: "200" },
							{ label: __("300 - Light", "table-generator"), value: "300" },
							{ label: __("400 - Normal", "table-generator"), value: "400" },
							{ label: __("500 - Medium", "table-generator"), value: "500" },
							{ label: __("600 - Semi Bold", "table-generator"), value: "600" },
							{ label: __("700 - Bold", "table-generator"), value: "700" },
							{ label: __("800 - Extra Bold", "table-generator"), value: "800" },
							{ label: __("900 - Black", "table-generator"), value: "900" },
						]}
					/>

					<SelectControl
						label={__("Font Style", "table-generator")}
						value={fontStyle || ""}
						onChange={(value: string) => setAttributes({ fontStyle: value })}
						options={[
							{ label: __("Default", "table-generator"), value: "" },
							{ label: __("Normal", "table-generator"), value: "normal" },
							{ label: __("Italic", "table-generator"), value: "italic" },
							{ label: __("Oblique", "table-generator"), value: "oblique" },
						]}
					/>

					<SelectControl
						label={__("Text Decoration", "table-generator")}
						value={textDecoration || ""}
						onChange={(value: string) => setAttributes({ textDecoration: value })}
						options={[
							{ label: __("Default", "table-generator"), value: "" },
							{ label: __("None", "table-generator"), value: "none" },
							{ label: __("Underline", "table-generator"), value: "underline" },
							{ label: __("Overline", "table-generator"), value: "overline" },
							{ label: __("Line Through", "table-generator"), value: "line-through" },
						]}
					/>

					<SelectControl
						label={__("Text Transform", "table-generator")}
						value={textTransform || ""}
						onChange={(value: string) => setAttributes({ textTransform: value })}
						options={[
							{ label: __("Default", "table-generator"), value: "" },
							{ label: __("None", "table-generator"), value: "none" },
							{ label: __("Uppercase", "table-generator"), value: "uppercase" },
							{ label: __("Lowercase", "table-generator"), value: "lowercase" },
							{ label: __("Capitalize", "table-generator"), value: "capitalize" },
						]}
					/>

					<BaseControl
						__nextHasNoMarginBottom
						label={__("Letter Spacing", "table-generator")}
					>
						<input
							type="text"
							value={letterSpacing || ""}
							onChange={(e) => setAttributes({ letterSpacing: e.target.value })}
							placeholder="e.g., 0.1em, 2px"
							style={{ width: "100%" }}
						/>
					</BaseControl>

					<BaseControl
						__nextHasNoMarginBottom
						label={__("Line Height", "table-generator")}
					>
						<input
							type="text"
							value={lineHeight || ""}
							onChange={(e) => setAttributes({ lineHeight: e.target.value })}
							placeholder="e.g., 1.5, 24px"
							style={{ width: "100%" }}
						/>
					</BaseControl>
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
											onClick={() => addColumn(colIndex - 1)}
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
										<div
											onClick={() => addColumn(colIndex)}
											className="wp-table-btn"
										>
											<PlusIcon />
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
