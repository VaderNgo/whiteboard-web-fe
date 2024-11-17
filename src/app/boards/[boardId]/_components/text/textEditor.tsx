import { useEffect, useRef } from "react";
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
  padding: number;
  alignContent: string;
  textAlign: "left" | "right" | "center" | "justify";
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
  alignContent,
  textAlign,
  fontStyle,
  textColor,
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

  const handleBlur = () => {
    onFinishEditing();
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onTextChange(e.target.value);
  };

  return (
    <Html>
      <div
        style={{
          position: "absolute",
          top: `${y}px`,
          left: `${x}px`,
          width: `${width}px`,
          height: `${height}px`,
          display: "flex",
        }}
      >
        <textarea
          ref={textareaRef}
          contentEditable={true}
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            fontSize: `${fontSize}px`,
            alignContent: alignContent,
            textAlign: textAlign as "left" | "right" | "center" | "justify",
            fontFamily,
            color: textColor,
            overflow: "hidden",
            background: "none",
            lineHeight: "1.2",
            outline: "none",
            fontWeight: fontStyle === "bold" ? "bold" : "normal",
            fontStyle: fontStyle,
          }}
          defaultValue={initialText}
          onBlur={handleBlur}
          onChange={handleChange}
        />
      </div>
    </Html>
  );
};
