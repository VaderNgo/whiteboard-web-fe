"use client";

import { useRouter } from "next/navigation";

export default function HeaderBar() {
  const router = useRouter();
  return (
    <nav className="md:px-16 h-16 w-full font-mono bg-white/80 z-[2] top-0 sticky p-5 flex flex-row gap-5 backdrop-blur-sm items-center pointer-events-none">
      <h1 className="font-bold md:text-2xl mr-auto pointer-events-none select-none">Teamscribe</h1>
      <button
        className="font-semibold text-sm md:text-base pointer-events-auto"
        onClick={() => router.push("/plans")}
      >
        Pricing
      </button>
      <button
        className="font-semibold text-sm md:text-base pointer-events-auto"
        onClick={() => router.push("/login")}
      >
        Login
      </button>
    </nav>
  );
}
