import { timingSafeEqual } from "node:crypto";
import { revalidatePath, revalidateTag } from "next/cache";
import {
  getRecommendedArtifact,
  GITHUB_ARTIFACT_TAGS_CACHE_TAG,
} from "@/actions/fivem";

function isAuthorized(request: Request): boolean {
  const expected = process.env.ARTIFACTS_CACHE_REFRESH_TOKEN;
  const authorization = request.headers.get("authorization");
  if (!expected || !authorization?.startsWith("Bearer ")) return false;

  const providedBuffer = Buffer.from(authorization.slice("Bearer ".length));
  const expectedBuffer = Buffer.from(expected);
  return (
    providedBuffer.length === expectedBuffer.length &&
    timingSafeEqual(providedBuffer, expectedBuffer)
  );
}

export async function POST(request: Request) {
  if (!process.env.ARTIFACTS_CACHE_REFRESH_TOKEN) {
    return Response.json(
      { error: "Artifact cache refresh is not configured" },
      { status: 503 },
    );
  }
  if (!isAuthorized(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Expire the GitHub response synchronously, fetch and cache its replacement,
  // then expire the rendered homepage so its next request uses the fresh data.
  revalidateTag(GITHUB_ARTIFACT_TAGS_CACHE_TAG, { expire: 0 });
  const artifact = await getRecommendedArtifact();
  if (!artifact) {
    return Response.json(
      { error: "GitHub did not return fresh artifact tags" },
      { status: 502 },
    );
  }
  revalidatePath("/");

  return Response.json({
    recommendedArtifact: Number(artifact.recommendedArtifact),
  });
}
