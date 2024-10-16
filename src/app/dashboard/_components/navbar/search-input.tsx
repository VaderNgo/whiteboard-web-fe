"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type SearchInputProps = {
  className?: string;
};

export const SearchInput = ({ className }: SearchInputProps) => {
  const router = useRouter();
  const [value, setValue] = useState("");

  // const debouncedValue = useDebounceValue(value, 500);

  // const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
  //     setValue(e.target.value);
  // };

  // useEffect(() => {
  //     const url = qs.stringifyUrl(
  //         {
  //             url: "/dashboard",
  //             query: { search: debouncedValue[0] },
  //         },
  //         { skipEmptyString: true, skipNull: true }
  //     );
  //     router.push(url);
  // }, [debouncedValue, router]);

  return (
    <div className={cn("w-full relative", className)}>
      <Search className="absolute top-1/2 left-3 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
      <Input
        className="w-full max-w-[516px] pl-9"
        placeholder="Search boards"
        value={value}
        onChange={() => {}}
      />
    </div>
  );
};
