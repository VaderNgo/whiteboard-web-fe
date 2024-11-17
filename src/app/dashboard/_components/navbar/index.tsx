"use client";

import { SearchInput } from "./search-input";
import { UserAvatar } from "./user-avatar";

export const Navbar = () => {
  return (
    <div className="flex items-center gap-x-4 p-5 ">
      <div className="hidden lg:flex lg:flex-1">
        <SearchInput className="mr-auto" />
        <UserAvatar />
      </div>
    </div>
  );
};
