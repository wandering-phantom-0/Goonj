"use client";

import { useState, type CSSProperties, type MouseEvent } from "react";
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

// Evenly spaced around the heart, warm palette pulled from the site's own
// accent colors instead of Twitter's actual multi-colour sprite.
const PARTICLE_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];
const PARTICLE_COLORS = ["#ef4444", "#e2983c", "#f5c451"];

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
          <span key={burstKey} className="pointer-events-none absolute inset-0" aria-hidden="true">
            {PARTICLE_ANGLES.map((angle, i) => (
              <span
                key={angle}
                className="like-particle absolute left-1/2 top-1/2 h-[5px] w-[5px] rounded-full"
                style={
                  {
                    "--angle": `${angle}deg`,
                    backgroundColor: PARTICLE_COLORS[i % PARTICLE_COLORS.length],
                    animationDelay: `${i * 6}ms`,
                  } as CSSProperties
                }
              />
            ))}
          </span>
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
