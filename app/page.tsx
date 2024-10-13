import { getRecommendedArtifact } from "@/actions/fivem";
import artifactDb from "@/db.json";

export default async function Home() {
  const data: { downloadLink: string; recommendedArtifact: string } | false =
    await getRecommendedArtifact();

  if (!data)
    return (
      <div className="p-4 text-center text-red-500 font-bold">
        Could not fetch artifacts data. Please try again later.
      </div>
    );

  return (
    <div className="max-w-[500px] p-5 mx-auto">
      <h1 className="text-2xl font-bold mb-4">FiveM Artifacts DB</h1>

      <div className="border-green-500 border-2 p-2 px-3 mb-5 text-lg">
        <p>
          <span>Latest artifact with no reported issues</span>
          <code className="bg-green-500 p-1 px-2 ml-2 text-white font-bold">
            {data.recommendedArtifact}
          </code>
        </p>
        <a href={data.downloadLink} className="text-blue-500 underline">
          Download
        </a>
      </div>

      <p className="mb-2 text-xs text-gray-400">Artifacts with known issues:</p>

      {Object.entries(artifactDb.brokenArtifacts)
        .sort((a, b) => parseInt(b[0]) - parseInt(a[0]))
        .map(([key, value]) => (
          <div
            key={key}
            className="border border-gray-500 p-2 mb-2 last:mb-0 text-sm"
          >
            <code className="leading-5">
              <span className="bg-red-500 p-1 px-2 mr-2 text-white font-bold">
                {key}
              </span>
              <span className="text-gray-300">{value}</span>
            </code>
          </div>
        ))}
    </div>
  );
}
