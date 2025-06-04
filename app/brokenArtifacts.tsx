"use client";

import { useMemo, useState, useEffect } from "react";
import artifactDb from "@/db.json";

const BrokenArtifacts = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const itemsPerPage = 10;

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

  // Reset to first page when search changes
  useMemo(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const totalPages = Math.ceil(filteredArtifacts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentArtifacts = filteredArtifacts.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page === currentPage || isTransitioning) return;
    
    setIsTransitioning(true);
    
    // Add a small delay to allow fade out animation
    setTimeout(() => {
      setCurrentPage(page);
      // Reset transition state after content changes
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 150);
  };

  const renderPaginationButtons = () => {
    if (totalPages <= 1) return null;

    const buttons = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Previous button
    if (currentPage > 1) {
      buttons.push(
        <button
          key="prev"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={isTransitioning}
          className="px-3 py-1 text-sm bg-zinc-800 hover:bg-zinc-700 text-white rounded transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ←
        </button>
      );
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          disabled={isTransitioning}
          className={`px-3 py-1 text-sm rounded transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
            i === currentPage
              ? "bg-blue-600 text-white shadow-lg"
              : "bg-zinc-800 hover:bg-zinc-700 text-white"
          }`}
        >
          {i}
        </button>
      );
    }

    // Next button
    if (currentPage < totalPages) {
      buttons.push(
        <button
          key="next"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={isTransitioning}
          className="px-3 py-1 text-sm bg-zinc-800 hover:bg-zinc-700 text-white rounded transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          →
        </button>
      );
    }

    return buttons;
  };

  return (
    <div>
      <div className="border border-zinc-800 p-3 mb-4 bg-zinc-950 rounded flex gap-3 items-center">
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
          placeholder="搜索构建版本"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          maxLength={10}
        />
      </div>

      {/* Results summary */}
      {searchQuery && (
        <div className="mb-3 text-xs text-gray-400 transition-opacity duration-300">
          {filteredArtifacts.length > 0 
            ? `找到 ${filteredArtifacts.length} 个结果`
            : '未找到结果'
          }
        </div>
      )}

      {!searchQuery && filteredArtifacts.length > 0 && (
        <div className="mb-3 text-xs text-gray-400 transition-opacity duration-300">
          显示第 {startIndex + 1}-{Math.min(endIndex, filteredArtifacts.length)} 项，共 {filteredArtifacts.length} 个构建版本
        </div>
      )}

      {!filteredArtifacts.length && searchQuery ? (
        <div className="border border-zinc-800 p-3 mb-4 bg-zinc-900 rounded animate-fade-in">
          <div className="flex items-start gap-2">
            <span className="text-xs font-sans bg-green-600 p-1 px-2 font-bold rounded border border-opacity-30 border-zinc-900 whitespace-nowrap flex-shrink-0">
              OK
            </span>
            <span className="text-sm font-sans break-words">
              构建版本{" "}
              <strong className="text-green-500">
                &quot;{searchQuery}&quot;
              </strong>{" "}
              暂无已知问题。
            </span>
          </div>
        </div>
      ) : (
        <>
          <div 
            className={`space-y-2 mb-4 transition-all duration-300 ${
              isTransitioning 
                ? 'opacity-0 transform translate-y-2' 
                : 'opacity-100 transform translate-y-0'
            }`}
            style={{ minHeight: '400px' }}
          >
            {currentArtifacts.map(([key, value], index) => (
              <div
                key={key}
                className="border border-zinc-800 p-3 bg-zinc-900 rounded hover:bg-zinc-800 transition-all duration-200 hover:scale-[1.01] hover:shadow-lg animate-slide-in"
                style={{ 
                  animationDelay: `${index * 50}ms`,
                  animationFillMode: 'both'
                }}
              >
                <div className="flex items-start gap-2">
                  <span className="text-xs font-sans bg-red-500 p-1 px-2 font-bold rounded border border-opacity-30 border-zinc-900 whitespace-nowrap flex-shrink-0">
                    {key}
                  </span>
                  <span className="text-sm font-sans break-words leading-relaxed">
                    {value}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              {renderPaginationButtons()}
            </div>
          )}

          {/* Page info */}
          {totalPages > 1 && (
            <div className="text-center text-xs text-gray-400 mt-3 transition-opacity duration-300">
              第 {currentPage} 页，共 {totalPages} 页
            </div>
          )}
        </>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.4s ease-out;
        }

        .animate-slide-in {
          animation: slide-in 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

export default BrokenArtifacts;
