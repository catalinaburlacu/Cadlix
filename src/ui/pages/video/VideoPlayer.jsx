import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useUser } from '../../../context/useUser.js'
import { useToast } from '../../../hooks/useToast.js'
import { MOCK_MEDIA_LIBRARY, MOCK_VIDEOS } from '../../../mocks/constants.js'
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
  const safe = Math.max(0, Math.floor(totalSeconds || 0))
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
  const { user, updateUser } = useUser()
  const toast = useToast()
  const videoRef = useRef(null)
  const containerRef = useRef(null)
  const didToastRef = useRef(false)
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

  const controlsTimeoutRef = useRef(null)

  const videoItem = useMemo(() => MOCK_VIDEOS.find(item => item.id === id) || null, [id])

  const selectedList = useMemo(() => {
    const existing = (user?.watchList || []).find(item => item.id === videoItem?.id)
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
      setDuration(videoRef.current.duration)
    }
  }, [])

  const handleSeek = useCallback(
    e => {
      if (videoRef.current) {
        const rect = e.currentTarget.getBoundingClientRect()
        const percent = (e.clientX - rect.left) / rect.width
        const newTime = percent * duration
        videoRef.current.currentTime = newTime
        setCurrentTime(newTime)
      }
    },
    [duration]
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
  }, [])

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

  const persistHistory = useCallback(() => {
    if (!videoItem || !user) return
    const currentTimeSec = Math.floor(videoRef.current?.currentTime || 0)
    const progress = formatClock(currentTimeSec)
    const dur = Math.max(1, Math.floor(videoRef.current?.duration || videoItem.durationSec || 1))
    const watchedRatio = currentTimeSec / dur
    const historyEntry = {
      id: `h-${videoItem.id}`,
      mediaId: videoItem.id,
      title: videoItem.title,
      category: videoItem.category,
      series: videoItem.series || '-',
      episode: videoItem.episode || '-',
      watchedAt: new Date().toISOString(),
      progress,
    }

    const previousHistory = user.watchHistory || []
    const nextHistory = [
      historyEntry,
      ...previousHistory.filter(entry => entry.id !== historyEntry.id),
    ].slice(0, 80)

    const previousList = user.watchList || []
    const existingItem = previousList.find(item => item.id === videoItem.id)
    const preserveStatus =
      existingItem?.status === 'favorites' || existingItem?.status === 'dropped'
    const computedStatus =
      watchedRatio >= 0.95 ? 'completed' : currentTimeSec > 0 ? 'watching' : 'planned'
    const nextStatus = preserveStatus ? existingItem.status : computedStatus

    const baseItem = existingItem || {
      id: videoItem.id,
      title: videoItem.title,
      category: videoItem.category,
      type: videoItem.type,
      genre: videoItem.genre,
      score: 0,
      dateAdded: new Date().toISOString().slice(0, 10),
      season: videoItem.series || '-',
      episode: videoItem.episode || '-',
    }

    const updatedItem = {
      ...baseItem,
      season: videoItem.series || baseItem.season || '-',
      episode: videoItem.episode || baseItem.episode || '-',
      progress,
      status: nextStatus,
    }

    const nextWatchList = existingItem
      ? previousList.map(item => (item.id === videoItem.id ? updatedItem : item))
      : [updatedItem, ...previousList]

    const previousProgress = user.watchProgress || {}
    updateUser({
      watchHistory: nextHistory,
      watchList: nextWatchList,
      watchProgress: {
        ...previousProgress,
        [videoItem.id]: currentTimeSec,
      },
    })
  }, [updateUser, user, videoItem])

  useEffect(() => {
    if (!videoItem || !user) return undefined
    const progressAtOpen = user.watchProgress?.[videoItem.id] || 0
    const videoEl = videoRef.current
    if (videoEl && progressAtOpen > 0) {
      const setSavedTime = () => {
        videoEl.currentTime = progressAtOpen
        setCurrentTime(progressAtOpen)
      }
      videoEl.addEventListener('loadedmetadata', setSavedTime, { once: true })
    }

    const onBeforeUnload = () => persistHistory()
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => {
      persistHistory()
      window.removeEventListener('beforeunload', onBeforeUnload)
    }
  }, [persistHistory, user, videoItem])

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  const handleAssignList = useCallback(() => {
    if (!videoItem || !user) return
    const baseItem = (user.watchList || []).find(item => item.id === videoItem.id) ||
      MOCK_MEDIA_LIBRARY.find(item => item.id === videoItem.id) || {
        id: videoItem.id,
        title: videoItem.title,
        category: videoItem.category,
        type: videoItem.type,
        genre: videoItem.genre,
        score: 0,
        dateAdded: new Date().toISOString().slice(0, 10),
        season: videoItem.series || '-',
        episode: videoItem.episode || '-',
        progress: formatClock(videoRef.current?.currentTime || 0),
      }

    const updatedItem = {
      ...baseItem,
      status: selectedList,
      season: videoItem.series || baseItem.season || '-',
      episode: videoItem.episode || baseItem.episode || '-',
      progress: formatClock(videoRef.current?.currentTime || 0),
    }

    const watchList = user.watchList || []
    const nextWatchList = watchList.some(item => item.id === updatedItem.id)
      ? watchList.map(item => (item.id === updatedItem.id ? updatedItem : item))
      : [updatedItem, ...watchList]

    updateUser({ watchList: nextWatchList })
    if (!didToastRef.current) {
      toast.success(`Added to ${selectedList}`)
      didToastRef.current = true
      setTimeout(() => {
        didToastRef.current = false
      }, 700)
    }
  }, [selectedList, toast, updateUser, user, videoItem])

  if (!videoItem) {
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

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div
      className={`video-player-page ${isFullscreen ? 'fullscreen' : ''}`}
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      <div className='video-player-shell'>
        <button className='video-back-btn' type='button' onClick={() => navigate(-1)}>
          <i className='bx bx-arrow-back'></i>
          Back
        </button>

        <div className='video-header'>
          <h1>{videoItem.title}</h1>
          <p>
            {videoItem.category} | {videoItem.series}{' '}
            {videoItem.episode !== '-' ? `| ${videoItem.episode}` : ''}
          </p>
        </div>

        <div className='video-stage' onClick={handlePlayPause}>
          <video
            ref={videoRef}
            className='video-element'
            src={videoItem.src}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onPauseInternal={persistHistory}
            onEnded={persistHistory}
          />

          <div className={`video-controls ${showControls ? 'visible' : ''}`}>
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

        <section className='video-list-panel'>
          <h2>Choose List</h2>
          <div className='video-list-controls'>
            <select value={selectedList} onChange={e => setSelectedListManual(e.target.value)}>
              {LIST_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <button type='button' onClick={handleAssignList}>
              Save in List
            </button>
          </div>
          <p>When you pause or leave this page, history is updated with the current stop moment.</p>
        </section>
      </div>
    </div>
  )
}
