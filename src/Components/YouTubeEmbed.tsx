type YouTubeEmbedSize = "sm" | "md" | "lg" | "full";

type YouTubeEmbedProps = {
  readonly source: string;
  readonly title?: string;
  readonly start?: number;
  readonly autoplay?: boolean;
  readonly size?: YouTubeEmbedSize;
  readonly fullWidth?: boolean;
  readonly className?: string;
};

const sizeClasses: Record<YouTubeEmbedSize, string> = {
  sm:   "max-w-sm",
  md:   "max-w-md",
  lg:   "max-w-2xl",
  full: "w-full",
};

/**
 * Akzeptiert: Watch-URL, Kurz-URL (youtu.be), Shorts-/Embed-/Live-URL,
 * eine rohe Video-ID oder einen kompletten <iframe>-Embed-Code.
 */
function extractEmbedUrl(source: string, start?: number, autoplay?: boolean): string | null {
  const trimmed = source.trim();

  // Embed-Code: src aus dem iframe übernehmen
  if (trimmed.includes("<iframe")) {
    const srcMatch = trimmed.match(/src=["']([^"']+)["']/);
    return srcMatch ? srcMatch[1] : null;
  }

  let videoId: string | null = null;
  const urlMatch = trimmed.match(
    /(?:youtube(?:-nocookie)?\.com\/(?:watch\?(?:[^#]*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/
  );
  if (urlMatch) {
    videoId = urlMatch[1];
  } else if (/^[\w-]{11}$/.test(trimmed)) {
    videoId = trimmed;
  }
  if (!videoId) return null;

  const params = new URLSearchParams();
  if (start && start > 0) params.set("start", String(Math.floor(start)));
  if (autoplay) params.set("autoplay", "1");
  const query = params.toString();
  return `https://www.youtube-nocookie.com/embed/${videoId}${query ? `?${query}` : ""}`;
}

export function YouTubeEmbed({
  source,
  title = "YouTube video",
  start,
  autoplay = false,
  size = "md",
  fullWidth = false,
  className = "",
}: YouTubeEmbedProps) {
  const embedUrl = extractEmbedUrl(source, start, autoplay);

  const wrapperClasses = [
    "rounded-2xl overflow-hidden ring-1 ring-zinc-200 dark:ring-zinc-800",
    "shadow-lg shadow-zinc-900/10 bg-zinc-950",
    fullWidth ? "w-full" : sizeClasses[size],
    className,
  ].join(" ");

  if (!embedUrl) {
    return (
      <div className={`${wrapperClasses} flex items-center justify-center aspect-video`}>
        <p className="text-sm text-zinc-400 p-4 text-center">
          Ungültiger YouTube-Link oder Embed-Code.
        </p>
      </div>
    );
  }

  return (
    <div className={wrapperClasses}>
      <iframe
        src={embedUrl}
        title={title}
        className="w-full aspect-video block"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </div>
  );
}
