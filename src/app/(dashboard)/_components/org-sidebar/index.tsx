"use client";

import Link from "next/link";
import Image from "next/image";
import { Poppins } from "next/font/google";

const font = Poppins({
    subsets: ["latin"],
    weight: ["600"],
});

export const OrgSidebar = () => {
    return (
        <div className="hidden lg:flex flex-col space-y-6 w-[206px] pl-5 pt-5 bg-red-300">
            <Link href="/">
                <div className="flex items-center gap-x-2">
                    <Image
                        alt="Logo"
                        height={60}
                        width={150}
                        src="https://mirostatic.com/app/static/baa3028a5c006a0a.svg"
                    />
                </div>
            </Link>
        </div>
    );
};
