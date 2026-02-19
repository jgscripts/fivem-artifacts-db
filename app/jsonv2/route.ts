import { getRecommendedArtifact } from "@/actions/fivem";
import db from "@/db.json";

export const revalidate = 432000; // 5 days

type ResponseData = {
  error?: boolean;
  msg?: string;
  brokenArtifacts?: { artifact: string; reason: string }[];
  windowsDownloadLink?: string;
  linuxDownloadLink?: string;
  recommendedArtifact?: string;
};

export async function GET() {
  const data: ResponseData | false = await getRecommendedArtifact();
  if (!data)
    return Response.json({
      error: true,
      msg: "Could not fetch data - please try again later.",
    });

  data.brokenArtifacts = Object.entries(db.brokenArtifacts)
    .sort(([a], [b]) => parseInt(a) - parseInt(b))
    .map(([artifact, reason]) => ({ artifact, reason }));

  return Response.json(data);
}
