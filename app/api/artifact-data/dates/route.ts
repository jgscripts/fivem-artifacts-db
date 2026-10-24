import { COMMITS_URL } from "@/lib/artifacts";

const SHA_PATTERN = /^[a-f0-9]{40}$/i;

export async function GET(request: Request) {
  const shas = new URL(request.url).searchParams.getAll("sha").slice(0, 5);
  if (shas.some((sha) => !SHA_PATTERN.test(sha))) {
    return Response.json({ error: "Invalid commit SHA" }, { status: 400 });
  }

  const dates = await Promise.all(
    shas.map(async (sha) => {
      const response = await fetch(`${COMMITS_URL}${sha}`, {
        next: { revalidate: 432000 },
      });
      if (!response.ok) return [sha, null] as const;
      const date = (await response.json()).commit?.committer?.date;
      return [sha, typeof date === "string" ? date : null] as const;
    })
  );
  return Response.json(Object.fromEntries(dates));
}
