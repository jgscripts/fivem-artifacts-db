"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  coveringEntry,
  downloadLinks,
  entries,
  fetchCommitDate,
  fetchTagPage,
  fetchTagSha,
  localLookup,
  PAGE_SIZE,
  RateLimitError,
  type Cell,
  type Entry,
  type TagPage,
} from "@/lib/artifacts";
import { ArrowDownIcon, SearchIcon, TuxIcon, WindowsIcon } from "./icons";
import Pager from "./pager";

const TAG_STYLES: Record<Cell["tag"], string> = {
  ISSUE: "bg-red-500/15 text-red-400",
  BUILD: "bg-zinc-800 text-zinc-400",
  OK: "bg-green-500/15 text-green-400",
  RECOMMENDED: "bg-emerald-400/20 text-emerald-300",
  "N/A": "bg-zinc-800 text-zinc-500",
};
const SKELETON_WIDTHS = ["w-3/5", "w-2/5", "w-4/5", "w-1/2", "w-2/3"];

const DownloadLink = ({ n, sha, os }: { n: number; sha: string; os: "windows" | "linux" }) => (
  <a
    href={downloadLinks(n, sha)[os]}
    aria-label={`Download ${n} for ${os === "windows" ? "Windows" : "Linux"}`}
    className="inline-flex items-center gap-1 text-zinc-300 hover:text-white"
  >
    {os === "windows" ? (
      <WindowsIcon className="h-3 w-3 fill-current" />
    ) : (
      <TuxIcon className="h-3 w-3 fill-current" />
    )}
    <ArrowDownIcon className="h-2.5 w-2.5 stroke-current" />
  </a>
);

type Props = { latest: number; recommended: number };

