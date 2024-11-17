"use client";
import { cn } from "@/lib/utils";
import { Upload } from "lucide-react";
import { ChangeEvent, useState } from "react";

type ImagePreviewerProps = {
  className?: string;
  setImageUri: (uri: string) => void;
  imageUri: string;
};

export function ImagePreviewer({ setImageUri, className, imageUri }: ImagePreviewerProps) {
  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImageUri(result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      className={cn(
        "aspect-square bg-slate-100 w-full rounded-md cursor-pointer relative group",
        className
      )}
    >
      {imageUri && (
        <>
          <img src={imageUri} alt="preview" className="w-full h-full object-cover rounded-md" />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity rounded-md"></div>
        </>
      )}

      {!imageUri && (
        <div className="flex items-center justify-center h-full w-full">
          <Upload
            size={32}
            className="text-black opacity-50 group-hover:opacity-100 transition-opacity"
          />
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="absolute inset-0 opacity-0 cursor-pointer"
      />
    </div>
  );
}
