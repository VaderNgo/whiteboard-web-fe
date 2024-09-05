import React, { useContext, useEffect, useRef, useState } from "react";
import { Html } from "react-konva-utils";
import { EditorState, convertFromRaw, RawDraftContentState } from "draft-js";
import drafttohtml from "draftjs-to-html";
import { BoardContext, Node } from "../../_contexts/boardContext";
import useHistory from "../../_hooks/useHistory";
import useSocket from "../../_hooks/useSocket";
