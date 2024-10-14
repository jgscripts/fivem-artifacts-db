import { getRecommendedArtifact } from "@/actions/fivem";
import artifactDb from "@/db.json";

export default async function Home() {
  const data:
    | {
        windowsDownloadLink: string;
        linuxDownloadLink: string;
        recommendedArtifact: string;
      }
    | false = await getRecommendedArtifact();

  if (!data)
    return (
      <div className="p-4 text-center text-red-500 font-bold">
        Could not fetch artifacts data. Please try again later.
      </div>
    );

  return (
    <div className="max-w-[500px] min-w-[300px] p-5 mx-auto">
      <h1 className="text-2xl font-bold mb-5">FiveM Artifacts DB</h1>

      <div className="border-green-500 border-2 p-3 px-4 mb-5 text-lg">
        <p>
          <span>Latest artifact with no reported issues</span>
          <code className="bg-green-500 p-1 px-2 ml-2 text-white font-bold">
            {data.recommendedArtifact}
          </code>
        </p>
        <div className="flex gap-2">
          <p>Download:</p>
          <a
            href={data.windowsDownloadLink}
            className="text-blue-500 underline"
          >
            Windows
          </a>
          <a href={data.linuxDownloadLink} className="text-blue-500 underline">
            Linux
          </a>
        </div>
      </div>

      <div className="flex justify-between mb-2 text-xs">
        <p className="text-gray-400">Artifacts with reported issues:</p>
        <a
          href="https://github.com/jgscripts/fivem-artifacts-db/tree/main?tab=readme-ov-file#contributing"
          target="_blank"
          className="underline text-blue-500 text-right"
        >
          Know an issue? Let us know!
        </a>
      </div>

      {Object.entries(artifactDb.brokenArtifacts)
        .sort((a, b) => parseInt(b[0]) - parseInt(a[0]))
        .map(([key, value]) => (
          <div key={key} className="border border-gray-500 p-2 mb-2 text-sm">
            <code className="leading-5">
              <span className="bg-red-500 p-1 px-2 mr-2 text-white font-bold">
                {key}
              </span>
              <span className="text-gray-300">{value}</span>
            </code>
          </div>
        ))}

      <div></div>
    </div>
  );
}
