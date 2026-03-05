import React, { useMemo, useState } from "react";
import { useUser } from "../../../../context/useUser.js";
import Button from "../../../../components/common/Button.jsx";
import Input from "../../../../components/common/Input.jsx";
import { CONTENT_GENRES, CONTENT_TYPES, SORT_OPTIONS } from "../../../../mocks/constants.js";
import ProfilePageFrame from "./ProfilePageFrame.jsx";

export default function ProfileTabPage({ tabId, label }) {
  const { user } = useUser();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedSort, setSelectedSort] = useState("");
  const [viewMode, setViewMode] = useState("grid");

  const watchList = useMemo(() => user?.watchList || [], [user]);

  const filteredEntries = useMemo(() => {
    let list = [...watchList];

    list = list.filter((item) => item.status === tabId);

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter((item) => item.title.toLowerCase().includes(q));
    }

    if (selectedType) {
      if (selectedType === "anime") {
        list = list.filter((item) => item.category?.toLowerCase() === "anime");
      } else {
        list = list.filter((item) => item.type === selectedType);
      }
    }

    if (selectedGenre) {
      list = list.filter((item) => item.genre === selectedGenre);
    }

    if (selectedSort === "title") {
      list.sort((a, b) => a.title.localeCompare(b.title));
    } else if (selectedSort === "score") {
      list.sort((a, b) => b.score - a.score);
    } else if (selectedSort === "date") {
      list.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
    } else if (selectedSort === "duration") {
      list.sort((a, b) => (a.episode || "").localeCompare(b.episode || ""));
    }

    return list;
  }, [tabId, searchQuery, selectedType, selectedGenre, selectedSort, watchList]);

  return (
    <ProfilePageFrame>
      <div className="filters-bar">
        <div className="search-container">
          <i className="bx bx-search search-icon" aria-hidden="true"></i>
          <Input
            type="search"
            placeholder="Search your list..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
            aria-label={`Search ${label.toLowerCase()} list`}
          />
        </div>

        <div className="filter-selects">
          <select
            className="filter-select"
            aria-label="Filter by type"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            {CONTENT_TYPES.map((type) => (
              <option key={type.value || "all-types"} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>

          <select
            className="filter-select"
            aria-label="Filter by genre"
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
          >
            {CONTENT_GENRES.map((genre) => (
              <option key={genre.value || "all-genres"} value={genre.value}>
                {genre.label}
              </option>
            ))}
          </select>

          <select
            className="filter-select"
            aria-label="Sort by"
            value={selectedSort}
            onChange={(e) => setSelectedSort(e.target.value)}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value || "sort-by"} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <div className="view-toggle" role="group" aria-label="View mode">
            <button
              className={`view-toggle-btn${viewMode === "grid" ? " active" : ""}`}
              onClick={() => setViewMode("grid")}
              aria-pressed={viewMode === "grid"}
              title="Grid view"
            >
              <i className="bx bx-grid-alt" aria-hidden="true"></i>
            </button>
            <button
              className={`view-toggle-btn${viewMode === "list" ? " active" : ""}`}
              onClick={() => setViewMode("list")}
              aria-pressed={viewMode === "list"}
              title="List view"
            >
              <i className="bx bx-list-ul" aria-hidden="true"></i>
            </button>
          </div>
        </div>
      </div>

      <div className="content-panel" role="tabpanel" id={`panel-${tabId}`} aria-labelledby={`tab-${tabId}`}>
        <div className={viewMode === "grid" ? "media-grid" : "media-list"}>
          {filteredEntries.length === 0 ? (
            <div className="empty-state">
              <i className="bx bx-inbox empty-icon" aria-hidden="true"></i>
              <p className="empty-message">No entries found in {label.toLowerCase()}</p>
              <Button variant="secondary" size="small">
                <i className="bx bx-plus" aria-hidden="true"></i>
                Add Title
              </Button>
            </div>
          ) : viewMode === "grid" ? (
            filteredEntries.map((entry) => (
              <div key={entry.id} className="media-card">
                <div className="media-card-poster-wrap">
                  {entry.poster ? (
                    <img className="media-card-poster" src={entry.poster} alt={entry.title} loading="lazy" />
                  ) : (
                    <div className="media-card-poster media-card-poster--placeholder">
                      <i className="bx bx-film" aria-hidden="true"></i>
                    </div>
                  )}
                  {entry.score != null && (
                    <span className="media-card-score">
                      <i className="bx bxs-star" aria-hidden="true"></i>
                      {entry.score}
                    </span>
                  )}
                </div>
                <div className="media-card-body">
                  <span className="media-card-title">{entry.title}</span>
                  <div className="media-card-meta">
                    {entry.type && <span className="media-card-badge">{entry.type}</span>}
                    {entry.episode && entry.episode !== "-" && (
                      <span className="media-card-episode">{entry.episode}</span>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            filteredEntries.map((entry) => (
              <div key={entry.id} className="media-row">
                {entry.poster ? (
                  <img className="media-row-poster" src={entry.poster} alt={entry.title} loading="lazy" />
                ) : (
                  <div className="media-row-poster media-row-poster--placeholder">
                    <i className="bx bx-film" aria-hidden="true"></i>
                  </div>
                )}
                <div className="media-row-info">
                  <span className="media-row-title">{entry.title}</span>
                  <div className="media-row-meta">
                    {entry.type && <span className="media-card-badge">{entry.type}</span>}
                    {entry.genre && <span className="media-row-genre">{entry.genre}</span>}
                    {entry.episode && entry.episode !== "-" && (
                      <span className="media-card-episode">{entry.episode}</span>
                    )}
                  </div>
                </div>
                {entry.score != null && (
                  <span className="media-row-score">
                    <i className="bx bxs-star" aria-hidden="true"></i>
                    {entry.score}
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </ProfilePageFrame>
  );
}
