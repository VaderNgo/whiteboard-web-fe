import React from "react";
import { EditorState } from "draft-js";
import "./RichEditor.css";
import { BsTypeBold, BsTypeItalic, BsTypeUnderline, BsCodeSlash, BsTypeStrikethrough } from "react-icons/bs";

type InlineStyleControlsProps = {
    editorState: EditorState;
    onToggle: (inlineState: string) => void;
};

type StyleButtonProps = {
    active: boolean;
    component: any;
    onToggle: (inlineState: string) => void;
    style: string;
};

const INLINE_STYLES = [
    { label: "B", style: "BOLD", component: <BsTypeBold /> },
    { label: "I", style: "ITALIC", component: <BsTypeItalic /> },
    { label: "U", style: "UNDERLINE", component: <BsTypeUnderline /> },
    { label: "M", style: "CODE", component: <BsCodeSlash /> },
    { label: "S", style: "STRIKETHROUGH", component: <BsTypeStrikethrough /> },
];

const StyleButton: React.FC<StyleButtonProps> = ({ active, component, onToggle, style }) => {
    const handleOnToggle = (e: any) => {
        e.preventDefault();
        onToggle(style);
    };

    let className = "RichEditor-styleButton";
    if (active) {
        className += " RichEditor-activeButton";
    }
    return (
        <span style={{ fontSize: 25 }} className={className} onMouseDown={handleOnToggle}>
            {component}
        </span>
    );
};

const InlineStyleControls: React.FC<InlineStyleControlsProps> = ({ editorState, onToggle }) => {
    const currentStyle = editorState.getCurrentInlineStyle();
    return (
        <>
            {INLINE_STYLES.map((type) => (
                <StyleButton
                    key={type.label}
                    active={currentStyle.has(type.style)}
                    component={type.component}
                    onToggle={onToggle}
                    style={type.style}
                />
            ))}
        </>
    );
};

export default InlineStyleControls;
