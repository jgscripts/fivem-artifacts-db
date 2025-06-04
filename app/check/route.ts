import { getAllBrokenArtifacts } from "@/actions/fivem";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const artifact = request?.nextUrl?.searchParams.get("artifact");
  if (!artifact) {
    return Response.json(
      {
        error: true,
        msg: "您未提供要检查的构建版本",
      },
      { status: 400 }
    );
  }

  const allBrokenArtifacts = getAllBrokenArtifacts();
  if (allBrokenArtifacts[artifact]) {
    return Response.json({
      status: "BROKEN",
      reason: allBrokenArtifacts[artifact],
    });
  }

  return Response.json({ status: "OK" });
}
