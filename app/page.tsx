import { getRecommendedArtifact } from "@/actions/fivem";
import BrokenArtifacts from "./brokenArtifacts";

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
    <div className="max-w-[600px] min-w-[300px] p-5 mx-auto">
      <div className="my-6 text-center">
        <h1 className="text-3xl font-bold mb-2">FiveM Artifacts DB</h1>
        <p className="text-[12px] text-gray-400">
          An open source project by JG Scripts.{" "}
          <a
            href="https://github.com/jgscripts/fivem-artifacts-db"
            target="_blank"
            className="text-blue-500 hover:underline"
          >
            View it on GitHub.
          </a>
        </p>
      </div>

      <div className="border border-zinc-800 bg-zinc-900 p-3 px-4 mb-5 text-lg rounded text-center">
        <p>
          <span>
            Latest<sup className="text-blue-400 font-bold">*</sup> artifact with
            no reported issues
          </span>
          <code className="bg-green-500 p-1 px-2 ml-2 font-bold rounded font-sans text-white">
            {data.recommendedArtifact}
          </code>
        </p>
        <div className="flex gap-3 justify-center text-lg mt-1">
          <p className="font-semibold">Download:</p>
          <a
            href={data.windowsDownloadLink}
            className="text-blue-500 hover:underline"
          >
            Windows
          </a>
          <a
            href={data.linuxDownloadLink}
            className="text-blue-500 hover:underline"
          >
            Linux
          </a>
        </div>
      </div>

      <div className="text-xs my-4 border border-zinc-800 p-2.5 rounded bg-zinc-900">
        <span className="bg-blue-500 font-semibold px-0.5 rounded-s-full mr-1 border border-opacity-30 border-zinc-900">
          *Note:
        </span>
        There is a wait period of up to 1 week before the very newest artifact
        is recommended, to allow time for issues to be reported.
      </div>

      <div className="flex justify-between mt-10 mb-2 text-xs">
        <p className="text-gray-400">Artifacts with reported issues:</p>
        <a
          href="https://jgscripts.com/artifact-report"
          target="_blank"
          className="underline text-blue-500"
        >
          Know an issue? Report it here
        </a>
      </div>

      <BrokenArtifacts />
    </div>
  );
}