export default function ArtifactTable({ latest, recommended }: Props) {
  const [view, setView] = useState<"all" | "issues">("all");
  const [showFailed, setShowFailed] = useState(false);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [fetchedTags, setFetchedTags] = useState<[number, string][]>([]);
  const [lastGitPage, setLastGitPage] = useState<number | null>(null);
  const [exhausted, setExhausted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{ rateLimited: boolean; reset: string | null } | null>(null);
  const [result, setResult] = useState<Cell | null>(null);
  const [dates, setDates] = useState<Record<string, string>>({});
  const gitPages = useRef(new Map<number, Promise<TagPage>>());
  const gitResults = useRef(new Map<number, [number, string][]>());
  const dateFetches = useRef(new Set<string>());
  const liveLatest = Math.max(latest, fetchedTags[0]?.[0] ?? 0);

  const allRows = useMemo(() => {
    const rows: Cell[] = [];
    let prev: Entry | undefined;
    for (const [n, sha] of fetchedTags) {
      const entry = coveringEntry(n);
      if (entry) {
        if (entry !== prev && (showFailed || !entry.failed)) {
          rows.push({ label: entry.label, tag: entry.failed ? "BUILD" : "ISSUE", desc: entry.desc });
        }
        prev = entry;
      } else {
        rows.push({
          label: String(n),
          tag: n === recommended ? "RECOMMENDED" : "OK",
          desc: "No reported issues",
          n,
          sha,
        });
        prev = undefined;
      }
    }
    return rows;
  }, [fetchedTags, showFailed, recommended]);

  const datedShas = useMemo(
    () => new Set(allRows.flatMap((r) => (r.sha ? [r.sha] : [])).slice(0, 5)),
    [allRows]
  );

  useEffect(() => {
    if (view !== "all") return;
    if (allRows.length >= page * PAGE_SIZE || exhausted) {
      setLoading(false);
      return;
    }
    const next = gitResults.current.size + 1;
    if (lastGitPage && next > lastGitPage) {
      setExhausted(true);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    let stale = false;
    if (!gitPages.current.has(next)) gitPages.current.set(next, fetchTagPage(next));
    gitPages.current
      .get(next)!
      .then(({ list, last }) => {
        if (stale) return;
        gitResults.current.set(next, list);
        if (last) setLastGitPage(last);
        if (!list.length) setExhausted(true);
        setFetchedTags(
          [...gitResults.current.entries()].sort((a, b) => a[0] - b[0]).flatMap(([, l]) => l)
        );
      })
      .catch((e) => {
        gitPages.current.delete(next);
        if (stale) return;
        setError({
          rateLimited: e instanceof RateLimitError,
          reset:
            e instanceof RateLimitError && e.reset
              ? e.reset.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
              : null,
        });
        setLoading(false);
      });
    return () => {
      stale = true;
    };
  }, [view, page, allRows.length, exhausted, lastGitPage]);

  useEffect(() => {
    setResult(null);
    if (!query.trim()) return;
    let stale = false;
    const timer = setTimeout(async () => {
      const local = localLookup(liveLatest, query.trim());
      const cell: Cell =
        typeof local === "number"
          ? await fetchTagSha(local)
              .then((sha) =>
                sha
                  ? { label: String(local), tag: "OK" as const, desc: "No reported issues", n: local, sha }
                  : { label: String(local), tag: "N/A" as const, desc: "Not a valid artifact number" }
              )
              .catch((e) => ({
                label: String(local),
                tag: "N/A" as const,
                desc:
                  e instanceof RateLimitError
                    ? "GitHub rate limit reached. Try again shortly."
                    : "Couldn't reach GitHub. Try again shortly.",
              }))
          : local;
      if (cell.n === recommended) cell.tag = "RECOMMENDED";
      if (!stale) setResult(cell);
    }, 250);
    return () => {
      stale = true;
      clearTimeout(timer);
    };
  }, [query, liveLatest, recommended]);

  const issueRows: Cell[] = entries
    .filter((e) => showFailed || !e.failed)
    .map((e) => ({ label: e.label, tag: e.failed ? "BUILD" : "ISSUE", desc: e.desc }));

  const rows = view === "all" ? allRows : issueRows;
  const pageCount = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const searching = Boolean(query.trim());
  const hasMore = view === "all" && !exhausted;
  const busy = view === "all" && loading;
  const skeletonRows = searching ? (result ? 0 : 1) : busy ? PAGE_SIZE : 0;
  const cells = searching
    ? result
      ? [result]
      : []
    : busy
      ? []
      : rows.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const rateLimitPanel = Boolean(error?.rateLimited) && !cells.length && !skeletonRows && !searching;

  useEffect(() => {
    const shas = cells.flatMap((c) =>
      c.sha && datedShas.has(c.sha) && !dates[c.sha] && !dateFetches.current.has(c.sha)
        ? [c.sha]
        : []
    );
    if (!shas.length) return;
    shas.forEach((sha) => dateFetches.current.add(sha));
    let stale = false;
    Promise.all(shas.map((sha) => fetchCommitDate(sha).then((d) => [sha, d] as const))).then(
      (pairs) => {
        const found = pairs.filter(([, d]) => d) as [string, string][];
        if (!stale && found.length) setDates((d) => ({ ...d, ...Object.fromEntries(found) }));
      }
    );
    return () => {
      stale = true;
    };
  });

  return (
    <section>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-full border border-zinc-800 p-1">
          {(["all", "issues"] as const).map((v) => (
            <button
              key={v}
              onClick={() => {
                setView(v);
                setPage(1);
              }}
              className={`rounded-full px-3.5 py-1 text-sm font-semibold ${view === v ? "bg-zinc-800 text-zinc-50" : "text-zinc-500 hover:text-zinc-300"}`}
            >
              {v === "all" ? "All" : "Issues only"}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-5">
          <label className="flex cursor-pointer items-center gap-2.5 text-sm text-zinc-400">
            Failed builds
            <button
              role="switch"
              aria-checked={showFailed}
              onClick={() => {
                setShowFailed(!showFailed);
                setPage(1);
              }}
              className={`relative h-5 w-10 rounded-full transition-colors ${showFailed ? "bg-zinc-50" : "bg-zinc-800"}`}
            >
              <span
                className={`absolute left-[3px] top-[3px] block h-3.5 w-3.5 rounded-full transition-transform ${showFailed ? "translate-x-5 bg-zinc-950" : "bg-zinc-500"}`}
              />
            </button>
          </label>
          <div className="flex w-44 items-center gap-2 rounded-full border border-zinc-800 px-3.5 py-1.5 focus-within:border-zinc-600">
            <SearchIcon className="h-3.5 w-3.5 shrink-0 stroke-zinc-600" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              maxLength={10}
              className="w-full bg-transparent text-sm tabular-nums text-zinc-200 outline-none placeholder:text-zinc-600"
            />
          </div>
        </div>
      </div>

      {rateLimitPanel ? (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 px-6 py-12 text-center">
          <p className="mb-2 font-semibold text-zinc-50">GitHub rate limit reached</p>
          <p className="mx-auto max-w-md text-sm leading-relaxed text-zinc-400">
            Artifact data comes straight from GitHub, which allows 60 requests an hour per
            visitor.{" "}
            {error?.reset ? `Try again after ${error.reset}.` : "Try again in a few minutes."} The
            Issues view still works in the meantime.
          </p>
        </div>
      ) : (
      <div className="overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-900">
        <table className="w-full min-w-[640px] text-sm">
          <tbody aria-busy={skeletonRows > 0} className="divide-y divide-zinc-800/60">
            {!skeletonRows && !cells.length && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-sm text-zinc-500">
                  {error ? "Couldn't reach GitHub. Try again in a few minutes." : "Nothing to show."}
                </td>
              </tr>
            )}
            {skeletonRows > 0
              ? Array.from({ length: skeletonRows }, (_, i) => (
                  <tr key={i}>
                    <td className="w-px px-4 py-2">
                      <div className="my-1 h-3 w-14 animate-pulse rounded bg-zinc-800" />
                    </td>
                    <td className="w-px px-4 py-2">
                      <div className="my-0.5 h-4 w-11 animate-pulse rounded-full bg-zinc-800" />
                    </td>
                    <td className="w-full px-4 py-2" colSpan={2}>
                      <div
                        className={`my-1 h-3 animate-pulse rounded bg-zinc-800 ${SKELETON_WIDTHS[i % SKELETON_WIDTHS.length]}`}
                      />
                    </td>
                  </tr>
                ))
              : cells.map((cell) => (
                  <tr
                    key={cell.label}
                    className={
                      cell.tag === "RECOMMENDED"
                        ? "bg-gradient-to-r from-emerald-500/[0.08] via-transparent to-transparent"
                        : undefined
                    }
                  >
                    <td
                      className={`w-px whitespace-nowrap px-4 py-2 font-semibold leading-5 tabular-nums ${cell.tag === "BUILD" || cell.tag === "N/A" ? "text-zinc-600" : "text-zinc-50"}`}
                    >
                      {cell.label}
                    </td>
                    <td className="w-px px-4 py-2 leading-5">
                      <span
                        className={`whitespace-nowrap rounded-full px-2 py-0.5 align-middle text-[10px] font-bold tracking-wider ${TAG_STYLES[cell.tag]}`}
                      >
                        {cell.tag}
                      </span>
                    </td>
                    <td
                      colSpan={cell.n !== undefined && cell.sha ? 1 : 2}
                      className={`w-full px-4 py-2 leading-5 ${cell.tag === "BUILD" || cell.tag === "N/A" ? "text-zinc-500" : "text-zinc-300"}`}
                    >
                      {cell.desc}
                    </td>
                    {cell.n !== undefined && cell.sha && (
                      <td className="w-px whitespace-nowrap px-4 py-2 align-middle">
                        <span className="flex items-center justify-end gap-3.5">
                          {dates[cell.sha] && (
                            <span className="text-xs tabular-nums text-zinc-500">
                              {dates[cell.sha]}
                            </span>
                          )}
                          <DownloadLink n={cell.n} sha={cell.sha} os="windows" />
                          <DownloadLink n={cell.n} sha={cell.sha} os="linux" />
                        </span>
                      </td>
                    )}
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
      )}

      {!searching && !rateLimitPanel && (pageCount > 1 || hasMore) && (
        <Pager page={safePage} count={pageCount} hasMore={hasMore} onChange={setPage} />
      )}
    </section>
  );
}
