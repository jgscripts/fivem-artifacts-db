import db from "@/db.json";

export const PAGE_SIZE = 10;
export const TAGS_URL = "https://api.github.com/repos/citizenfx/fivem/tags";
export const REF_URL = "https://api.github.com/repos/citizenfx/fivem/git/ref/tags/";
export const COMMITS_URL = "https://api.github.com/repos/citizenfx/fivem/commits/";
export const GIT_TAGS_URL = "https://api.github.com/repos/citizenfx/fivem/git/tags/";
const DOWNLOAD_BASE = "https://runtime.fivem.net/artifacts/fivem";
const TAG_PREFIX = "v1.0.0.";
const FAILED_BUILD = /failed.*build/i;

export type Entry = {
  lo: number;
  hi: number;
  label: string;
  desc: string;
  failed: boolean;
};
export type Cell = {
  label: string;
  tag: "OK" | "RECOMMENDED" | "ISSUE" | "BUILD" | "N/A";
  desc: string;
  n?: number;
  sha?: string;
};
export type TagPage = { list: [number, string][]; last: number | null };

export const entries: Entry[] = Object.entries(db.brokenArtifacts)
  .map(([key, desc]) => {
    const [lo, hi = lo] = key.split("-").map(Number);
    return { lo, hi, label: key.replace("-", "–"), desc, failed: FAILED_BUILD.test(desc) };
  })
  .sort((a, b) => b.hi - a.hi);

export const coveringEntry = (n: number) =>
  entries.find((e) => n >= e.lo && n <= e.hi);

export class RateLimitError extends Error {
  constructor(public reset: Date | null) {
    super("GitHub rate limit reached");
  }
}

function assertOk(res: Response) {
  if (res.ok) return;
  if (
    (res.status === 403 || res.status === 429) &&
    res.headers.get("x-ratelimit-remaining") === "0"
  ) {
    const reset = Number(res.headers.get("x-ratelimit-reset"));
    throw new RateLimitError(reset ? new Date(reset * 1000) : null);
  }
  throw new Error(`GitHub responded ${res.status}`);
}

export function localLookup(latest: number, query: string): Cell | number {
  const n = /^\d+$/.test(query) ? Number(query) : 0;
  if (n < 1 || n > latest) {
    return { label: query, tag: "N/A", desc: "Not a valid artifact number" };
  }
  const entry = coveringEntry(n);
  if (entry) {
    return { label: entry.label, tag: entry.failed ? "BUILD" : "ISSUE", desc: entry.desc };
  }
  return n;
}

export const downloadLinks = (artifact: number, sha: string) => ({
  windows: `${DOWNLOAD_BASE}/build_server_windows/master/${artifact}-${sha}/server.zip`,
  linux: `${DOWNLOAD_BASE}/build_proot_linux/master/${artifact}-${sha}/fx.tar.xz`,
});

export function parseTagList(
  tags: { name: string; commit: { sha: string } }[]
): [number, string][] {
  return tags
    .filter((tag) => tag.name.startsWith(TAG_PREFIX))
    .map((tag): [number, string] => [
      Number(tag.name.slice(TAG_PREFIX.length)),
      tag.commit.sha,
    ]);
}

export const parseLastPage = (link: string | null) => {
  const last = link?.match(/[?&]page=(\d+)>; rel="last"/)?.[1];
  return last ? Number(last) : null;
};

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export async function fetchTagPage(page: number, signal?: AbortSignal): Promise<TagPage> {
  const res = await fetch(`/api/artifact-data/tags?page=${page}`, { signal });
  assertOk(res);
  return res.json();
}

export async function fetchCommitDates(
  shas: string[],
  signal?: AbortSignal
): Promise<Record<string, string>> {
  if (!shas.length) return {};
  const params = new URLSearchParams();
  shas.forEach((sha) => params.append("sha", sha));
  const res = await fetch(`/api/artifact-data/dates?${params}`, { signal });
  assertOk(res);
  const dates: Record<string, string | null> = await res.json();
  return Object.fromEntries(
    Object.entries(dates).flatMap(([sha, date]) => (date ? [[sha, formatDate(date)]] : []))
  );
}

export async function fetchTagSha(artifact: number, signal?: AbortSignal): Promise<string | null> {
  const res = await fetch(`/api/artifact-data/sha?artifact=${artifact}`, { signal });
  if (res.status === 404) return null;
  assertOk(res);
  return (await res.json()).sha ?? null;
}
