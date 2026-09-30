import { GIT_TAGS_URL, REF_URL } from "@/lib/artifacts";

const SHA_PATTERN = /^[a-f0-9]{40}$/i;

export async function GET(request: Request) {
  const artifact = new URL(request.url).searchParams.get("artifact") ?? "";
  if (!/^\d{1,10}$/.test(artifact) || Number(artifact) < 1) {
    return Response.json({ error: "Invalid artifact" }, { status: 400 });
  }

  const response = await fetch(`${REF_URL}v1.0.0.${artifact}`, {
    next: { revalidate: 432000 },
  });
  if (response.status === 404) return Response.json({ sha: null }, { status: 404 });
  if (!response.ok) return Response.json({ error: "Could not fetch artifact" }, { status: 502 });

  let object = (await response.json()).object;
  if (object?.type === "tag" && SHA_PATTERN.test(object.sha)) {
    const tagResponse = await fetch(`${GIT_TAGS_URL}${object.sha}`, {
      next: { revalidate: 432000 },
    });
    object = tagResponse.ok ? (await tagResponse.json()).object : null;
  }
  const sha = typeof object?.sha === "string" && SHA_PATTERN.test(object.sha) ? object.sha : null;
  return Response.json({ sha });
}
