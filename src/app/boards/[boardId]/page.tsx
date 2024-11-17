"use client";
import { useGetBoard } from "@/lib/services/queries";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Canvas from "./_components/canvas";
import { BoardContextProvider } from "./_contexts/boardContext";
import { SocketContextProvider } from "./_contexts/socketContext";
import useSocket from "./_hooks/useSocket";
import { useQueryClient } from "@tanstack/react-query";

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

const ErrorState = ({ error }: { error: Error }) => (
  <div className="min-h-screen flex flex-col items-center justify-center gap-4">
    <h1 className="text-2xl font-bold text-red-500">Unable to load board</h1>
    <p className="text-gray-600">{error.message}</p>
    <button
      onClick={() => window.location.reload()}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
    >
      Try Again
    </button>
  </div>
);

const BoardPage = () => {
  const router = useRouter();
  const params = useParams<{ boardId: string }>();
  console.log("boardId", params.boardId);
  const { data: board, isLoading, isError, error } = useGetBoard(params.boardId);

  const queryClient = useQueryClient();

  useEffect(() => {
    return () => {
      queryClient.invalidateQueries({ queryKey: ["board", params.boardId] });
    };
  }, [queryClient, params.boardId]);

  useEffect(() => {
    if (isError) {
      const timeout = setTimeout(() => {
        router.push("/dashboard");
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [isError, router]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <ErrorState error={error as Error} />;
  }

  if (!board) {
    router.push("/dashboard");
    return <LoadingSpinner />;
  }

  return (
    <BoardContextProvider pathsProp={board.paths} shapesProp={board.shapes}>
      <SocketContextProvider>
        <Canvas />
      </SocketContextProvider>
    </BoardContextProvider>
  );
};

export default BoardPage;
