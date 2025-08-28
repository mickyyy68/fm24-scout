"use client";

import * as React from "react";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";
import { Upload, FileText } from "lucide-react";
import { Progress } from "@/components/ui/progress";

type AcceptMap = Record<string, string[]>;

export type FileUploadProps = {
  variant?: "default" | "dashed" | "ghost";
  className?: string;
  accept?: AcceptMap;
  multiple?: boolean;
  disabled?: boolean;
  onDrop?: (files: File[]) => void;
  label?: string;
  description?: string;
  processing?: boolean;
  progress?: number;
};

const VARIANT_STYLES: Record<NonNullable<FileUploadProps["variant"]>, string> = {
  default:
    "border border-border bg-card hover:bg-muted/30",
  dashed:
    "border-2 border-dashed border-border bg-transparent hover:bg-muted/20",
  ghost:
    "border border-transparent bg-transparent hover:bg-muted/20",
};

export function FileUpload({
  variant = "default",
  className,
  accept,
  multiple = false,
  disabled = false,
  onDrop,
  label = "Drop file here or click to browse",
  description = "Supports HTML and CSV files (max 20,000 players)",
  processing = false,
  progress = 0,
}: FileUploadProps) {
  const handleDrop = React.useCallback(
    (files: File[]) => {
      if (disabled) return;
      onDrop?.(files);
    },
    [onDrop, disabled]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept,
    maxFiles: multiple ? 0 : 1,
    multiple,
    disabled: disabled || processing,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "relative cursor-pointer rounded-ele transition-colors p-10 text-center",
        VARIANT_STYLES[variant],
        (disabled || processing) && "pointer-events-none opacity-60",
        isDragActive && "outline outline-2 outline-[hsl(var(--sidebar-ring))] border-sidebar-border",
        className
      )}
    >
      <input {...getInputProps()} />

      {processing ? (
        <div className="space-y-4">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground animate-pulse" />
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Processing file...</p>
            <Progress value={progress} className="w-full max-w-xs mx-auto" />
          </div>
        </div>
      ) : (
        <>
          <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-4 text-lg font-medium">{isDragActive ? "Drop the file here" : label}</p>
          {description ? (
            <p className="mt-2 text-sm text-muted-foreground">{description}</p>
          ) : null}
        </>
      )}
    </div>
  );
}

export default FileUpload;
