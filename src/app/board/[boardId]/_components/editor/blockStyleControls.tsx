import React from "react";
import { EditorState } from "draft-js";
import "./richEditor.css";
import { BsTypeH1, BsTypeH2, BsTypeH3, BsTypeH4, BsBlockquoteLeft } from "react-icons/bs";
import { AiOutlineOrderedList, AiOutlineUnorderedList } from "react-icons/ai";
import { BiCodeBlock } from "react-icons/bi";

type BlockStyleControlsProps = {
    editorState: EditorState;
    onToggle: (blockType: string) => void;
};

type StyleButtonProps = {
    active: boolean;
    component: any;
    onToggle: (inlineState: string) => void;
    style: string;
};

const BLOCK_TYPES = [
    { label: "H1", style: "header-one", component: <BsTypeH1 /> },
    { label: "H2", style: "header-two", component: <BsTypeH2 /> },
    { label: "H3", style: "header-three", component: <BsTypeH3 /> },
    { label: "H4", style: "header-four", component: <BsTypeH4 /> },
    { label: "UL", style: "unordered-list-item", component: <AiOutlineUnorderedList /> },
    { label: "OL", style: "ordered-list-item", component: <AiOutlineOrderedList /> },
    { label: "Blockquote", style: "blockquote", component: <BsBlockquoteLeft /> },
    { label: "Code Block", style: "code-block", component: <BiCodeBlock /> },
];

const StyleButton: React.FC<StyleButtonProps> = ({ active, component, onToggle, style }) => {
    const handleOnToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        onToggle(style);
    };
    let className = "RichEditor-styleButton";
    if (active) {
        className += " RichEditor-activeButton";
    }

    return (
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions
        <span style={{ fontSize: 25 }} className={className} onMouseDown={handleOnToggle}>
            {component}
        </span>
    );
};

const BlockStyleControls: React.FC<BlockStyleControlsProps> = ({ editorState, onToggle }) => {
    const selection = editorState.getSelection();
    const blockType = editorState.getCurrentContent().getBlockForKey(selection.getStartKey()).getType();

    return (
        <>
            {BLOCK_TYPES.map((type) => (
                <StyleButton
                    key={type.label}
                    active={type.style === blockType}
                    component={type.component}
                    onToggle={onToggle}
                    style={type.style}
                />
            ))}
        </>
    );
};

export default BlockStyleControls;
