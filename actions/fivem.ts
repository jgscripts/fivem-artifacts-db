import db from "@/db.json";
import { downloadLinks, parseTagList, TAGS_URL } from "@/lib/artifacts";

export const GITHUB_ARTIFACT_TAGS_CACHE_TAG = "github-artifact-tags";

export type Artifacts = {
  latest: number;
  recommended: number;
  recommendedSha: string;
};

export function getAllBrokenArtifacts(): Record<string, string> {
  const broken: Record<string, string> = {};
  for (const [key, reason] of Object.entries(db.brokenArtifacts)) {
    if (key.includes("-")) {
      const [lo, hi] = key.split("-").map(Number);
      for (let i = lo; i <= hi; i++) broken[i] = reason;
    } else {
      broken[key] = reason;
    }
  }
  return broken;
}

export async function getArtifacts(): Promise<Artifacts | false> {
  try {
    const res = await fetch(`${TAGS_URL}?per_page=100`, {
      next: { revalidate: 432000, tags: [GITHUB_ARTIFACT_TAGS_CACHE_TAG] },
    });
    if (!res.ok) return false;
    const tags = parseTagList(await res.json());
    if (!tags.length) return false;
    const broken = getAllBrokenArtifacts();
    const sorted = [...tags].sort((a, b) => b[0] - a[0]);
    const [recommended, recommendedSha] = sorted.find(([n]) => !broken[n]) ?? sorted[0];
    return { latest: sorted[0][0], recommended, recommendedSha };
  } catch {
    return false;
  }
}

export async function getRecommendedArtifact() {
  const data = await getArtifacts();
  if (!data) return false as const;
  const links = downloadLinks(data.recommended, data.recommendedSha);
  return {
    recommendedArtifact: String(data.recommended),
    windowsDownloadLink: links.windows,
    linuxDownloadLink: links.linux,
  };
}
