import { BoardContextProvider } from "./_contexts/boardContext";
import { SocketContext, SocketContextProvider } from "./_contexts/socketContext";
import Canvas from "./_components/canvas";
const BoardPage = () => {
    return (
        <BoardContextProvider>
            <SocketContextProvider>
                <Canvas />
            </SocketContextProvider>
        </BoardContextProvider>
    );
};

export default BoardPage;
