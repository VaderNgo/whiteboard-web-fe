import React, { useContext, useEffect, useRef, useState } from "react";
import Konva from "konva";
import { Group } from "react-konva";
import { BoardContext,Node } from "../../_contexts/boardContext";


type ShapeProps = {
    node: Node;
};

const Shape: React.FC<