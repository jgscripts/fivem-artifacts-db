import {
  getFivemOfficialRecommended,
  getRecommendedArtifact,
} from "@/actions/fivem";
import BrokenArtifacts from "./brokenArtifacts";

export const revalidate = 432000; // 5 days

export default async function Home() {
  const [data, fivemRecommended]: [
    (
      | {
          windowsDownloadLink: string;
          linuxDownloadLink: string;
          recommendedArtifact: string;
        }
      | false
    ),
    {
      version: string;
      windowsDownload: string | null;
      linuxDownload: string | null;
    } | null,
  ] = await Promise.all([
    getRecommendedArtifact(),
    getFivemOfficialRecommended(),
  ]);

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
        The very newest artifact will not be recommended immediately due to a
        short wait period, to allow time for issues to be reported.
      </div>

      <div className="text-xs my-4 border border-red-900 p-2.5 rounded bg-red-950/40">
        <span className="bg-red-500 font-semibold px-0.5 rounded-s-full mr-1 border border-opacity-30 border-zinc-900">
          *Important:
        </span>
        Using the latest artifacts is always risky. Never run the latest
        versions on a server that is in active production. Latest builds are
        generally not broadly tested and may lead to unknown issues. Always use
        FiveM&apos;s officially{" "}
        <span className="font-semibold">recommended</span> version
        {fivemRecommended ? (
          <>
            {" "}
            (the safest, most stable recommended version:{" "}
            {fivemRecommended.windowsDownload ? (
              <a
                href={fivemRecommended.windowsDownload}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500/90 hover:bg-green-500 px-1.5 py-0.5 rounded font-sans text-white font-bold no-underline"
              >
                {fivemRecommended.version}
              </a>
            ) : (
              <code className="bg-green-500/90 px-1.5 py-0.5 rounded font-sans text-white font-bold">
                {fivemRecommended.version}
              </code>
            )}
            {fivemRecommended.windowsDownload || fivemRecommended.linuxDownload
              ? " — Download: "
              : null}
            {fivemRecommended.windowsDownload ? (
              <a
                href={fivemRecommended.windowsDownload}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                Windows
              </a>
            ) : null}
            {fivemRecommended.windowsDownload && fivemRecommended.linuxDownload
              ? " · "
              : null}
            {fivemRecommended.linuxDownload ? (
              <a
                href={fivemRecommended.linuxDownload}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                Linux
              </a>
            ) : null}
            )
          </>
        ) : null}
        .
      </div>

      <div className="flex justify-between mt-10 mb-2 text-xs">
        <p className="text-gray-400">Artifacts with reported issues:</p>
        <a
          href="https://jgscripts.atlassian.net/jira/core/form/48da343c-5a4b-4bed-8c09-ef8681035299?atlOrigin=eyJpIjoiYzc1MGU3NTk4MDJjNGJkODg3NjZiNzY1NTM1M2YxN2YiLCJwIjoiaiJ9"
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
