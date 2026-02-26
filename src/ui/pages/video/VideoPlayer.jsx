import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "../../../context/useUser.js";
import { useToast } from "../../../hooks/useToast.js";
import { MOCK_MEDIA_LIBRARY, MOCK_VIDEOS } from "../../../utils/constants.js";
import "./VideoPlayer.css";

const LIST_OPTIONS = [
  { value: "watching", label: "Watching" },
  { value: "planned", label: "Planned" },
  { value: "completed", label: "Completed" },
  { value: "dropped", label: "Dropped" },
  { value: "favorites", label: "Favorites" },
];

function formatClock(totalSeconds) {
  const safe = Math.max(0, Math.floor(totalSeconds || 0));
  const h = Math.floor(safe / 3600);
  const m = Math.floor((safe % 3600) / 60);
  const s = safe % 60;
  if (h > 0) return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function VideoPlayer() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, updateUser } = useUser();
  const toast = useToast();
  const videoRef = useRef(null);
  const didToastRef = useRef(false);
  const [selectedListManual, setSelectedListManual] = useState("");

  const videoItem = useMemo(() => MOCK_VIDEOS.find((item) => item.id === id) || null, [id]);

  const selectedList = useMemo(() => {
    const existing = (user?.watchList || []).find((item) => item.id === videoItem?.id);
    return selectedListManual || existing?.status || "planned";
  }, [selectedListManual, user, videoItem]);

  const persistHistory = useCallback(() => {
    if (!videoItem || !user) return;
    const currentTime = Math.floor(videoRef.current?.currentTime || 0);
    const progress = formatClock(currentTime);
    const duration = Math.max(1, Math.floor(videoRef.current?.duration || videoItem.durationSec || 1));
    const watchedRatio = currentTime / duration;
    const historyEntry = {
      id: `h-${videoItem.id}`,
      mediaId: videoItem.id,
      title: videoItem.title,
      category: videoItem.category,
      series: videoItem.series || "-",
      episode: videoItem.episode || "-",
      watchedAt: new Date().toISOString(),
      progress,
    };

    const previousHistory = user.watchHistory || [];
    const nextHistory = [
      historyEntry,
      ...previousHistory.filter((entry) => entry.id !== historyEntry.id),
    ].slice(0, 80);

    const previousList = user.watchList || [];
    const existingItem = previousList.find((item) => item.id === videoItem.id);
    const preserveStatus =
      existingItem?.status === "favorites" || existingItem?.status === "dropped";
    const computedStatus = watchedRatio >= 0.95 ? "completed" : currentTime > 0 ? "watching" : "planned";
    const nextStatus = preserveStatus ? existingItem.status : computedStatus;

    const baseItem = existingItem || {
      id: videoItem.id,
      title: videoItem.title,
      category: videoItem.category,
      type: videoItem.type,
      genre: videoItem.genre,
      score: 0,
      dateAdded: new Date().toISOString().slice(0, 10),
      season: videoItem.series || "-",
      episode: videoItem.episode || "-",
    };

    const updatedItem = {
      ...baseItem,
      season: videoItem.series || baseItem.season || "-",
      episode: videoItem.episode || baseItem.episode || "-",
      progress,
      status: nextStatus,
    };

    const nextWatchList = existingItem
      ? previousList.map((item) => (item.id === videoItem.id ? updatedItem : item))
      : [updatedItem, ...previousList];

    const previousProgress = user.watchProgress || {};
    updateUser({
      watchHistory: nextHistory,
      watchList: nextWatchList,
      watchProgress: {
        ...previousProgress,
        [videoItem.id]: currentTime,
      },
    });
  }, [updateUser, user, videoItem]);

  useEffect(() => {
    if (!videoItem || !user) return undefined;
    const progressAtOpen = user.watchProgress?.[videoItem.id] || 0;
    const videoEl = videoRef.current;
    if (videoEl && progressAtOpen > 0) {
      const setSavedTime = () => {
        videoEl.currentTime = progressAtOpen;
      };
      videoEl.addEventListener("loadedmetadata", setSavedTime, { once: true });
    }

    const onBeforeUnload = () => persistHistory();
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => {
      persistHistory();
      window.removeEventListener("beforeunload", onBeforeUnload);
    };
  }, [persistHistory, user, videoItem]);

  const handleAssignList = useCallback(() => {
    if (!videoItem || !user) return;
    const baseItem =
      (user.watchList || []).find((item) => item.id === videoItem.id) ||
      MOCK_MEDIA_LIBRARY.find((item) => item.id === videoItem.id) || {
        id: videoItem.id,
        title: videoItem.title,
        category: videoItem.category,
        type: videoItem.type,
        genre: videoItem.genre,
        score: 0,
        dateAdded: new Date().toISOString().slice(0, 10),
        season: videoItem.series || "-",
        episode: videoItem.episode || "-",
        progress: formatClock(videoRef.current?.currentTime || 0),
      };

    const updatedItem = {
      ...baseItem,
      status: selectedList,
      season: videoItem.series || baseItem.season || "-",
      episode: videoItem.episode || baseItem.episode || "-",
      progress: formatClock(videoRef.current?.currentTime || 0),
    };

    const watchList = user.watchList || [];
    const nextWatchList = watchList.some((item) => item.id === updatedItem.id)
      ? watchList.map((item) => (item.id === updatedItem.id ? updatedItem : item))
      : [updatedItem, ...watchList];

    updateUser({ watchList: nextWatchList });
    if (!didToastRef.current) {
      toast.success(`Added to ${selectedList}`);
      didToastRef.current = true;
      setTimeout(() => {
        didToastRef.current = false;
      }, 700);
    }
  }, [selectedList, toast, updateUser, user, videoItem]);

  if (!videoItem) {
    return (
      <div className="video-player-page">
        <div className="video-player-shell">
          <button className="video-back-btn" type="button" onClick={() => navigate(-1)}>
            <i className="bx bx-arrow-back"></i>
            Back
          </button>
          <h1>Video not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="video-player-page">
      <div className="video-player-shell">
        <button className="video-back-btn" type="button" onClick={() => navigate(-1)}>
          <i className="bx bx-arrow-back"></i>
          Back
        </button>

        <div className="video-header">
          <h1>{videoItem.title}</h1>
          <p>
            {videoItem.category} | {videoItem.series} {videoItem.episode !== "-" ? `| ${videoItem.episode}` : ""}
          </p>
        </div>

        <div className="video-stage">
          <video
            ref={videoRef}
            controls
            className="video-element"
            src={videoItem.src}
            onPause={persistHistory}
            onEnded={persistHistory}
          />
        </div>

        <section className="video-list-panel">
          <h2>Choose List</h2>
          <div className="video-list-controls">
            <select value={selectedList} onChange={(e) => setSelectedListManual(e.target.value)}>
              {LIST_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <button type="button" onClick={handleAssignList}>
              Save in List
            </button>
          </div>
          <p>When you pause or leave this page, history is updated with the current stop moment.</p>
        </section>
      </div>
    </div>
  );
}
