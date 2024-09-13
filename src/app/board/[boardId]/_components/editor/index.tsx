import React, { useRef, useEffect } from "react";
import { Editor as DraftEditor, convertToRaw, RichUtils, ContentBlock, EditorState, Modifier } from "draft-js";
import { History, StageConfig, Node } from "../../_contexts/boardContext";
import InlineStyleControls from "./inlineStyleControls";
import BlockStyleControls from "./blockStyleControls";
import ColorControls from "./colorControls";
import FontControls from "./fontControls";
import "draft-js/dist/Draft.css";
import { UpdateBoardTypes } from "../../_contexts/socketContext";
import { Card } from "@material-tailwind/react";

type EditorProps = {
    node: Node;
    setNodes: React.Dispatch<React.SetStateAction<Map<string, Node>>>;
    onToggleEdit: () => void;
    editorState: EditorState;
    setEditorState: React.Dispatch<React.SetStateAction<EditorState>>;
    stageConfig: StageConfig;
    addToHistory: ({ type, diff, nodes }: History) => void;
    saveUpdatedNodes: (nodesToUpdate: Node[]) => Promise<void>;
    updateBoard: (data: Node[], type: UpdateBoardTypes) => void;
};

const colorStyleMap = {
    "color-black": {
        color: "black",
    },
    "color-white": {
        color: "white",
    },
    "color-red": {
        color: "red",
    },
    "color-orange": {
        color: "orange",
    },
    "color-yellow": {
        color: "yellow",
    },
    "color-green": {
        color: "green",
    },
    "color-blue": {
        color: "blue",
    },
    "color-indigo": {
        color: "indigo",
    },
    "color-violet": {
        color: "violet",
    },
};

const fontStyleMap = {
    "fontsize-18": {
        fontSize: 18,
    },
    "fontsize-24": {
        fontSize: 24,
    },
    "fontsize-30": {
        fontSize: 30,
    },
    "fontsize-36": {
        fontSize: 36,
    },
    "fontsize-48": {
        fontSize: 48,
    },
    "fontsize-56": {
        fontSize: 56,
    },
    "fontsize-70": {
        fontSize: 70,
    },
};

const styleMap = {
    CODE: {
        backgroundColor: "rgba(0, 0, 0, 0.05)",
        fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
        fontSize: 16,
        padding: 2,
    },
    STRIKETHROUGH: {
        textDecoration: "line-through",
    },
};

const getBlockStyle = (contentBlock: ContentBlock) => {
    const type = contentBlock.getType();
    switch (type) {
        case "blockquote":
            return "RichEditor-blockquote";
        case "code":
            return "code";
        default:
            return "";
    }
};

const Editor: React.FC<EditorProps> = ({
    editorState,
    setEditorState,
    node,
    setNodes,
    onToggleEdit,
    stageConfig,
    addToHistory,
    saveUpdatedNodes,
    updateBoard,
}) => {
    const editorRef = useRef<DraftEditor>(null);
    useEffect(() => {
        editorRef.current?.focus();
    }, []);

    const toggleColor = (toggleColor: string) => {
        const selection = editorState.getSelection();
        const nextContentState = Object.keys(colorStyleMap).reduce(
            (contentState, color) => Modifier.removeInlineStyle(contentState, selection, color),
            editorState.getCurrentContent()
        );
        let nextEditorState = EditorState.push(editorState, nextContentState, "change-inline-style");
        const currentStyle = editorState.getCurrentInlineStyle();
        if (selection.isCollapsed()) {
            nextEditorState = currentStyle.reduce(
                (state, color) => RichUtils.toggleInlineStyle(state as EditorState, color as string),
                nextEditorState
            );
        }
        if (!currentStyle.has(toggleColor)) {
            nextEditorState = RichUtils.toggleInlineStyle(nextEditorState, toggleColor);
        }

        setEditorState(nextEditorState);
    };

    const toggleFontSize = (toggleFontSize: string) => {
        const selection = editorState.getSelection();
        const nextContentState = Object.keys(fontStyleMap).reduce(
            (contentState, fontSize) => Modifier.removeInlineStyle(contentState, selection, fontSize),
            editorState.getCurrentContent()
        );

        let nextEditorState = EditorState.push(editorState, nextContentState, "change-inline-style");

        const currentState = editorState.getCurrentInlineStyle();

        if (selection.isCollapsed()) {
            nextEditorState = currentState.reduce(
                (state, fontSize) => RichUtils.toggleInlineStyle(state as EditorState, fontSize as string),
                nextEditorState
            );
        }

        if (!currentState.has(toggleFontSize)) {
            nextEditorState = RichUtils.toggleInlineStyle(nextEditorState, toggleFontSize);
        }

        setEditorState(nextEditorState);
    };

    const toggleInlineStyle = (inlineStyle: string) => {
        setEditorState(RichUtils.toggleInlineStyle(editorState, inlineStyle));
    };

    const toggleBlockType = (blockType: string) => {
        setEditorState(RichUtils.toggleBlockType(editorState, blockType));
    };

    const handleOnBlur = () => {
        onToggleEdit();
        const content = JSON.stringify(convertToRaw(editorState.getCurrentContent()));
        setNodes((prevState) => {
            const currNode = prevState.get(node.id);
            if (!currNode) return prevState;
            const prevText = prevState.get(node.id)?.text;
            if (prevText && prevText !== content) {
                const updatedNode = {
                    ...currNode,
                    text: content,
                };
                prevState.set(node.id, updatedNode);
                saveUpdatedNodes([updatedNode]).catch((err) => console.log(err));
                addToHistory({
                    type: "update",
                    diff: null,
                    nodes: prevState,
                });
                updateBoard([updatedNode], "update");
            }
            return new Map(prevState);
        });
    };

    const getTop = () => -80 - (50 * 1) / stageConfig.stageScale;

    const getLeft = () => {
        if (node.shapeType === "Rect") {
            return node.width / 2 - 225;
        }
        if (node.shapeType === "Ellipse") {
            return node.width / 2 - 225;
        }
        return node.width / 2 - 225;
    };

    return (
        <>
            <Card
                className="bg-blue-grey-900 z-1 px-2 py-1"
                style={{
                    width: 450,
                    position: "absolute",
                    top: getTop(),
                    left: getLeft(),
                    transform: `scale(${1 / stageConfig.stageScale})`,
                }}
                placeholder="Add Text"
                onPointerEnterCapture={() => {}}
                onPointerLeaveCapture={() => {}}
            >
                <div className="flex-wrap">
                    <ColorControls editorState={editorState} onToggle={toggleColor} colorStyleMap={colorStyleMap} />
                    <FontControls editorState={editorState} onToggle={toggleFontSize} />
                </div>
                <div className="flex-wrap">
                    <InlineStyleControls editorState={editorState} onToggle={toggleInlineStyle} />
                    <BlockStyleControls editorState={editorState} onToggle={toggleBlockType} />
                </div>
            </Card>

            <div className="p-2 relative text-center">
                <DraftEditor
                    ref={editorRef}
                    blockStyleFn={getBlockStyle}
                    customStyleMap={{ ...styleMap, ...colorStyleMap, ...fontStyleMap }}
                    editorState={editorState}
                    onChange={setEditorState}
                    placeholder="Add Text"
                    onBlur={handleOnBlur}
                    textAlignment="center"
                />
            </div>
        </>
    );
};

export default Editor;
