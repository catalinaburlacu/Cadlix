import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { cadlixApi } from '../../api/cadlixApi'
import './VideoPlayer.css'

export function VideoPlayer({ movieId, movieTitle, videoFileName = null, autoPlay = false }) {
  const videoRef = useRef(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const controlsTimeoutRef = useRef(null)

  const containerRef = useRef(null)

  useEffect(() => {
    const fetchStreamUrl = async () => {
      try {
        setIsLoading(true)
        if (videoFileName) {
          // If video filename is provided, construct the URL directly
          const streamUrl = `/api/streaming/${videoFileName}`
          if (videoRef.current) {
            videoRef.current.src = streamUrl
          }
        } else {
          // Otherwise, fetch the stream URL from the API
          const response = await cadlixApi.getMovieStreamUrl(movieId)
          if (response && response.streamUrl) {
            if (videoRef.current) {
              videoRef.current.src = response.streamUrl
            }
          }
        }
        setIsLoading(false)
      } catch (err) {
        console.error('Error fetching stream URL:', err)
        setError('Failed to load video')
        setIsLoading(false)
      }
    }

    if (movieId || videoFileName) {
      fetchStreamUrl()
    }
  }, [movieId, videoFileName])

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
    }
  }

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    if (videoRef.current) {
      videoRef.current.volume = newVolume
    }
    if (newVolume === 0) {
      setIsMuted(true)
    } else if (isMuted) {
      setIsMuted(false)
    }
  }

  const handleMutedToggle = () => {
    if (videoRef.current) {
      if (isMuted) {
        videoRef.current.volume = volume
        setIsMuted(false)
      } else {
        videoRef.current.volume = 0
        setIsMuted(true)
      }
    }
  }

  const handleProgressChange = (e) => {
    const newTime = parseFloat(e.target.value)
    if (videoRef.current) {
      videoRef.current.currentTime = newTime
    }
    setCurrentTime(newTime)
  }

  const handleFullscreen = () => {
    if (containerRef.current) {
      if (!isFullscreen) {
        if (containerRef.current.requestFullscreen) {
          containerRef.current.requestFullscreen()
        } else if (containerRef.current.webkitRequestFullscreen) {
          containerRef.current.webkitRequestFullscreen()
        }
        setIsFullscreen(true)
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen()
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen()
        }
        setIsFullscreen(false)
      }
    }
  }

  const handleMouseMove = () => {
    setShowControls(true)
    clearTimeout(controlsTimeoutRef.current)
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false)
      }
    }, 3000)
  }

  const formatTime = (time) => {
    if (!time || isNaN(time)) return '0:00'
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }

  if (error) {
    return (
      <div className="video-player-error">
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div
      className={`video-player-container ${isFullscreen ? 'fullscreen' : ''}`}
      ref={containerRef}
      onMouseMove={handleMouseMove}
    >
      {isLoading && (
        <div className="video-player-loader">
          <div className="spinner" />
          <p>Loading video...</p>
        </div>
      )}

      <video
        ref={videoRef}
        className="video-player-element"
        autoPlay={autoPlay}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
        onLoadStart={() => setIsLoading(true)}
        onCanPlay={() => setIsLoading(false)}
      />

      {/* Video Controls */}
      <div className={`video-controls ${showControls || !isPlaying ? 'visible' : 'hidden'}`}>
        {/* Progress Bar */}
        <div className="progress-container">
          <input
            type="range"
            className="progress-bar"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleProgressChange}
          />
        </div>

        {/* Control Bar */}
        <div className="control-bar">
          {/* Left Controls */}
          <div className="controls-left">
            {/* Play/Pause Button */}
            <button
              className="control-btn play-btn"
              onClick={handlePlayPause}
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <span className="icon">⏸</span>
              ) : (
                <span className="icon">▶</span>
              )}
            </button>

            {/* Volume Control */}
            <div className="volume-control">
              <button
                className="control-btn volume-btn"
                onClick={handleMutedToggle}
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                <span className="icon">{isMuted ? '🔇' : '🔊'}</span>
              </button>
              <input
                type="range"
                className="volume-slider"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
              />
            </div>

            {/* Time Display */}
            <div className="time-display">
              <span className="current-time">{formatTime(currentTime)}</span>
              <span className="separator">/</span>
              <span className="duration">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Right Controls */}
          <div className="controls-right">
            {/* Fullscreen Button */}
            <button
              className="control-btn fullscreen-btn"
              onClick={handleFullscreen}
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              <span className="icon">{isFullscreen ? '⛶' : '⛶'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Movie Title Overlay */}
      {movieTitle && (
        <div className="video-title-overlay">
          <h2>{movieTitle}</h2>
        </div>
      )}
    </div>
  )
}

VideoPlayer.propTypes = {
  movieId: PropTypes.number,
  movieTitle: PropTypes.string,
  videoFileName: PropTypes.string,
  autoPlay: PropTypes.bool,
}
