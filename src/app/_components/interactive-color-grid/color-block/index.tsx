import { cn } from "@/lib/utils";

const bgColorArray = [
  "hover:bg-[#E0BBE4]",
  "hover:bg-[#957DAD]",
  "hover:bg-[#D291BC]",
  "hover:bg-[#FEC8D8]",
  "hover:bg-[#FFDFD3]",
];

export default function ColorBlock() {
  const randomColor = bgColorArray[Math.floor(Math.random() * bgColorArray.length)];
  return (
    <div
      className={cn(
        `aspect-square w-full bg-transparent transition-colors hover:duration-0 duration-1000 border border-[#00000011]`,
        randomColor
      )}
    />
  );
}
