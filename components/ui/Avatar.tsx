"use client";

import { cn } from "@/lib/utils/cn";
import { useState } from "react";

interface AvatarProps {
  src?: string | null;
  alt?: string;
  fallback?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-base",
} as const;

function getInitials(name?: string): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function Avatar({
  src,
  alt = "",
  fallback,
  size = "md",
  className,
}: AvatarProps) {
  const [imgError, setImgError] = useState(false);

  const showImage = src && !imgError;

  return (
    <span
      className={cn(
        "relative inline-flex items-center justify-center overflow-hidden rounded-full bg-[var(--color-muted)]/20 font-medium text-[var(--color-text)]",
        sizeMap[size],
        className
      )}
      aria-label={alt || fallback || "Avatar"}
    >
      {showImage ? (
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <span aria-hidden="true">{getInitials(fallback || alt)}</span>
      )}
    </span>
  );
}
