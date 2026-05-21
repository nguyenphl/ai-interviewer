import { cn } from "@/lib/utils";

interface Segment {
  type: "text" | "code";
  content: string;
  lang?: string;
}

function parseSegments(text: string): Segment[] {
  const segments: Segment[] = [];
  const regex = /```(\w*)\n?([\s\S]*?)```/g;
  let last = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) {
      segments.push({ type: "text", content: text.slice(last, match.index) });
    }
    segments.push({ type: "code", lang: match[1] || undefined, content: match[2].trimEnd() });
    last = match.index + match[0].length;
  }

  if (last < text.length) {
    segments.push({ type: "text", content: text.slice(last) });
  }

  return segments;
}

export function QuestionText({ text, className }: { text: string; className?: string }) {
  const segments = parseSegments(text);

  return (
    <div className={cn("space-y-3", className)}>
      {segments.map((seg, i) =>
        seg.type === "code" ? (
          <div key={i} className="rounded-xl overflow-hidden border border-white/[0.08]">
            {seg.lang && (
              <div className="flex items-center gap-2 px-4 py-2 bg-white/[0.04] border-b border-white/[0.06]">
                <span className="text-[11px] font-mono font-medium text-white/40">{seg.lang}</span>
              </div>
            )}
            <pre className="overflow-x-auto bg-neutral-900 px-4 py-3">
              <code className="text-sm font-mono text-white/80 leading-relaxed">
                {seg.content}
              </code>
            </pre>
          </div>
        ) : (
          <p key={i} className="text-base leading-relaxed text-white/90 font-medium whitespace-pre-wrap">
            {seg.content.trim()}
          </p>
        )
      )}
    </div>
  );
}
