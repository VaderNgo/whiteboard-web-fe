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
  padding: number;
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
      <textarea
        ref={textareaRef}
        style={{
          position: "absolute",
          top: `${y}px`,
          left: `${x}px`,
          width: `${width}px`,
          height: `${height}px`,
          fontSize: `${fontSize}px`,
          fontFamily,
          border: "none",
          padding: `${padding}px`,
          margin: "0px",
          overflow: "hidden",
          background: "none",
          outline: "none",
          resize: "none",
          lineHeight: "1.2",
          textAlign: "center",
        }}
        defaultValue={initialText}
        onBlur={handleBlur}
        onChange={handleChange}
      />
    </Html>
  );
};
