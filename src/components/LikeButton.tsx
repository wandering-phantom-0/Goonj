"use client";

import { useState, type MouseEvent } from "react";
import { Heart } from "lucide-react";
import { formatCount } from "@/lib/format";

interface LikeButtonProps {
  liked: boolean;
  count: number;
  onToggle: () => void;
  label: string;
  size?: number;
  className?: string;
  disabled?: boolean;
}

export default function LikeButton({
  liked,
  count,
  onToggle,
  label,
  size = 14,
  className = "",
  disabled = false,
}: LikeButtonProps) {
  const [burstKey, setBurstKey] = useState(0);

  function handleClick(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!liked) setBurstKey((k) => k + 1); // only burst when going TO liked
    onToggle();
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      aria-pressed={liked}
      aria-label={label}
      className={`inline-flex items-center gap-1 p-1 leading-none ${className}`}
    >
      <span className="relative inline-flex h-4 w-4 items-center justify-center">
        {burstKey > 0 && (
          <span key={burstKey} className="like-burst pointer-events-none absolute inset-0" aria-hidden="true" />
        )}
        <Heart
          key={liked ? `liked-${burstKey}` : "unliked"}
          size={size}
          aria-hidden="true"
          className={liked ? "like-pop fill-[#ef4444] text-[#ef4444]" : "text-current"}
        />
      </span>
      {formatCount(count)}
    </button>
  );
}
