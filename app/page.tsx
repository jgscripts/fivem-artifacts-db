import Link from "next/link";
import { getArtifacts } from "@/actions/fivem";
import { downloadLinks } from "@/lib/artifacts";
import ArtifactTable from "@/components/artifactTable";
import InfoModal from "@/components/infoModal";
import { TuxIcon, WindowsIcon } from "@/components/icons";

export const revalidate = 432000;

const LINKS = {
  guide: "https://blog.jgscripts.com/updating-fivem-server-artifacts",
  github: "https://github.com/jgscripts/fivem-artifacts-db",
  report: "https://fadb-reports.internal.jgscripts.com",
};

export default async function Home() {
  const data = await getArtifacts();
  if (!data) {
    return (
      <p className="p-8 text-center text-zinc-400">
        Could not fetch artifacts data. Please try again later.
      </p>
    );
  }

  const { latest, recommended, recommendedSha } = data;
  const dl = downloadLinks(recommended, recommendedSha);

  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-zinc-50 mb-1">
            FiveM Artifacts DB
          </h1>
          <p className="text-[13px] text-zinc-500">
            An open source project by JG Scripts
          </p>
        </div>
        <nav className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 whitespace-nowrap text-sm text-zinc-400 sm:justify-start sm:gap-5">
          <a href={LINKS.guide} target="_blank" className="hover:text-zinc-200">
            Update guide
          </a>
          <Link href="/api" className="hover:text-zinc-200">
            API
          </Link>
          <a
            href={LINKS.github}
            target="_blank"
            className="hover:text-zinc-200"
          >
            GitHub
          </a>
          <a
            href={LINKS.report}
            target="_blank"
            className="rounded-full border border-zinc-700 px-4 py-2 font-semibold text-zinc-300 hover:border-zinc-500"
          >
            Report an issue
          </a>
        </nav>
      </header>

      <section className="relative mb-6 flex flex-wrap items-center justify-between gap-5 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 px-7 py-6">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_150%_at_0%_0%,rgba(16,185,129,0.16),transparent_55%),radial-gradient(60%_120%_at_45%_0%,rgba(45,212,191,0.07),transparent_60%)]"
        />
        <div className="relative">
          <p className="mb-1.5 text-sm text-zinc-400">Recommended artifact</p>
          <div className="flex items-center gap-3">
            <span className="text-4xl font-extrabold tracking-tight tabular-nums text-zinc-50">
              {recommended}
            </span>
            <InfoModal />
          </div>
          <p className="mt-2.5 flex items-center gap-2 text-sm text-zinc-400">
            <span className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.6)]" />
            No reported issues
          </p>
        </div>
        <div className="relative">
          <p className="mb-2.5 text-sm text-zinc-400">Download</p>
          <div className="flex gap-3">
            <a
              href={dl.windows}
              className="flex items-center gap-2 rounded-full bg-zinc-50 px-4 py-2 text-sm font-bold text-zinc-950"
            >
              <WindowsIcon className="h-3.5 w-3.5 fill-zinc-950" />
              Windows
            </a>
            <a
              href={dl.linux}
              className="flex items-center gap-2 rounded-full bg-zinc-50 px-4 py-2 text-sm font-bold text-zinc-950"
            >
              <TuxIcon className="h-3.5 w-3.5 fill-zinc-950" />
              Linux
            </a>
          </div>
        </div>
      </section>

      <ArtifactTable latest={latest} recommended={recommended} />

      <p className="mt-8 text-center text-xs text-zinc-600">
        &quot;FiveM&quot; is a copyright and registered trademark of Take-Two
        Interactive Software, Inc.
      </p>
    </div>
  );
}
