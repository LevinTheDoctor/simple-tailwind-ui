import { useEffect, useState, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import { AlertCircle } from "lucide-react";
import { TitelBorder } from "./TitelBorder";
import { CodePreview, type CodeLanguage } from "./CodePreview";

type FileEmbedType = "auto" | "markdown" | "code" | "text" | "image";
type FileEmbedSize = "sm" | "md" | "lg" | "full";
type FileEmbedVariant = "default" | "subtle" | "strong";

type FileEmbedProps = {
  readonly path: string;
  readonly type?: FileEmbedType;
  readonly title?: string;
  readonly language?: CodeLanguage;
  readonly maxHeight?: string;
  readonly size?: FileEmbedSize;
  readonly variant?: FileEmbedVariant;
  readonly fullWidth?: boolean;
  readonly className?: string;
};

const widthClasses: Record<FileEmbedSize, string> = {
  sm:   "max-w-sm",
  md:   "max-w-md",
  lg:   "max-w-2xl",
  full: "w-full",
};

const IMAGE_EXTENSIONS = ["png", "jpg", "jpeg", "gif", "svg", "webp", "avif"];

const CODE_EXTENSIONS: Record<string, CodeLanguage> = {
  tsx: "tsx", ts: "ts", jsx: "jsx", js: "js", mjs: "js", cjs: "js",
  html: "html", css: "css", json: "json", sh: "bash", bash: "bash",
};

function detectType(path: string): { type: Exclude<FileEmbedType, "auto">; language: CodeLanguage } {
  const extension = path.split(".").pop()?.toLowerCase() ?? "";
  if (extension === "md" || extension === "markdown") return { type: "markdown", language: "text" };
  if (IMAGE_EXTENSIONS.includes(extension)) return { type: "image", language: "text" };
  if (extension in CODE_EXTENSIONS) return { type: "code", language: CODE_EXTENSIONS[extension] };
  return { type: "text", language: "text" };
}

const markdownClasses = [
  "text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed",
  "[&_h1]:text-xl [&_h1]:font-bold [&_h1]:text-zinc-900 dark:[&_h1]:text-zinc-100 [&_h1]:mt-4 [&_h1]:mb-2",
  "[&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-zinc-900 dark:[&_h2]:text-zinc-100 [&_h2]:mt-4 [&_h2]:mb-2",
  "[&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-zinc-800 dark:[&_h3]:text-zinc-200 [&_h3]:mt-3 [&_h3]:mb-1.5",
  "[&_p]:my-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-2 [&_li]:my-0.5",
  "[&_a]:text-indigo-600 dark:[&_a]:text-indigo-400 [&_a]:underline",
  "[&_code]:font-mono [&_code]:text-xs [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:bg-zinc-100 dark:[&_code]:bg-zinc-800",
  "[&_pre]:bg-zinc-950 [&_pre]:text-zinc-100 [&_pre]:p-3 [&_pre]:rounded-xl [&_pre]:overflow-x-auto [&_pre]:my-2",
  "[&_blockquote]:border-l-2 [&_blockquote]:border-zinc-300 dark:[&_blockquote]:border-zinc-600 [&_blockquote]:pl-3 [&_blockquote]:text-zinc-500 dark:[&_blockquote]:text-zinc-400",
].join(" ");

export function FileEmbed({
  path,
  type = "auto",
  title,
  language,
  maxHeight,
  size = "md",
  variant = "default",
  fullWidth = false,
  className = "",
}: FileEmbedProps) {
  const detected = detectType(path);
  const resolvedType = type === "auto" ? detected.type : type;
  const resolvedLanguage = language ?? detected.language;
  const isText = resolvedType !== "image";

  const [content, setContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isText) return;
    let isMounted = true;
    setContent(null);
    setError(null);

    fetch(path)
      .then(response => {
        if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
        return response.text();
      })
      .then(data => { if (isMounted) setContent(data); })
      .catch((e: Error) => { if (isMounted) setError(e.message); });

    return () => { isMounted = false; };
  }, [path, isText]);

  let body: ReactNode;
  if (resolvedType === "image") {
    body = <img src={path} alt={title ?? path} className="w-full h-auto object-cover rounded-xl" />;
  } else if (error) {
    body = (
      <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-sm text-red-600 dark:text-red-400">
        <AlertCircle className="w-4 h-4 shrink-0" />
        <span>Datei konnte nicht geladen werden: {error}</span>
      </div>
    );
  } else if (content === null) {
    body = (
      <div className="flex flex-col gap-2 animate-pulse" aria-busy="true">
        <div className="h-3 rounded bg-zinc-200 dark:bg-zinc-800 w-3/4" />
        <div className="h-3 rounded bg-zinc-200 dark:bg-zinc-800 w-full" />
        <div className="h-3 rounded bg-zinc-200 dark:bg-zinc-800 w-1/2" />
      </div>
    );
  } else if (resolvedType === "markdown") {
    body = (
      <div className={markdownClasses} style={maxHeight ? { maxHeight, overflowY: "auto" } : undefined}>
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    );
  } else if (resolvedType === "code") {
    body = <CodePreview code={content} language={resolvedLanguage} title={title ?? path} maxHeight={maxHeight} />;
  } else {
    body = (
      <pre
        className="text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap leading-relaxed overflow-auto"
        style={maxHeight ? { maxHeight } : undefined}
      >
        {content}
      </pre>
    );
  }

  // CodePreview bringt eigenen Rahmen + Titel mit — kein zusätzlicher Wrapper nötig
  if (resolvedType === "code") {
    return <div className={`${fullWidth ? "w-full" : widthClasses[size]} ${className}`}>{body}</div>;
  }

  if (title) {
    return (
      <TitelBorder title={title} size={size} variant={variant} fullWidth={fullWidth} className={className}>
        <div className="pt-1">{body}</div>
      </TitelBorder>
    );
  }
  return <div className={`${fullWidth ? "w-full" : widthClasses[size]} ${className}`}>{body}</div>;
}
