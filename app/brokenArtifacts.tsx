"use client";

import { useMemo, useState } from "react";
import artifactDb from "@/db.json";

const BrokenArtifacts = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredArtifacts = useMemo(() => {
    return Object.entries(artifactDb.brokenArtifacts)
      .sort((a, b) => parseInt(b[0]) - parseInt(a[0]))
      .filter(([key]) => {
        if (!searchQuery) return true;
        if (searchQuery === key) return true;

        if (key.includes("-")) {
          const queryAsNumber = parseInt(searchQuery);
          if (!queryAsNumber) return false;

          const range = key.split("-").map((a) => parseInt(a));
          if (queryAsNumber >= range[0] && queryAsNumber <= range[1])
            return true;
        }

        return false;
      });
  }, [searchQuery]);

  return (
    <div>
      <div className="border border-zinc-800 p-3 mb-3 bg-zinc-950 rounded flex gap-3 items-center">
        <svg fill="#bbb" height="15px" width="15px" viewBox="0 0 488.4 488.4">
          <g>
            <g>
              <path
                d="M0,203.25c0,112.1,91.2,203.2,203.2,203.2c51.6,0,98.8-19.4,134.7-51.2l129.5,129.5c2.4,2.4,5.5,3.6,8.7,3.6
			s6.3-1.2,8.7-3.6c4.8-4.8,4.8-12.5,0-17.3l-129.6-129.5c31.8-35.9,51.2-83,51.2-134.7c0-112.1-91.2-203.2-203.2-203.2
			S0,91.15,0,203.25z M381.9,203.25c0,98.5-80.2,178.7-178.7,178.7s-178.7-80.2-178.7-178.7s80.2-178.7,178.7-178.7
			S381.9,104.65,381.9,203.25z"
              />
            </g>
          </g>
        </svg>

        <input
          type="search"
          className="flex-1 bg-transparent border-none outline-none !text-sm"
          placeholder="Search for an artifact"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          maxLength={10}
        />
      </div>

      {!filteredArtifacts.length ? (
        <div className="border border-zinc-800 p-2 mb-3 bg-zinc-900 rounded cursor-pointer">
          <code className="leading-5">
            <span className="text-xs font-sans bg-green-600 p-1 px-1 mr-1 font-bold rounded border border-opacity-30 border-zinc-900 whitespace-nowrap">
              OK
            </span>
            <span className="text-sm font-sans break-words">
              Artifact{" "}
              <strong className="text-green-500">
                &quot;{searchQuery}&quot;
              </strong>{" "}
              has not had any reported issues.
            </span>
          </code>
        </div>
      ) : (
        filteredArtifacts.map(([key, value]) => (
          <div
            key={key}
            className="border border-zinc-800 p-2 mb-3 bg-zinc-900 rounded cursor-pointer"
          >
            <code className="leading-5">
              <span className="text-xs font-sans bg-red-500 p-1 px-1 mr-1 font-bold rounded border border-opacity-30 border-zinc-900 whitespace-nowrap">
                {key}
              </span>
              <span className="text-sm font-sans break-words">{value}</span>
            </code>
          </div>
        ))
      )}
    </div>
  );
};

export default BrokenArtifacts;
