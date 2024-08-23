"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface ItemProps {
    id: string;
    name: string;
    imageUrl: string;
}

export const Item = ({ id, name, imageUrl }: ItemProps) => {
    return (
        <div className="aspect-square relative">
            <Image
                fill
                src={imageUrl}
                alt={name}
                onClick={() => {}}
                className={cn("rounded-md cursor-pointer opcity-75 hover:opacity-100 transition")}
            />
        </div>
    );
};
