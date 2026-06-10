import { Children, useEffect, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type CarouselSize = "sm" | "md" | "lg" | "full";

type CarouselProps = {
  readonly children?: ReactNode;
  readonly images?: readonly string[];
  readonly autoPlay?: number;
  readonly loop?: boolean;
  readonly showArrows?: boolean;
  readonly showDots?: boolean;
  readonly startIndex?: number;
  readonly onChange?: (index: number) => void;
  readonly dotColor?: string;
  readonly size?: CarouselSize;
  readonly fullWidth?: boolean;
  readonly className?: string;
};

const sizeClasses: Record<CarouselSize, string> = {
  sm:   "max-w-sm h-44",
  md:   "max-w-md h-56",
  lg:   "max-w-lg h-72",
  full: "w-full h-64",
};

export function Carousel({
  children,
  images,
  autoPlay = 0,
  loop = true,
  showArrows = true,
  showDots = true,
  startIndex = 0,
  onChange,
  dotColor = "bg-indigo-500",
  size = "md",
  fullWidth = false,
  className = "",
}: CarouselProps) {
  const slides: ReactNode[] = images
    ? images.map((src, i) => (
        <img key={i} src={src} alt={`Slide ${i + 1}`} className="w-full h-full object-cover" draggable={false} />
      ))
    : Children.toArray(children);

  const count = slides.length;
  const [index, setIndex] = useState(Math.min(startIndex, Math.max(count - 1, 0)));

  const goTo = (next: number) => {
    const clamped = loop
      ? (next + count) % count
      : Math.max(0, Math.min(next, count - 1));
    setIndex(clamped);
    onChange?.(clamped);
  };

  useEffect(() => {
    if (autoPlay <= 0 || count <= 1) return;
    const id = setInterval(() => {
      setIndex(prev => {
        const next = loop ? (prev + 1) % count : Math.min(prev + 1, count - 1);
        onChange?.(next);
        return next;
      });
    }, autoPlay);
    return () => clearInterval(id);
  }, [autoPlay, count, loop, onChange]);

  if (count === 0) return null;

  const canPrev = loop || index > 0;
  const canNext = loop || index < count - 1;

  const arrowClasses = [
    "absolute top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-8 h-8 rounded-full",
    "bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm text-zinc-700 dark:text-zinc-200",
    "shadow-md shadow-zinc-900/20 hover:bg-white dark:hover:bg-zinc-800",
    "transition-colors duration-200 cursor-pointer",
    "disabled:opacity-0 disabled:cursor-default",
  ].join(" ");

  return (
    <div
      className={[
        "relative group overflow-hidden rounded-2xl",
        "ring-1 ring-zinc-200 dark:ring-zinc-800 shadow-lg shadow-zinc-900/10",
        fullWidth ? "w-full h-64" : sizeClasses[size],
        className,
      ].join(" ")}
    >
      <div
        className="flex h-full transition-transform duration-300 ease-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {slides.map((slide, i) => (
          <div key={i} className="w-full h-full shrink-0">
            {slide}
          </div>
        ))}
      </div>

      {showArrows && count > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous slide"
            disabled={!canPrev}
            onClick={() => goTo(index - 1)}
            className={`${arrowClasses} left-2.5`}
          >
            <ChevronLeft className="w-4.5 h-4.5" />
          </button>
          <button
            type="button"
            aria-label="Next slide"
            disabled={!canNext}
            onClick={() => goTo(index + 1)}
            className={`${arrowClasses} right-2.5`}
          >
            <ChevronRight className="w-4.5 h-4.5" />
          </button>
        </>
      )}

      {showDots && count > 1 && (
        <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 px-2 py-1.5 rounded-full bg-zinc-900/30 backdrop-blur-sm">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => goTo(i)}
              className={[
                "rounded-full transition-all duration-200 cursor-pointer",
                i === index ? `w-4 h-1.5 ${dotColor}` : "w-1.5 h-1.5 bg-white/70 hover:bg-white",
              ].join(" ")}
            />
          ))}
        </div>
      )}
    </div>
  );
}
