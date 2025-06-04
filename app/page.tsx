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
        无法获取构建版本数据，请稍后重试。
      </div>
    );

  return (
    <div className="max-w-[600px] min-w-[300px] p-5 mx-auto">
      <div className="my-6 text-center">
        <h1 className="text-3xl font-bold mb-2">FiveM 构建版本数据库</h1>
        <p className="text-[12px] text-gray-400">
          由 JG Scripts 开发的开源项目。{" "}
          <a
            href="https://github.com/jgscripts/fivem-artifacts-db"
            target="_blank"
            className="text-blue-500 hover:underline"
          >
            在 GitHub 上查看
          </a>
        </p>
      </div>

      <div className="border border-zinc-800 bg-zinc-900 p-3 px-4 mb-5 text-lg rounded text-center">
        <p>
          <span>
            最新<sup className="text-blue-400 font-bold">*</sup>无已知问题的构建版本
          </span>
          <code className="bg-green-500 p-1 px-2 ml-2 font-bold rounded font-sans text-white">
            {data.recommendedArtifact}
          </code>
        </p>
        <div className="flex gap-3 justify-center text-lg mt-1">
          <p className="font-semibold">下载：</p>
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
          *注意：
        </span>
        最新的构建版本不会立即被推荐，需要等待一段时间以便收集问题反馈。
      </div>

      <div className="flex justify-between mt-10 mb-2 text-xs">
        <p className="text-gray-400">有已知问题的构建版本：</p>
        <a
          href="https://jgscripts.com/artifact-report"
          target="_blank"
          className="underline text-blue-500"
        >
          发现问题？点击这里报告
        </a>
      </div>

      <BrokenArtifacts />
    </div>
  );
}
