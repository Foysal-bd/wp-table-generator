/**
 * WordPress dependencies
 */
import { useBlockProps, RichText } from "@wordpress/block-editor";
import type { CSSProperties } from "react";
import { BlockSaveProps } from "@wordpress/blocks";


type TableGeneratorAttributes = {
	headers: string[];
	tableData: string[][];
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

export default function save({
	attributes,
}: BlockSaveProps<TableGeneratorAttributes>) {
	const {
		headers = ["Column 1"],
		tableData = [[""]],
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
		<div {...useBlockProps.save({ className: "wp-table-generator" })}>
			<table className="wp-table">
				<thead>
					<tr>
						{headers.map((header, index) => (
							<th key={index} style={headerCellStyle}>
								<RichText.Content
									tagName="span"
									value={header}
									className="wp-table-header-content"
								/>
							</th>
						))}
					</tr>
				</thead>

				<tbody>
					{tableData.map((row, rowIndex) => (
						<tr key={rowIndex}>
							{row.map((cell, colIndex) => {
								const isStriped = striped && rowIndex % 2 === 1;
								const cellStyle = {
									...bodyCellBaseStyle,
									backgroundColor: isStriped ? stripedBackgroundColor : bodyCellBaseStyle.backgroundColor,
								} as CSSProperties;
								return (
									<td key={colIndex} style={cellStyle}>
										<RichText.Content
											tagName="div"
											value={cell}
											className="wp-table-cell-content"
										/>
									</td>
								);
							})}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
