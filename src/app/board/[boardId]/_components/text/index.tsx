// import React, { useContext } from "react";
// import { BoardContext, Node } from "../../_contexts/boardContext";
// import { Text } from "react-konva";

// type TextProps = {
//   node: Node;
//   isEditing: boolean;
//   scaleX: number;
//   scaleY: number;
//   groupWidth: number;
//   onToggleEdit: () => void;
// };

// const TextNode: React.FC<TextProps> = ({
//   node,
//   isEditing,
//   scaleX,
//   scaleY,
//   groupWidth,
//   onToggleEdit,
// }) => {
//   const { stageRef, layerRef } = useContext(BoardContext);
//   const getXPosition = () => {
//     return (groupWidth - node.width) / 2; // Center alignment
//   };

//   return (
//     <>
//       <Text
//         text="I'm text node"
//         fontSize={30}
//         fontFamily={node.text.fontFamily}
//         onClick={onToggleEdit}
//         onDblClick={onToggleEdit}
//         width={node.width}
//         height={node.height}
//         align="center"
//         padding={10}
//         strokeScaleEnabled={false}
//         scaleX={1 / scaleX}
//         scaleY={1 / scaleY}
//       />
//     </>
//   );
// };

// export default TextNode;

// // const Text: React.FC<TextProps> = ({ node, isEditing, onToggleEdit }) => {
// //     const contentState = convertFromRaw(JSON.parse(node.text) as RawDraftContentState);
// //     const [editorState, setEditorState] = useState(() => EditorState.createWithContent(contentState));
// //     const { stageConfig, stageRef, setNodes } = useContext(BoardContext);
// //     const { updateBoard } = useSocket();
// //     const textRef = useRef<HTMLDivElement | null>(null);
// //     const htmlString = drafttohtml(JSON.parse(node.text) as RawDraftContentState)
// //         .replaceAll(/<p><\/p>/g, "<br>")
// //         .replaceAll(/<h1><\/h1>/g, "<br>")
// //         .replaceAll(/<h2><\/h2>/g, "<br>")
// //         .replaceAll(/<h3><\/h3>/g, "<br>");
// //     const { addToHistory } = useHistory();

// //     useEffect(() => {
// //         const updatedContentState = convertFromRaw(JSON.parse(node.text) as RawDraftContentState);
// //         setEditorState(EditorState.createWithContent(updatedContentState));
// //     }, [node.text]);

// //     useEffect(() => {
// //         if (stageRef && stageRef.current && !isEditing) {
// //             (stageRef.current.content.children[0] as HTMLElement).style.pointerEvents = "none";
// //             if (textRef) {
// //                 const child = textRef.current?.parentElement as HTMLDivElement;
// //                 const parent = stageRef.current.container();
// //                 parent.removeChild(child);
// //                 stageRef.current?.content.prepend(child);
// //             }
// //         }
// //     }, [stageRef, isEditing]);

// //     const getTextWidth = () => {
// //         if (node.shapeType === "Ellipse") {
// //             return (node.width / 2) * Math.sqrt(2);
// //         }
// //         if (node.shapeType === "Polygon") {
// //             return (node.width / 2) * Math.sqrt(2);
// //         }
// //         return node.width;
// //     };

// //     const getTextHeight = () => {
// //         if (node.shapeType === "Ellipse") {
// //             return (node.height / 2) * Math.sqrt(2);
// //         }
// //         if (node.shapeType === "Polygon") {
// //             return (node.width / 2) * Math.sqrt(2);
// //         }
// //         return node.height;
// //     };

// //     const getX = () => {
// //         if (node.shapeType === "Ellipse") {
// //             return -getTextWidth() / 2;
// //         }
// //         if (node.shapeType === "Polygon") {
// //             return -getTextWidth() / 2;
// //         }
// //         return 0;
// //     };

// //     const getY = () => {
// //         if (node.shapeType === "Ellipse") {
// //             return -getTextHeight() / 2;
// //         }
// //         if (node.shapeType === "Polygon") {
// //             return -getTextHeight() / 2;
// //         }
// //         return 0;
// //     };

// //     return (
// //         <>
// //             {isEditing && (
// //                 <Html
// //                     groupProps={{
// //                         x: getX(),
// //                         y: getY(),
// //                         width: getTextWidth(),
// //                         height: getTextHeight(),
// //                     }}
// //                     divProps={{ style: { opacity: 1 } }}
// //                 >
// //                     <div className="rounded-md sm:text-lg" style={{ width: getTextWidth(), height: getTextHeight() }}>
// //                         {/* components inside <Html /> may not have access to upper context (so you have to bridge contexts manually) */}
// //                         <Editor
// //                             editorState={editorState}
// //                             setEditorState={setEditorState}
// //                             node={node}
// //                             setNodes={setNodes}
// //                             onToggleEdit={onToggleEdit}
// //                             stageConfig={stageConfig}
// //                             addToHistory={addToHistory}
// //                             saveUpdatedNodes={() => Promise.resolve()} // adjust this later for saving process
// //                             updateBoard={updateBoard}
// //                         />
// //                     </div>
// //                 </Html>
// //             )}
// //             {!isEditing && (
// //                 <Html
// //                     groupProps={{
// //                         x: getX(),
// //                         y: getY(),
// //                         width: getTextWidth(),
// //                         height: getTextHeight(),
// //                     }}
// //                     divProps={{ style: { opacity: 1 } }}
// //                 >
// //                     <div
// //                         ref={textRef}
// //                         className="text"
// //                         style={{
// //                             width: getTextWidth(),
// //                             height: getTextHeight(),
// //                             overflow: "scroll",
// //                         }}
// //                         onDoubleClick={onToggleEdit}

// //                         aria-atomic="true"
// //                     >
// //                         <div
// //                             className="p-2 rounded-md sm:text-lg prose prose-stone text-center"
// //                             dangerouslySetInnerHTML={{ __html: htmlString }}
// //                             style={{ width: getTextWidth(), height: getTextHeight() }}
// //                         ></div>
// //                     </div>
// //                 </Html>
// //             )}
// //         </>
// //     );
// // };

// // export default Text;
