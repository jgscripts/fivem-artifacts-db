import { getRecommendedArtifact } from "@/actions/fivem";
import db from "@/db.json";

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
      msg: "无法获取数据 - 请稍后重试。",
    });

  data.brokenArtifacts = db.brokenArtifacts;

  return Response.json(data);
}
