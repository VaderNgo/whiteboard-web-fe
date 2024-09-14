"use client";

import { usePathname, useSearchParams } from "next/navigation";
import Image from "next/image";

const DashboardPage = () => {
  const searchParams = useSearchParams();
  const view = searchParams.get("view");

  return (
    <div className="flex flex-col w-full h-full items-center justify-center opacity-50">
      <Image src="/image/book.jpg" alt="Dashboard" width={200} height={200} />
      <div className="font-mono mt-5">There is nothing here yet.</div>
    </div>
  );
};

export default DashboardPage;
