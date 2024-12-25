import React, { useEffect, useRef, CSSProperties } from "react";
import { Html } from "react-konva-utils";

interface TextEditorProps {
  initialText: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
  fontFamily: string;
  textColor: string;
  highlightColor?: string;
  padding: number;
  textAlign: "left" | "right" | "center" | "justify";
  verticalAlign: "top" | "middle" | "bottom";
  fontStyle: string;
  onTextChange: (newText: string) => void;
  onFinishEditing: () => void;
}

export const TextEditor: React.FC<TextEditorProps> = ({
  initialText,
  x,
  y,
  width,
  height,
  fontSize,
  fontFamily,
  padding,
  textAlign,
  verticalAlign,
  fontStyle,
  textColor,
  highlightColor,
  onTextChange,
  onFinishEditing,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, []);

  const handleBlur = (): void => {
    onFinishEditing();
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    onTextChange(e.target.value);
  };

  const getContainerStyle = (): CSSProperties => {
    const baseStyle: CSSProperties = {
      position: "absolute",
      top: `${y}px`,
      left: `${x}px`,
      width: `${width}px`,
      height: `${height}px`,
      display: "flex",
      flexDirection: "column",
    };

    switch (verticalAlign) {
      case "top":
        return { ...baseStyle, justifyContent: "flex-start" };
      case "middle":
        return { ...baseStyle, justifyContent: "center" };
      case "bottom":
        return { ...baseStyle, justifyContent: "flex-end" };
      default:
        return baseStyle;
    }
  };

  const getTextAreaStyle = (): CSSProperties => ({
    width: "100%",
    height: "100%",
    fontSize: `${fontSize}px`,
    textAlign,
    fontFamily,
    color: textColor,
    backgroundColor: highlightColor || "transparent",
    overflow: "hidden",
    lineHeight: "1.2",
    outline: "none",
    fontWeight: fontStyle === "bold" ? "bold" : "normal",
    fontStyle: fontStyle === "italic" ? "italic" : "normal",
    border: "none",
    resize: "none",
    padding: `${padding}px`,
    display: "flex",
    alignItems: "center",
  });

  return (
    <Html>
      <div style={getContainerStyle()}>
        <textarea
          ref={textareaRef}
          style={getTextAreaStyle()}
          defaultValue={initialText}
          onBlur={handleBlur}
          onChange={handleChange}
        />
      </div>
    </Html>
  );
};

export default TextEditor;
