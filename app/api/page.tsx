import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "API - FiveM Artifacts DB",
  description: "Free JSON API for checking FiveM artifacts for known issues",
};

const InlineCode = ({ children }: { children: React.ReactNode }) => (
  <code className="rounded bg-zinc-800/80 px-1.5 py-0.5 font-mono text-[13px] text-zinc-200">
    {children}
  </code>
);

const CodeBlock = ({ children }: { children: string }) => (
  <pre className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900 p-4 font-mono text-[13px] leading-relaxed text-zinc-300">
    <code>{children}</code>
  </pre>
);

const Endpoint = ({ path, deprecated }: { path: string; deprecated?: boolean }) => (
  <div className="mb-3 flex items-center gap-3">
    <span className="rounded-full bg-green-500/15 px-2.5 py-1 text-[11px] font-bold tracking-wider text-green-400">
      GET
    </span>
    <code className="font-mono text-base font-semibold text-zinc-50">{path}</code>
    {deprecated && (
      <span className="rounded-full bg-amber-500/15 px-2.5 py-1 text-[11px] font-bold tracking-wider text-amber-400">
        DEPRECATED
      </span>
    )}
  </div>
);

const Label = ({ children }: { children: string }) => (
  <p className="mb-1 mt-6 text-sm font-semibold text-zinc-50">{children}</p>
);

const Field = ({
  name,
  type,
  children,
}: {
  name: string;
  type: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-1 border-t border-zinc-800 py-3 first:border-t-0 sm:flex-row sm:items-baseline sm:gap-4">
    <div className="w-56 shrink-0">
      <InlineCode>{name}</InlineCode>{" "}
      <span className="text-xs text-zinc-500">{type}</span>
    </div>
    <p className="text-sm leading-relaxed text-zinc-400">{children}</p>
  </div>
);

export default function ApiPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-10">
      <Link
        href="/"
        className="mb-10 inline-flex items-center gap-2 rounded-full border border-zinc-700 px-4 py-2 text-sm font-semibold text-zinc-300 hover:border-zinc-500 hover:text-zinc-50"
      >
        ← Back to Artifacts DB
      </Link>

      <h1 className="mb-2 text-xl font-extrabold tracking-tight text-zinc-50">API</h1>
      <p className="mb-12 text-sm leading-relaxed text-zinc-400">
        Free JSON API, no authentication required. Base URL:{" "}
        <InlineCode>https://artifacts.jgscripts.com</InlineCode>
      </p>

      <section className="mb-12">
        <Endpoint path="/check" />
        <p className="text-sm leading-relaxed text-zinc-400">
          Check a specific artifact for reported issues.
        </p>

        <Label>Query parameters</Label>
        <Field name="artifact" type="string, required">
          The artifact number to look up.
        </Field>

        <Label>Returns</Label>
        <p className="mb-3 text-sm leading-relaxed text-zinc-400">
          <InlineCode>status</InlineCode> is either <InlineCode>OK</InlineCode> or{" "}
          <InlineCode>BROKEN</InlineCode>. Broken artifacts also include a{" "}
          <InlineCode>reason</InlineCode>.
        </p>
        <div className="space-y-3">
          <CodeBlock>{`GET /check?artifact=8509

{
  "status": "BROKEN",
  "reason": "State bags not replicated to clients"
}`}</CodeBlock>
          <CodeBlock>{`GET /check?artifact=35265

{
  "status": "OK"
}`}</CodeBlock>
        </div>
      </section>

      <section className="mb-12">
        <Endpoint path="/jsonv2" />
        <p className="text-sm leading-relaxed text-zinc-400">
          Returns the recommended artifact, its download links and the full list of artifacts
          with reported issues.
        </p>

        <Label>Returns</Label>
        <div className="mb-4">
          <Field name="recommendedArtifact" type="string">
            The latest artifact with no reported issues.
          </Field>
          <Field name="windowsDownloadLink" type="string">
            Direct download URL for the Windows server build.
          </Field>
          <Field name="linuxDownloadLink" type="string">
            Direct download URL for the Linux server build.
          </Field>
          <Field name="brokenArtifacts" type="array">
            Artifacts with reported issues, sorted by artifact number.{" "}
            <InlineCode>artifact</InlineCode> is a single number or a range like{" "}
            <InlineCode>10268-10309</InlineCode>.
          </Field>
        </div>
        <CodeBlock>{`{
  "recommendedArtifact": "35265",
  "windowsDownloadLink": "https://runtime.fivem.net/artifacts/fivem/...",
  "linuxDownloadLink": "https://runtime.fivem.net/artifacts/fivem/...",
  "brokenArtifacts": [
    { "artifact": "8509", "reason": "State bags not replicated to clients" },
    { "artifact": "10268-10309", "reason": "..." }
  ]
}`}</CodeBlock>
      </section>

      <section className="mb-12">
        <Endpoint path="/json" deprecated />
        <p className="text-sm leading-relaxed text-zinc-400">
          The old version of <InlineCode>/jsonv2</InlineCode>. It returns the same data, but{" "}
          <InlineCode>brokenArtifacts</InlineCode> is an object keyed by artifact number instead
          of an array. Use <InlineCode>/jsonv2</InlineCode> for anything new.
        </p>
      </section>

      <p className="text-sm leading-relaxed text-zinc-500">
        Want to check your artifact version every time your server starts?{" "}
        <a
          href="https://github.com/jgscripts/jg-artifactcheck"
          target="_blank"
          className="text-zinc-300 underline decoration-zinc-600 underline-offset-2 hover:text-zinc-50"
        >
          jg-artifactcheck
        </a>{" "}
        is a small FiveM resource that does exactly that.
      </p>
    </div>
  );
}
