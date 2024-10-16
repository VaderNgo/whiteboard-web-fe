"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { NotificationView } from "./_components/views/notification/notification-view";
import { useEffect } from "react";
import { socket } from "@/lib/websocket";

const DashboardPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const view = searchParams.get("view");

  useEffect(() => {
    // Set default to inbox view
    if (!view) {
      router.push(`${pathname}?view=inbox`);
    }

    // socket.connect();
    // if (socket.connected) {
    //   console.log("Socket connected");
    // }
  }, [view]);

  if (view === "inbox") {
    return <NotificationView />;
  }

  return (
    <div className="flex flex-col w-full h-full items-center justify-center opacity-50">
      <Image src="/image/book.jpg" alt="Dashboard" width={200} height={200} />
      <div className="font-mono mt-5">There is nothing here yet.</div>
    </div>
  );
};

export default DashboardPage;
