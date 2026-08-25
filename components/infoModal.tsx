"use client";

import { useRef } from "react";

export default function InfoModal() {
  const ref = useRef<HTMLDialogElement>(null);
  return (
    <>
      <button
        onClick={() => ref.current?.showModal()}
        aria-label="How the recommendation works"
        className="flex h-6 w-6 items-center justify-center rounded-full border border-zinc-700 text-xs font-bold text-zinc-500 hover:border-zinc-500 hover:text-zinc-50"
      >
        ?
      </button>
      <dialog
        ref={ref}
        onClick={(e) => e.target === ref.current && ref.current?.close()}
        className="rounded-2xl border border-zinc-700 bg-zinc-900 p-0 text-zinc-200 backdrop:bg-black/65"
      >
        <div className="max-w-sm p-7">
          <h2 className="mb-2.5 text-lg font-bold text-zinc-50">
            How the recommendation works
          </h2>
          <p className="mb-5 text-sm leading-relaxed text-zinc-400">
            When a new artifact is released it isn&apos;t recommended straight away.
            It waits a short period so server owners have time to report problems.
            The recommended artifact is the newest one that has cleared that window
            with no reported issues.
          </p>
          <button
            onClick={() => ref.current?.close()}
            className="rounded-full bg-zinc-50 px-5 py-2 text-sm font-bold text-zinc-950"
          >
            Got it
          </button>
        </div>
      </dialog>
    </>
  );
}
