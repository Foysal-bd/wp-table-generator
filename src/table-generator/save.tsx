/**
 * WordPress dependencies
 */
import { useBlockProps } from "@wordpress/block-editor";
import { BlockSaveProps } from "@wordpress/blocks";

type TableGeneratorAttributes = {
	headers: string[];
	tableData: string[][];
};

export default function save({
	attributes,
}: BlockSaveProps<TableGeneratorAttributes>) {
	const { headers = ["Column 1"], tableData = [[""]] } = attributes;

	return (
		<div {...useBlockProps.save({ className: "wp-table-generator" })}>
			<table className="wp-table">
				<thead>
					<tr>
						{headers.map((header, index) => (
							<th key={index}>{header}</th>
						))}
					</tr>
				</thead>
				<tbody>
					{tableData.map((row, rowIndex) => (
						<tr key={rowIndex}>
							{row.map((cell, colIndex) => (
								<td key={colIndex}>{cell}</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
