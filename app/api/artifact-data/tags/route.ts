import { GITHUB_ARTIFACT_TAGS_CACHE_TAG } from "@/actions/fivem";
import { parseLastPage, parseTagList, TAGS_URL } from "@/lib/artifacts";

export async function GET(request: Request) {
  const page = Number(new URL(request.url).searchParams.get("page"));
  if (!Number.isInteger(page) || page < 1 || page > 10000) {
    return Response.json({ error: "Invalid page" }, { status: 400 });
  }

  const response = await fetch(`${TAGS_URL}?per_page=100&page=${page}`, {
    next: { revalidate: 432000, tags: [GITHUB_ARTIFACT_TAGS_CACHE_TAG] },
  });
  if (!response.ok) {
    return Response.json({ error: "Could not fetch artifact tags" }, { status: 502 });
  }

  return Response.json({
    list: parseTagList(await response.json()),
    last: parseLastPage(response.headers.get("link")),
  });
}
