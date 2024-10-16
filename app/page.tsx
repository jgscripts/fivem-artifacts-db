import { getRecommendedArtifact } from "@/actions/fivem";
import artifactDb from "@/db.json";

export default async function Home() {
  const data = await getRecommendedArtifact();

  if (!data)
    return (
      <div className="p-4 text-center text-red-500 font-bold">
        Could not fetch artifacts data. Please try again later.
      </div>
    );

  return (
    <div className="max-w-[500px] min-w-[300px] p-5 mx-auto">
      <h1 className="text-2xl font-bold mb-5">FiveM Artifacts DB</h1>

      <div className="border border-zinc-800 bg-zinc-900 p-3 px-4 mb-5 text-lg rounded text-center">
        <p>
          <span>
            Latest<sup className="text-blue-400 font-bold">*</sup> artifact with no reported issues
          </span>
          <code className="bg-green-500 p-1 px-2 ml-2 font-bold rounded font-sans text-base text-white">
            {data.recommendedArtifact}
          </code>
        </p>
        <div className="flex gap-2 justify-center text-base">
          <p className="font-semibold">Download:</p>
          <a href={data.windowsDownloadLink} className="text-blue-500 hover:underline">
            Windows
          </a>
          <a href={data.linuxDownloadLink} className="text-blue-500 hover:underline">
            Linux
          </a>
        </div>
      </div>

      <div className="text-xs my-4 border border-zinc-800 p-2.5 rounded bg-zinc-900">
        <span className="bg-blue-500 font-semibold px-0.5 rounded-s-full mr-1 border border-opacity-30 border-zinc-900">
          *Note:
        </span>
        There is a wait period of ~1 day before the very newest artifact is recommended, to allow time for issues to be reported.
      </div>

      <div className="flex justify-between mt-10 mb-2 text-xs">
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
          <div key={key} className="border border-zinc-800 p-2 mb-3 bg-zinc-900 rounded cursor-pointer">
            <code className="leading-5">
              <span className="text-xs font-sans bg-red-500 p-1 px-1 mr-1 font-bold rounded border border-opacity-30 border-zinc-900">
                {key}
              </span>
              <span className="text-sm font-sans">{value}</span>
            </code>
          </div>
        ))}
    </div>
  );
}