import artifactDb from "@/db.json";

const GITHUB_REPO_TAGS = "https://api.github.com/repos/citizenfx/fivem/tags";
const DOWNLOAD_LINK_BASE = "https://runtime.fivem.net/artifacts/fivem";
const WINDOWS_MASTER = "build_server_windows/master";
const WINDOWS_FILE = "server.zip";
const LINUX_MASTER = "build_proot_linux/master";
const LINUX_FILE = "fx.tar.xz";

export type RecommendedArtifact = { artifact: string; sha: string, downloadLinks: { windows: string; linux: string }, isLatest?: boolean };
type ReturnType = RecommendedArtifact[] | false;

export async function getRecommendedArtifacts(): Promise<ReturnType> {
  try {
    const brokenArtifacts: { [key: string]: string } =
      artifactDb.brokenArtifacts;
    if (!brokenArtifacts) return false;

    // Get git commit sha from tag
    const gitReq = await fetch(GITHUB_REPO_TAGS);
    if (!gitReq.ok) return false;
    const gitData: { name: string; commit: { sha: string } }[] =
      await gitReq.json();

    // Filter tags for just automated releases, and convert to {[name]: sha}
    const latestReleases = gitData
      .filter(({ name }) => name.startsWith("v1.0.0."))
      .map(({ name, commit }) => ({
        artifact: name.split("v1.0.0.")[1],
        sha: commit.sha,
      }));

    // Go through the most recent artifacts and find one without an entry in brokenArtifacts
    let recommendedArtifacts: RecommendedArtifact[] = [];

    for (const [index, artifact] of latestReleases.entries()) {
      if (!brokenArtifacts[artifact.artifact]) {
        recommendedArtifacts.push({
          ...artifact,
          isLatest: index === 0,
          downloadLinks: {
            windows: `${DOWNLOAD_LINK_BASE}/${WINDOWS_MASTER}/${artifact.artifact}-${artifact.sha}/${WINDOWS_FILE}`,
            linux: `${DOWNLOAD_LINK_BASE}/${LINUX_MASTER}/${artifact.artifact}-${artifact.sha}/${LINUX_FILE}`,
          },
        });

        if (recommendedArtifacts.length === 3) break;
      }
    }

    return recommendedArtifacts;
  } catch {
    return false;
  }
}
