import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useUser } from '../../../context/useUser.js'
import { useToast } from '../../../hooks/useToast.js'
import { useApiQuery } from '../../../hooks/useApiQuery.js'
import { cadlixApi } from '../../../api/cadlixApi.js'
import { mapContentDTO } from '../../../api/mappers.js'
import './VideoPlayer.css'

const LIST_OPTIONS = [
  { value: 'watching', label: 'Watching' },
  { value: 'planned', label: 'Planned' },
  { value: 'completed', label: 'Completed' },
  { value: 'dropped', label: 'Dropped' },
  { value: 'favorites', label: 'Favorites' },
]

const QUALITY_OPTIONS = ['1080p', '720p', '480p', '360p', 'Auto']
const SPEED_OPTIONS = ['0.5x', '0.75x', '1x', '1.25x', '1.5x', '2x']

function formatClock(totalSeconds) {
  const safe = Number.isFinite(totalSeconds) ? Math.max(0, Math.floor(totalSeconds)) : 0
  const h = Math.floor(safe / 3600)
  const m = Math.floor((safe % 3600) / 60)
  const s = safe % 60
  if (h > 0)
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export default function VideoPlayer() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { user, updateUser, refreshUser } = useUser()
  const toast = useToast()
  const { data: contentResponse, loading, error } = useApiQuery(
    () => cadlixApi.getContentById(id),
    [id],
    null
  )

  const videoRef = useRef(null)
  const containerRef = useRef(null)
  const [selectedListManual, setSelectedListManual] = useState('')

  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [quality, setQuality] = useState('Auto')
  const [playbackSpeed, setPlaybackSpeed] = useState('1x')
  const [showCaptions, setShowCaptions] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showSaveMenu, setShowSaveMenu] = useState(false)
  const [showNextPrompt, setShowNextPrompt] = useState(false)

  const controlsTimeoutRef = useRef(null)
  const historyEntryIdRef = useRef(null)
  const restoredRef = useRef(false)
  const completedRef = useRef(false)

  const videoItem = useMemo(() => {
    if (!contentResponse) return null
    const mapped = mapContentDTO(contentResponse)
    if (!mapped) return null

    const genreDisplay = Array.isArray(mapped.genres) ? mapped.genres.join(', ') : (mapped.genres || '')
    const countryDisplay = Array.isArray(mapped.country) ? mapped.country.join(', ') : (mapped.country || '')

    const sources = mapped.videoSources || null

    return {
      id: mapped.id,
      title: mapped.title,
      category: mapped.category || (mapped.type === 'tv' ? 'Series' : 'Movie'),
      series: mapped.series || '-',
      episode: mapped.episode || '-',
      type: mapped.type || 'movie',
      genre: genreDisplay,
      country: countryDisplay,
      durationSec: mapped.durationSeconds || 600,
      src: mapped.videoSource || '',
      sources,
    }
  }, [contentResponse])

  const isSeries = videoItem && videoItem.series && videoItem.series !== '-'

  const { data: episodes, loading: episodesLoading } = useApiQuery(
    () => isSeries ? cadlixApi.getSeriesEpisodes(videoItem.series) : Promise.resolve([]),
    [videoItem?.series],
    []
  )

  const currentEpisodeIndex = useMemo(() => {
    if (!isSeries || !episodes) return -1
    return episodes.findIndex(e =>
      String(e.Id ?? e.id) === String(videoItem.id)
    )
  }, [isSeries, episodes, videoItem])

  const nextEpisode = useMemo(() => {
    if (currentEpisodeIndex < 0 || currentEpisodeIndex >= (episodes?.length || 0) - 1) return null
    return episodes[currentEpisodeIndex + 1]
  }, [currentEpisodeIndex, episodes])

  const selectedList = useMemo(() => {
    const existing = (user?.watchList || []).find(item => String(item.id) === String(videoItem?.id))
    return selectedListManual || existing?.status || 'planned'
  }, [selectedListManual, user, videoItem])

  const handlePlayPause = useCallback(() => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play()
        setIsPlaying(true)
      } else {
        videoRef.current.pause()
        setIsPlaying(false)
      }
    }
  }, [])

  const handleTimeUpdate = useCallback(() => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }, [])

  const handleLoadedMetadata = useCallback(() => {
    if (videoRef.current) {
      const d = videoRef.current.duration
      setDuration(Number.isFinite(d) ? d : (videoItem?.durationSec || 0))
    }
  }, [videoItem])

  const handleDurationChange = useCallback(() => {
    if (videoRef.current) {
      const d = videoRef.current.duration
      if (Number.isFinite(d)) {
        setDuration(d)
      }
    }
  }, [])

  const handleSeek = useCallback(
    e => {
      if (videoRef.current) {
        const rect = e.currentTarget.getBoundingClientRect()
        const percent = (e.clientX - rect.left) / rect.width
        const dur = Number.isFinite(duration) ? duration : (videoItem?.durationSec || 0)
        const newTime = percent * dur
        videoRef.current.currentTime = newTime
        setCurrentTime(newTime)
      }
    },
    [duration, videoItem]
  )

  const handleVolumeChange = useCallback(e => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    if (videoRef.current) {
      videoRef.current.volume = newVolume
    }
    setIsMuted(newVolume === 0)
  }, [])

  const toggleMute = useCallback(() => {
    if (videoRef.current) {
      if (isMuted) {
        videoRef.current.volume = volume || 0.5
        videoRef.current.muted = false
        setIsMuted(false)
      } else {
        videoRef.current.muted = true
        setIsMuted(true)
      }
    }
  }, [isMuted, volume])

  const handleSpeedChange = useCallback(speed => {
    setPlaybackSpeed(speed)
    if (videoRef.current) {
      videoRef.current.playbackRate = parseFloat(speed)
    }
    setShowSettings(false)
  }, [])

  const handleQualityChange = useCallback(q => {
    setQuality(q)
    setShowSettings(false)
    if (videoRef.current && videoItem?.sources?.[q]) {
      const wasPlaying = !videoRef.current.paused
      const prevTime = videoRef.current.currentTime
      videoRef.current.src = videoItem.sources[q]
      videoRef.current.currentTime = prevTime
      if (wasPlaying) videoRef.current.play()
    }
  }, [videoItem])

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }, [])

  const handleMouseMove = useCallback(() => {
    setShowControls(true)
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false)
      }
    }, 3000)
  }, [isPlaying])

  const persistHistory = useCallback(async () => {
    if (!videoItem || !user?.id) return
    const currentTimeSec = Math.floor(videoRef.current?.currentTime || 0)
    const progress = formatClock(currentTimeSec)
    const rawDur = videoRef.current?.duration
    const dur = Math.max(1, Math.floor(Number.isFinite(rawDur) ? rawDur : (videoItem.durationSec || 1)))
    const watchedRatio = currentTimeSec / dur
    const progressPercentage = Math.round((currentTimeSec / dur) * 100)

    const isCompleted = watchedRatio >= 0.95

    const historyEntry = {
      userId: user.id,
      movieId: parseInt(videoItem.id) || 0,
      movieTitle: videoItem.title,
      category: videoItem.category,
      series: videoItem.series || '-',
      episode: videoItem.episode || '-',
      watchedAt: new Date().toISOString(),
      watchStatus: isCompleted ? 'completed' : currentTimeSec > 0 ? 'watching' : 'planned',
      progressPercentage,
      progress,
    }

    try {
      if (historyEntryIdRef.current) {
        await cadlixApi.updateHistory(historyEntryIdRef.current, historyEntry)
      } else {
        const created = await cadlixApi.createHistory(historyEntry)
        if (created?.id) historyEntryIdRef.current = created.id
      }
    } catch (err) {
      console.error('Failed to persist history:', err)
    }

    if (isCompleted && !completedRef.current) {
      completedRef.current = true
      try {
        const lists = await cadlixApi.getLists(user.id)
        const entry = lists?.find(l => String(l.FilmId ?? l.filmId) === String(videoItem.id))
        if (entry && (entry.FilmStatus ?? entry.filmStatus) === 'watching') {
          await cadlixApi.updateListStatus(entry.Id ?? entry.id, 'completed')
          refreshUser()
        }
      } catch (err) {
        console.error('Failed to update watch list on completion:', err)
      }
    }

    const previousProgress = user.watchProgress || {}
    updateUser({
      watchProgress: {
        ...previousProgress,
        [videoItem.id]: currentTimeSec,
      },
    })
  }, [updateUser, refreshUser, user, videoItem])

  const navigateToEpisode = useCallback(ep => {
    const epId = ep.Id ?? ep.id
    if (epId) navigate(`/watch/${epId}`)
  }, [navigate])

  const handleVideoEnded = useCallback(async () => {
    if (!user?.id || !videoItem || completedRef.current) return
    completedRef.current = true
    try {
      const lists = await cadlixApi.getLists(user.id)
      const entry = lists?.find(l => String(l.FilmId ?? l.filmId) === String(videoItem.id))
      if (entry && (entry.FilmStatus ?? entry.filmStatus) === 'watching') {
        await cadlixApi.updateListStatus(entry.Id ?? entry.id, 'completed')
        refreshUser()
      }
    } catch (err) {
      console.error('Failed to update watch list on video end:', err)
    }
    if (nextEpisode) setShowNextPrompt(true)
  }, [user, videoItem, refreshUser, nextEpisode])

  useEffect(() => {
    if (!videoItem || !user || restoredRef.current) return
    const progressAtOpen = user.watchProgress?.[videoItem.id] || 0
    const videoEl = videoRef.current
    if (!videoEl || progressAtOpen <= 0) return

    restoredRef.current = true

    const setSavedTime = () => {
      videoEl.currentTime = progressAtOpen
      setCurrentTime(progressAtOpen)
    }

    if (videoEl.readyState >= 1) {
      setSavedTime()
    } else {
      videoEl.addEventListener('loadedmetadata', setSavedTime, { once: true })
    }
  }, [user, videoItem])

  useEffect(() => {
    const interval = setInterval(persistHistory, 5000)
    return () => clearInterval(interval)
  }, [persistHistory])

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  const handleAssignList = useCallback(async (status) => {
    if (!videoItem || !user?.id) return

    const listEntry = {
      userId: user.id,
      filmId: parseInt(videoItem.id) || 0,
      filmTitle: videoItem.title,
      type: videoItem.type,
      category: videoItem.category,
      genre: videoItem.genre,
      episode: videoItem.episode || '-',
      filmStatus: status,
      filmRating: 0,
    }

    try {
      await cadlixApi.createList(listEntry)
      await refreshUser()
      toast.success(`Added to ${status}`)
    } catch (err) {
      console.error('Failed to add to list:', err)
      toast.error('Failed to update list')
    }
  }, [toast, refreshUser, user, videoItem])

  if (loading) {
    return (
      <div className='video-player-page'>
        <div className='video-player-shell'>
          <button className='video-back-btn' type='button' onClick={() => navigate(-1)}>
            <i className='bx bx-arrow-back'></i>
            Back
          </button>
          <h1>Loading...</h1>
        </div>
      </div>
    )
  }

  if (error || !videoItem) {
    return (
      <div className='video-player-page'>
        <div className='video-player-shell'>
          <button className='video-back-btn' type='button' onClick={() => navigate(-1)}>
            <i className='bx bx-arrow-back'></i>
            Back
          </button>
          <h1>Video not found</h1>
        </div>
      </div>
    )
  }

  const dur = Number.isFinite(duration) && duration > 0 ? duration : videoItem?.durationSec || 0
  const progressPercent = dur > 0 ? Math.min((currentTime / dur) * 100, 100) : 0

  return (
    <div
      className={`video-player-page ${isFullscreen ? 'fullscreen' : ''}`}
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      <div className={`video-player-shell ${isFullscreen ? 'fullscreen' : ''}`}>
        {!isFullscreen && (
          <button className='video-back-btn' type='button' onClick={() => navigate(-1)}>
            <i className='bx bx-arrow-back'></i>
            Back
          </button>
        )}

        {!isFullscreen && (
          <div className='video-header'>
            <div className='video-header-top'>
              <h1>{videoItem.title}</h1>
              <div className='video-save-wrapper'>
                <button
                  className='video-save-btn'
                  onClick={() => setShowSaveMenu(!showSaveMenu)}
                  aria-label='Save to list'
                >
                  <i className='bx bx-bookmark-plus'></i>
                </button>
                {showSaveMenu && (
                  <div className='video-save-menu'>
                    <div className='video-save-menu-header'>Save to list</div>
                    {LIST_OPTIONS.map(option => (
                      <button
                        key={option.value}
                        className={`video-save-option ${selectedList === option.value ? 'active' : ''}`}
                        onClick={() => {
                          setSelectedListManual(option.value)
                          handleAssignList(option.value)
                          setShowSaveMenu(false)
                        }}
                      >
                        <i className={`bx ${selectedList === option.value ? 'bxs-bookmark' : 'bx-bookmark'}`}></i>
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <p>
              {videoItem.category} | {videoItem.series}{' '}
              {videoItem.episode !== '-' ? `| ${videoItem.episode}` : ''}
            </p>
          </div>
        )}

        <div className={`video-stage ${isFullscreen ? 'fullscreen' : ''}`}>
          {videoItem.src ? (
            <video
              ref={videoRef}
              className='video-element'
              src={videoItem.src}
              onClick={handlePlayPause}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onDurationChange={handleDurationChange}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={handleVideoEnded}
            />
          ) : (
            <div className='video-no-source'>
              <i className='bx bx-error-circle'></i>
              <p>Video source not available</p>
            </div>
          )}

          <div className={`video-controls ${showControls ? 'visible' : ''}`} onClick={e => e.stopPropagation()}>
            <div className='video-progress-container' onClick={handleSeek}>
              <div className='video-progress-bar'>
                <div className='video-progress-fill' style={{ width: `${progressPercent}%` }} />
                <div className='video-progress-thumb' style={{ left: `${progressPercent}%` }} />
              </div>
            </div>

            <div className='video-controls-bottom'>
              <div className='video-controls-left'>
                <button className='video-control-btn' onClick={handlePlayPause}>
                  <i className={`bx ${isPlaying ? 'bx-pause' : 'bx-play'}`}></i>
                </button>

                <div className='video-volume'>
                  <button className='video-control-btn' onClick={toggleMute}>
                    <i className={`bx ${isMuted ? 'bx-volume-mute' : 'bx-volume-full'}`}></i>
                  </button>
                  <input
                    type='range'
                    min='0'
                    max='1'
                    step='0.1'
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className='video-volume-slider'
                  />
                </div>

                <span className='video-time'>
                  {formatClock(currentTime)} / {formatClock(duration)}
                </span>
              </div>

              <div className='video-controls-right'>
                <button
                  className={`video-control-btn ${showCaptions ? 'active' : ''}`}
                  onClick={() => setShowCaptions(!showCaptions)}
                >
                  <i className='bx bx-closed-captioning'></i>
                </button>

                <div className='video-settings-wrapper'>
                  <button
                    className='video-control-btn'
                    onClick={() => setShowSettings(!showSettings)}
                  >
                    <i className='bx bx-cog'></i>
                  </button>

                  {showSettings && (
                    <div className='video-settings-menu'>
                      <div className='video-settings-section'>
                        <span className='video-settings-label'>Quality</span>
                        <div className='video-settings-options'>
                          {QUALITY_OPTIONS.map(q => (
                            <button
                              key={q}
                              className={`video-settings-option ${quality === q ? 'active' : ''}`}
                              onClick={() => handleQualityChange(q)}
                            >
                              {q}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className='video-settings-section'>
                        <span className='video-settings-label'>Speed</span>
                        <div className='video-settings-options'>
                          {SPEED_OPTIONS.map(s => (
                            <button
                              key={s}
                              className={`video-settings-option ${playbackSpeed === s ? 'active' : ''}`}
                              onClick={() => handleSpeedChange(s)}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <button className='video-control-btn' onClick={toggleFullscreen}>
                  <i className={`bx ${isFullscreen ? 'bx-exit-fullscreen' : 'bx-fullscreen'}`}></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        {showNextPrompt && nextEpisode && (
          <div className='video-next-prompt'>
            <p>Next episode ready</p>
            <button onClick={() => navigateToEpisode(nextEpisode)}>
              <i className='bx bx-skip-next'></i> {nextEpisode.Title ?? nextEpisode.title}
            </button>
            <button className='video-next-dismiss' onClick={() => setShowNextPrompt(false)}>
              Dismiss
            </button>
          </div>
        )}

        {isSeries && episodes && episodes.length > 0 && (
          <div className='video-episodes'>
            <h2>Episodes</h2>
            {episodes.map((ep, idx) => {
              const epId = ep.Id ?? ep.id
              const epTitle = ep.Title ?? ep.title
              const epEpisode = ep.Episode ?? ep.episode
              const isCurrent = String(epId) === String(videoItem.id)
              return (
                <div
                  key={epId}
                  className={`video-episode-row ${isCurrent ? 'current' : ''}`}
                  onClick={() => !isCurrent && navigateToEpisode(ep)}
                >
                  <span className='video-episode-number'>{epEpisode || `Episode ${idx + 1}`}</span>
                  <span className='video-episode-title'>{epTitle}</span>
                  {isCurrent && <span className='video-episode-current'>Now playing</span>}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
