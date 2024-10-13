import artifactDb from "@/db.json";

const GITHUB_REPO_TAGS = "https://api.github.com/repos/citizenfx/fivem/tags";
const DOWNLOAD_LINK_BASE =
  "https://runtime.fivem.net/artifacts/fivem/build_server_windows/master";
const DOWNLOAD_FILE = "server.zip";

type ReturnType = { recommendedArtifact: string; downloadLink: string } | false;

export async function getRecommendedArtifact(): Promise<ReturnType> {
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
    let recommendedArtifact: { artifact: string; sha: string } =
      latestReleases[0];
    for (const artifact of latestReleases) {
      if (!brokenArtifacts[artifact.artifact]) {
        recommendedArtifact = artifact;
        break;
      }
    }

    // Generate download link
    const downloadLink = `${DOWNLOAD_LINK_BASE}/${recommendedArtifact.artifact}-${recommendedArtifact.sha}/${DOWNLOAD_FILE}`;

    return {
      recommendedArtifact: recommendedArtifact.artifact,
      downloadLink,
    };
  } catch {
    return false;
  }
}
