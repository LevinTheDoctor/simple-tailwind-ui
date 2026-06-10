import { useState, type ReactNode } from "react";
import { Check, Copy } from "lucide-react";

export type CodeLanguage =
  | "tsx" | "ts" | "jsx" | "js"
  | "html" | "css" | "json" | "bash" | "text";

type CodePreviewProps = {
  readonly code: string;
  readonly language?: CodeLanguage;
  readonly title?: string;
  readonly showLineNumbers?: boolean;
  readonly showCopy?: boolean;
  readonly maxHeight?: string;
  readonly className?: string;
};

type TokenType = "comment" | "string" | "keyword" | "literal" | "number" | "plain";

type Token = {
  readonly type: TokenType;
  readonly text: string;
};

const JS_KEYWORDS =
  "import|export|from|const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|new|" +
  "class|extends|implements|interface|type|enum|async|await|try|catch|finally|throw|default|of|in|" +
  "typeof|instanceof|readonly|as|satisfies|keyof|void|never|any|string|number|boolean|this|delete|yield|static|get|set";

const STRING_RE = String.raw`"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'|` + "`(?:[^`\\\\]|\\\\.)*`";
const NUMBER_RE = String.raw`\b\d+(?:\.\d+)?\b`;
const LITERAL_RE = String.raw`\b(?:true|false|null|undefined)\b`;

function languageRules(language: CodeLanguage): ReadonlyArray<{ type: TokenType; re: string }> {
  switch (language) {
    case "tsx":
    case "ts":
    case "jsx":
    case "js":
      return [
        { type: "comment", re: String.raw`\/\/[^\n]*|\/\*[\s\S]*?\*\/` },
        { type: "string",  re: STRING_RE },
        { type: "keyword", re: `\\b(?:${JS_KEYWORDS})\\b` },
        { type: "literal", re: LITERAL_RE },
        { type: "number",  re: NUMBER_RE },
      ];
    case "json":
      return [
        { type: "string",  re: STRING_RE },
        { type: "literal", re: LITERAL_RE },
        { type: "number",  re: NUMBER_RE },
      ];
    case "bash":
      return [
        { type: "comment", re: String.raw`#[^\n]*` },
        { type: "string",  re: STRING_RE },
        { type: "keyword", re: String.raw`\b(?:npm|npx|pnpm|yarn|cd|echo|export|install|run|git|sudo|curl)\b` },
        { type: "number",  re: NUMBER_RE },
      ];
    case "html":
      return [
        { type: "comment", re: String.raw`<!--[\s\S]*?-->` },
        { type: "string",  re: STRING_RE },
        { type: "keyword", re: String.raw`<\/?[a-zA-Z][\w-]*|\/?>` },
      ];
    case "css":
      return [
        { type: "comment", re: String.raw`\/\*[\s\S]*?\*\/` },
        { type: "string",  re: STRING_RE },
        { type: "number",  re: String.raw`\b\d+(?:\.\d+)?(?:px|rem|em|%|vh|vw|s|ms)?\b` },
      ];
    default:
      return [];
  }
}

function tokenize(code: string, language: CodeLanguage): Token[] {
  const rules = languageRules(language);
  if (rules.length === 0) return [{ type: "plain", text: code }];

  const combined = new RegExp(rules.map(r => `(${r.re})`).join("|"), "g");
  const tokens: Token[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = combined.exec(code)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({ type: "plain", text: code.slice(lastIndex, match.index) });
    }
    const groupIndex = match.slice(1).findIndex(g => g !== undefined);
    tokens.push({ type: rules[groupIndex]?.type ?? "plain", text: match[0] });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < code.length) {
    tokens.push({ type: "plain", text: code.slice(lastIndex) });
  }
  return tokens;
}

const tokenClasses: Record<TokenType, string> = {
  comment: "text-zinc-500 italic",
  string:  "text-emerald-400",
  keyword: "text-violet-400",
  literal: "text-sky-400",
  number:  "text-amber-300",
  plain:   "",
};

function renderTokens(tokens: readonly Token[]): ReactNode {
  return tokens.map((token, i) =>
    token.type === "plain"
      ? token.text
      : <span key={i} className={tokenClasses[token.type]}>{token.text}</span>
  );
}

export function CodePreview({
  code,
  language = "tsx",
  title,
  showLineNumbers = false,
  showCopy = true,
  maxHeight,
  className = "",
}: CodePreviewProps) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.split("\n");
  const hasHeader = title !== undefined;

  const rootClasses = [
    "relative group rounded-xl overflow-hidden",
    "bg-zinc-950 ring-1 ring-zinc-800",
    "shadow-lg shadow-zinc-950/20",
    className,
  ].join(" ");

  const copyButton = showCopy && (
    <button
      type="button"
      onClick={copy}
      aria-label="Copy code"
      className={[
        "flex items-center gap-1.5 p-1.5 rounded-md text-xs font-medium",
        "bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-zinc-100",
        "transition-colors duration-200 cursor-pointer",
        hasHeader ? "" : "absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity",
      ].join(" ")}
    >
      {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
    </button>
  );

  return (
    <div className={rootClasses}>
      {hasHeader && (
        <div className="flex items-center justify-between gap-3 px-4 py-2 bg-zinc-900 border-b border-zinc-800">
          <div className="flex items-center gap-2 min-w-0">
            <span className="flex gap-1.5 shrink-0">
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
            </span>
            <span className="text-xs font-mono text-zinc-400 truncate">{title}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 select-none">
              {language}
            </span>
            {copyButton}
          </div>
        </div>
      )}
      <div className="overflow-auto" style={maxHeight ? { maxHeight } : undefined}>
        <pre className="text-zinc-100 text-xs p-4 leading-relaxed">
          {showLineNumbers ? (
            <code className="grid grid-cols-[auto_1fr] gap-x-4">
              {lines.map((line, i) => (
                <span key={i} className="contents">
                  <span className="text-right text-zinc-600 select-none">{i + 1}</span>
                  <span>{renderTokens(tokenize(line, language))}</span>
                </span>
              ))}
            </code>
          ) : (
            <code>{renderTokens(tokenize(code, language))}</code>
          )}
        </pre>
      </div>
      {!hasHeader && copyButton}
    </div>
  );
}
