const pageList = (page: number, count: number) => {
  const shown = [
    ...new Set([1, page - 1, page, page + 1, count].filter((p) => p >= 1 && p <= count)),
  ];
  return shown.flatMap((p, i) => (i && p - shown[i - 1] > 1 ? ["…" as const, p] : [p]));
};

const button =
  "flex h-9 min-w-9 items-center justify-center rounded-full border border-zinc-700/60 px-2.5 text-sm font-semibold tabular-nums transition-colors";
const idle = "bg-zinc-900 text-zinc-300";

type Props = {
  page: number;
  count: number;
  hasMore?: boolean;
  onChange: (page: number) => void;
};

export default function Pager({ page, count, hasMore, onChange }: Props) {
  return (
    <nav aria-label="Pages" className="mt-5 flex items-center justify-center gap-2">
      <button
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        aria-label="Previous page"
        className={`${button} ${idle} enabled:hover:bg-zinc-800 enabled:hover:text-white disabled:opacity-30`}
      >
        ‹
      </button>
      {pageList(page, count).map((p, i) =>
        p === "…" ? (
          <span key={`gap-${i}`} className="px-1 text-sm text-zinc-500">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            aria-current={p === page ? "page" : undefined}
            className={`${button} ${p === page ? "border-transparent bg-zinc-50 font-bold text-zinc-950" : `${idle} hover:bg-zinc-800 hover:text-white`}`}
          >
            {p}
          </button>
        )
      )}
      {hasMore && <span className="px-1 text-sm text-zinc-500">…</span>}
      <button
        disabled={page >= count && !hasMore}
        onClick={() => onChange(page + 1)}
        aria-label="Next page"
        className={`${button} ${idle} enabled:hover:bg-zinc-800 enabled:hover:text-white disabled:opacity-30`}
      >
        ›
      </button>
    </nav>
  );
}
