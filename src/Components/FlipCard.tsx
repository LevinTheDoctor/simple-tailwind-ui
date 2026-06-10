import { useEffect, useState, type ReactNode } from "react";

type FlipCardSize = "sm" | "md" | "lg" | "full";
type FlipCardTrigger = "click" | "hover";
type FlipCardDirection = "horizontal" | "vertical";

type FlipCardProps = {
  readonly front: ReactNode;
  readonly back: ReactNode;
  readonly trigger?: FlipCardTrigger;
  readonly direction?: FlipCardDirection;
  readonly flipped?: boolean;
  readonly onFlip?: (flipped: boolean) => void;
  readonly frontClassName?: string;
  readonly backClassName?: string;
  readonly size?: FlipCardSize;
  readonly fullWidth?: boolean;
  readonly className?: string;
};

const sizeClasses: Record<FlipCardSize, string> = {
  sm:   "max-w-sm h-36",
  md:   "max-w-md h-48",
  lg:   "max-w-lg h-64",
  full: "w-full h-48",
};

const faceBaseClasses =
  "absolute inset-0 flex items-center justify-center p-5 rounded-2xl overflow-hidden " +
  "shadow-lg shadow-zinc-900/10 transition-colors duration-200";

export function FlipCard({
  front,
  back,
  trigger = "click",
  direction = "horizontal",
  flipped,
  onFlip,
  frontClassName = "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100",
  backClassName = "bg-gradient-to-br from-indigo-500 to-violet-600 text-white",
  size = "md",
  fullWidth = false,
  className = "",
}: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(flipped ?? false);

  useEffect(() => {
    if (flipped !== undefined) setIsFlipped(flipped);
  }, [flipped]);

  const setFlip = (next: boolean) => {
    setIsFlipped(next);
    onFlip?.(next);
  };

  const rotation = direction === "horizontal" ? "rotateY(180deg)" : "rotateX(180deg)";

  return (
    <div
      className={[
        "relative select-none",
        trigger === "click" ? "cursor-pointer" : "",
        fullWidth ? "w-full h-48" : `w-full ${sizeClasses[size]}`,
        className,
      ].join(" ")}
      style={{ perspective: "1000px" }}
      onClick={trigger === "click" ? () => setFlip(!isFlipped) : undefined}
      onMouseEnter={trigger === "hover" ? () => setFlip(true) : undefined}
      onMouseLeave={trigger === "hover" ? () => setFlip(false) : undefined}
      role={trigger === "click" ? "button" : undefined}
      aria-pressed={trigger === "click" ? isFlipped : undefined}
    >
      <div
        className="relative w-full h-full transition-transform duration-500"
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? rotation : "none",
        }}
      >
        <div
          className={`${faceBaseClasses} ${frontClassName}`}
          style={{ backfaceVisibility: "hidden" }}
        >
          {front}
        </div>
        <div
          className={`${faceBaseClasses} ${backClassName}`}
          style={{ backfaceVisibility: "hidden", transform: rotation }}
        >
          {back}
        </div>
      </div>
    </div>
  );
}
