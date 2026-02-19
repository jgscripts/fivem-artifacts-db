import { getRecommendedArtifact } from "@/actions/fivem";
import db from "@/db.json";

export const revalidate = 432000; // 5 days

type ResponseData = {
  error?: boolean;
  msg?: string;
  brokenArtifacts?: object;
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

  data.brokenArtifacts = db.brokenArtifacts;

  return Response.json(data);
}
