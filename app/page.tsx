import { getRecommendedArtifacts, type RecommendedArtifact } from "@/actions/fivem";
import artifactDb from "@/db.json";

export default async function Home() {
  const recommendedArtifacts: RecommendedArtifact[] | false = await getRecommendedArtifacts();

  if (!recommendedArtifacts)
    return (
      <div className="p-4 text-center text-red-500 font-bold">
        Could not fetch artifacts data. Please try again later.
      </div>
    );

  return (
    <div className="max-w-[500px] min-w-[300px] p-5 mx-auto">
      <h1 className="text-2xl font-bold mb-5">FiveM Artifacts DB</h1>

      <div className="mb-5">
        {recommendedArtifacts[0].isLatest && (
          <div className="text-orange-400 font-bold text-xs mb-2">
            This is the newest artifact. It may be unstable or have unknown issues.
          </div>
        )}

        <div className="border-green-500 border-2 p-3 text-lg mb-2">
          <p>
            <span>Latest artifact with no reported issues</span>
            <code className="bg-green-500 p-1 px-2 ml-2 text-white font-bold">
              {recommendedArtifacts[0].artifact}
            </code>
          </p>

          <div className="flex gap-2">
            <p>Download: </p>
            <a href={recommendedArtifacts[0].downloadLinks.windows} className="underline text-blue-500">Windows</a>
            <a href={recommendedArtifacts[0].downloadLinks.linux} className="underline text-blue-500">Linux</a>
          </div>
        </div>

        <div className="flex w-full justify-between gap-2 flex-wrap">
          {recommendedArtifacts.slice(1).map((artifact) => (
            <div key={artifact.artifact} className="border border-gray-500 p-2 text-sm flex flex-grow justify-between gap-2">
              <code className="leading-6">
                <span className="bg-green-500 p-1 px-2 text-white font-bold">
                  {artifact.artifact}
                </span>
              </code>

              <div className="gap-2 flex">
                <a href={artifact.downloadLinks.windows} className="underline text-blue-500">Windows</a>
                <a href={artifact.downloadLinks.linux} className="underline text-blue-500">Linux</a>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between mb-2 text-xs flex-wrap-reverse gap-y-1 gap-x-8">
        <p className="text-gray-400">Artifacts with reported issues:</p>
        <a
          href="https://github.com/jgscripts/fivem-artifacts-db/tree/main?tab=readme-ov-file#contributing"
          target="_blank"
          className="underline text-blue-500"
        >
          Know an issue? Let us know!
        </a>
      </div>

      {Object.entries(artifactDb.brokenArtifacts)
        .sort((a, b) => parseInt(b[0]) - parseInt(a[0]))
        .map(([key, value]) => (
          <div key={key} className="border border-gray-500 p-2 mb-2 text-sm">
            <code className="leading-6">
              <span className="bg-red-500 p-1 px-2 mr-2 text-white font-bold">
                {key}
              </span>
              <span className="text-gray-300 break-words">{value}</span>
            </code>
          </div>
        ))}
    </div>
  );
}
