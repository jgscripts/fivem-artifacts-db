import artifactDb from "@/db.json";

const GITHUB_REPO_TAGS = "https://api.github.com/repos/citizenfx/fivem/tags";
const DOWNLOAD_LINK_BASE = "https://runtime.fivem.net/artifacts/fivem";
const WINDOWS_MASTER = "build_server_windows/master";
const WINDOWS_FILE = "server.zip";
const LINUX_MASTER = "build_proot_linux/master";
const LINUX_FILE = "fx.tar.xz";

type ReturnType =
  | {
      recommendedArtifact: string;
      windowsDownloadLink: string;
      linuxDownloadLink: string;
    }
  | false;

function getAllBrokenArtifacts(): { [key: string]: string } {
  const brokenArtifacts = JSON.parse(
    JSON.stringify(artifactDb.brokenArtifacts)
  ); // it's a really fast deep clone, it looks ugly i know

  for (const [artifact, reason] of Object.entries(brokenArtifacts)) {
    if (artifact.includes("-")) {
      const artifactRange = artifact.split("-").map((a) => parseInt(a));

      for (let i = artifactRange[0]; i <= artifactRange[1]; i++) {
        brokenArtifacts[i.toString()] = reason;
      }

      delete brokenArtifacts[artifact];
    }
  }

  return brokenArtifacts;
}

export async function getRecommendedArtifact(): Promise<ReturnType> {
  const CACHE_KEEP_SECS = 604800;

  try {
    const brokenArtifacts = getAllBrokenArtifacts();
    if (!brokenArtifacts) return false;

    // Get git commit sha from tag
    const gitReq = await fetch(GITHUB_REPO_TAGS, {
      next: { revalidate: CACHE_KEEP_SECS },
    });
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
    const windowsDownloadLink = `${DOWNLOAD_LINK_BASE}/${WINDOWS_MASTER}/${recommendedArtifact.artifact}-${recommendedArtifact.sha}/${WINDOWS_FILE}`;
    const linuxDownloadLink = `${DOWNLOAD_LINK_BASE}/${LINUX_MASTER}/${recommendedArtifact.artifact}-${recommendedArtifact.sha}/${LINUX_FILE}`;

    return {
      recommendedArtifact: recommendedArtifact.artifact,
      windowsDownloadLink,
      linuxDownloadLink,
    };
  } catch {
    return false;
  }
}
