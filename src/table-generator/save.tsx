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
	} = attributes;

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
