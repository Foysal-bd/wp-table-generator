/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";
import { useBlockProps } from "@wordpress/block-editor";

/**
 * Internal dependencies
 */
import "./editor.scss";
import { BlockEditProps } from "@wordpress/blocks";

type TableGeneratorAttributes = {
	tableData: string[][];
};

export default function Edit({
	attributes,
	setAttributes,
}: BlockEditProps<TableGeneratorAttributes>) {
	const { tableData = [[""]] } = attributes;

	return (
		<div {...useBlockProps({ className: "wp-table-generator" })}>
			table generator
		</div>
	);
}
