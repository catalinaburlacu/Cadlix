import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { cadlixApi } from '../../api/cadlixApi'
import { useToast } from '../../hooks/useToast'
import './MovieUpload.css'

export function MovieUpload({ onUploadSuccess = null, onCancel = null }) {
  const toast = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [selectedFile, setSelectedFile] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    genres: [],
    year: new Date().getFullYear(),
    director: '',
    duration: '',
    durationSeconds: 0,
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'year' || name === 'durationSeconds' ? Number(value) : value,
    }))
  }

  const handleGenresChange = (e) => {
    const { value } = e.target
    const genresArray = value.split(',').map((g) => g.trim()).filter((g) => g.length > 0)
    setFormData((prev) => ({
      ...prev,
      genres: genresArray,
    }))
  }

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      const validTypes = ['video/mp4', 'video/avi', 'video/x-matroska', 'video/quicktime', 'video/webm', 'video/x-flv', 'video/x-ms-wmv', 'video/x-m4v']
      if (!validTypes.includes(file.type) && !file.name.match(/\.(mp4|avi|mkv|mov|webm|flv|wmv|m4v)$/i)) {
        toast.error('Invalid file format. Please select a video file.')
        return
      }

      // Validate file size (max 5GB)
      const maxSize = 5 * 1024 * 1024 * 1024 // 5GB
      if (file.size > maxSize) {
        toast.error('File size exceeds 5GB limit.')
        return
      }

      setSelectedFile(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate required fields
    if (!formData.title.trim()) {
      toast.error('Movie title is required')
      return
    }

    if (!selectedFile) {
      toast.error('Please select a video file')
      return
    }

    try {
      setIsLoading(true)
      setUploadProgress(0)

      // Create FormData for multipart upload
      const uploadFormData = new FormData()
      uploadFormData.append('title', formData.title)
      uploadFormData.append('description', formData.description)
      uploadFormData.append('year', formData.year)
      uploadFormData.append('director', formData.director)
      uploadFormData.append('duration', formData.duration)
      uploadFormData.append('durationSeconds', formData.durationSeconds)

      // Add genres as separate entries
      if (formData.genres.length > 0) {
        formData.genres.forEach((genre, index) => {
          uploadFormData.append(`genres`, genre)
        })
      }

      // Add video file
      uploadFormData.append('videoFile', selectedFile)

      // Upload with progress tracking
      const response = await cadlixApi.uploadMovie(uploadFormData, (progress) => {
        setUploadProgress(progress.percentage)
        console.log(`Upload progress: ${progress.percentage}%`)
      })

      if (response.success) {
        toast.success(`Movie "${response.title}" uploaded successfully!`)
        setSelectedFile(null)
        setFormData({
          title: '',
          description: '',
          genres: [],
          year: new Date().getFullYear(),
          director: '',
          duration: '',
          durationSeconds: 0,
        })
        setUploadProgress(0)

        // Call callback if provided
        if (onUploadSuccess) {
          onUploadSuccess(response)
        }
      } else {
        toast.error(response.message || 'Upload failed')
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast.error(error.message || 'Failed to upload movie')
    } finally {
      setIsLoading(false)
      setUploadProgress(0)
    }
  }

  const handleCancel = () => {
    setSelectedFile(null)
    setFormData({
      title: '',
      description: '',
      genres: [],
      year: new Date().getFullYear(),
      director: '',
      duration: '',
      durationSeconds: 0,
    })
    setUploadProgress(0)

    if (onCancel) {
      onCancel()
    }
  }

  return (
    <div className="movie-upload-container">
      <div className="movie-upload-card">
        <h2 className="movie-upload-title">Upload Movie</h2>

        <form onSubmit={handleSubmit} className="movie-upload-form">
          {/* Title */}
          <div className="form-group">
            <label htmlFor="title">Movie Title *</label>
            <input
              id="title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter movie title"
              disabled={isLoading}
              required
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter movie description"
              disabled={isLoading}
              rows={4}
            />
          </div>

          {/* Genres */}
          <div className="form-group">
            <label htmlFor="genres">Genres (comma-separated)</label>
            <input
              id="genres"
              type="text"
              value={formData.genres.join(', ')}
              onChange={handleGenresChange}
              placeholder="e.g., Action, Drama, Sci-Fi"
              disabled={isLoading}
            />
          </div>

          {/* Year */}
          <div className="form-group">
            <label htmlFor="year">Year</label>
            <input
              id="year"
              type="number"
              name="year"
              value={formData.year}
              onChange={handleInputChange}
              min="1900"
              max={new Date().getFullYear()}
              disabled={isLoading}
            />
          </div>

          {/* Director */}
          <div className="form-group">
            <label htmlFor="director">Director</label>
            <input
              id="director"
              type="text"
              name="director"
              value={formData.director}
              onChange={handleInputChange}
              placeholder="Enter director name"
              disabled={isLoading}
            />
          </div>

          {/* Duration */}
          <div className="form-group">
            <label htmlFor="duration">Duration Format</label>
            <input
              id="duration"
              type="text"
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              placeholder="e.g., 1h 30m"
              disabled={isLoading}
            />
          </div>

          {/* Duration in Seconds */}
          <div className="form-group">
            <label htmlFor="durationSeconds">Duration (seconds)</label>
            <input
              id="durationSeconds"
              type="number"
              name="durationSeconds"
              value={formData.durationSeconds}
              onChange={handleInputChange}
              min="0"
              disabled={isLoading}
            />
          </div>

          {/* Video File */}
          <div className="form-group">
            <label htmlFor="videoFile">Video File *</label>
            <div className="file-input-wrapper">
              <input
                id="videoFile"
                type="file"
                accept="video/*"
                onChange={handleFileSelect}
                disabled={isLoading}
                required
              />
              {selectedFile && <p className="selected-file">{selectedFile.name}</p>}
            </div>
          </div>

          {/* Upload Progress */}
          {isLoading && uploadProgress > 0 && (
            <div className="form-group">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${uploadProgress}%` }} />
              </div>
              <p className="progress-text">{uploadProgress}% uploaded</p>
            </div>
          )}

          {/* Buttons */}
          <div className="form-actions">
            <button
              type="submit"
              disabled={isLoading || !selectedFile || !formData.title.trim()}
              className="btn btn-primary"
            >
              {isLoading ? 'Uploading...' : 'Upload Movie'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={isLoading}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

MovieUpload.propTypes = {
  onUploadSuccess: PropTypes.func,
  onCancel: PropTypes.func,
}
