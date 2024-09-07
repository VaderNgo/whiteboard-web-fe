"use client";

import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

type SignupButtonProps = {
  className?: string;
};

export default function SignupButton({ className }: SignupButtonProps) {
  const router = useRouter();
  const onClick = () => {
    router.push("/signup");
  };
  return (
    <button
      className={cn("bg-blue-500 text-white px-5 py-2 rounded-md mt-5", className)}
      onClick={onClick}
    >
      Sign up for free
    </button>
  );
}
