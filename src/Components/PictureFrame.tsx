type PictureFrameSize = "sm" | "md" | "lg" | "full";
type PictureFrameVariant = "default" | "subtle" | "strong";

type PictureFrameProps = {
  readonly src: string;
  readonly alt: string;
  readonly caption?: string;
  readonly size?: PictureFrameSize;
  readonly variant?: PictureFrameVariant;
  readonly fullWidth?: boolean;
  readonly className?: string;
};

const sizeClasses: Record<PictureFrameSize, string> = {
  sm:   "max-w-xs",
  md:   "max-w-sm",
  lg:   "max-w-md",
  full: "w-full",
};

const variantClasses: Record<PictureFrameVariant, string> = {
  default: "p-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-lg shadow-zinc-900/10",
  subtle:  "p-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 shadow-sm",
  strong:  "p-3.5 bg-white dark:bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-600 shadow-xl shadow-zinc-900/15",
};

export function PictureFrame({
  src,
  alt,
  caption,
  size = "md",
  variant = "default",
  fullWidth = false,
  className = "",
}: PictureFrameProps) {
  const frameClasses = [
    "inline-flex flex-col rounded-2xl transition-colors duration-200",
    fullWidth ? "w-full" : sizeClasses[size],
    variantClasses[variant],
    className,
  ].join(" ");

  return (
    <figure className={frameClasses}>
      <img
        src={src}
        alt={alt}
        className="w-full h-auto object-cover rounded-xl"
        draggable={false}
      />
      {caption && (
        <figcaption className="pt-2 px-1 text-center text-sm text-zinc-500 dark:text-zinc-400">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
