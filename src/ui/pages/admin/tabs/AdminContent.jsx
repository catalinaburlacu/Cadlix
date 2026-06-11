import { useState } from 'react'
import Button from '../../../../components/common/Button.jsx'
import Input from '../../../../components/common/Input.jsx'
import { useToast } from '../../../../hooks/useToast.js'
import { cadlixApi } from '../../../../api/cadlixApi.js'

const ALL_TYPES = [
  { value: '', label: 'All Types' },
  { value: 'movie', label: 'Movie' },
  { value: 'tv', label: 'TV Series' },
  { value: 'documentary', label: 'Documentary' },
  { value: 'miniseries', label: 'Mini-Series' },
  { value: 'special', label: 'Special' },
]

const ALL_GENRES = [
  { value: '', label: 'All Genres' },
  { value: 'action', label: 'Action' },
  { value: 'adventure', label: 'Adventure' },
  { value: 'comedy', label: 'Comedy' },
  { value: 'crime', label: 'Crime' },
  { value: 'detective', label: 'Detective' },
  { value: 'drama', label: 'Drama' },
  { value: 'fantasy', label: 'Fantasy' },
  { value: 'historical', label: 'Historical' },
  { value: 'horror', label: 'Horror' },
  { value: 'military', label: 'Military' },
  { value: 'mystery', label: 'Mystery' },
  { value: 'psychological', label: 'Psychological' },
  { value: 'romance', label: 'Romance' },
  { value: 'sci-fi', label: 'Sci-Fi' },
  { value: 'sports', label: 'Sports' },
  { value: 'supernatural', label: 'Supernatural' },
  { value: 'thriller', label: 'Thriller' },
  { value: 'biography', label: 'Biography' },
]

const EMPTY_FORM = {
  title: '',
  type: 'movie',
  genre: '',
  genres: [],
  year: '',
  score: '',
  description: '',
  poster: '',
  thumbnail: '',
  backdrop: '',
  videoSource: '',
  director: '',
  cast: '',
  country: '',
  externalId: '',
  category: '',
  duration: '',
}

const CONTENT_TYPES = ALL_TYPES.filter(t => t.value !== '')
const CONTENT_GENRES = ALL_GENRES.filter(g => g.value !== '')

export default function AdminContent({ contentList, setContentList }) {
  const toast = useToast()
  const [showAddForm, setShowAddForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [files, setFiles] = useState({ videoFile: null, posterFile: null, thumbnailFile: null, backdropFile: null })
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  function handleFormChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleGenreToggle(value) {
    setForm(prev => ({
      ...prev,
      genres: prev.genres.includes(value)
        ? prev.genres.filter(g => g !== value)
        : [...prev.genres, value],
    }))
  }

  function handleFileChange(e) {
    const { name, files: selectedFiles } = e.target
    if (selectedFiles && selectedFiles.length > 0) {
      setFiles(prev => ({ ...prev, [name]: selectedFiles[0] }))
    }
  }

  async function handleAddContent(e) {
    e.preventDefault()
    if (!form.title.trim()) { toast.error('Title is required'); return }
    if (form.genres.length === 0) { toast.error('Select at least one genre'); return }
    const score = parseFloat(form.score)
    if (form.score && (isNaN(score) || score < 0 || score > 10)) {
      toast.error('Score must be between 0 and 10'); return
    }

    setUploading(true)
    setUploadProgress(0)

    try {
      const formData = new FormData()
      formData.append('title', form.title.trim())
      formData.append('type', form.type)
      formData.append('year', parseInt(form.year) || new Date().getFullYear())
      formData.append('score', form.score ? score : 0)

      form.genres.forEach(g => formData.append('genres', g))

      if (form.description?.trim()) formData.append('description', form.description.trim())
      if (form.director?.trim()) formData.append('director', form.director.trim())
      if (form.cast?.trim()) formData.append('cast', form.cast.split(',').map(s => s.trim()).filter(Boolean))
      if (form.country?.trim()) formData.append('country', form.country.split(',').map(s => s.trim()).filter(Boolean))
      if (form.category?.trim()) formData.append('category', form.category.trim())
      if (form.duration?.trim()) formData.append('duration', form.duration.trim())
      if (form.externalId?.trim()) formData.append('externalId', form.externalId.trim())

      if (files.videoFile) formData.append('videoFile', files.videoFile)
      if (files.posterFile) formData.append('posterFile', files.posterFile)
      if (files.thumbnailFile) formData.append('thumbnailFile', files.thumbnailFile)
      if (files.backdropFile) formData.append('backdropFile', files.backdropFile)

      const newItem = await cadlixApi.uploadContent(formData, (progress) => {
        setUploadProgress(progress.percentage)
      })

      const responseId = newItem.ContentId ?? newItem.contentId
      const responseIsPrivate = newItem.IsPrivate ?? newItem.isPrivate

      const formattedItem = {
        id: responseId,
        title: newItem.Title ?? newItem.title ?? form.title,
        type: form.type,
        genres: form.genres.join(', '),
        year: parseInt(form.year) || new Date().getFullYear(),
        score: parseFloat(form.score) || 0,
        status: responseIsPrivate ? 'Draft' : 'Published',
      }

      setContentList(prev => [formattedItem, ...prev])
      setForm(EMPTY_FORM)
      setFiles({ videoFile: null, posterFile: null, thumbnailFile: null, backdropFile: null })
      setShowAddForm(false)
      toast.success(`"${formattedItem.title}" added successfully`)
    } catch (error) {
      console.error('Failed to create content:', error)
      toast.error('Failed to add content. Please try again.')
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  function handleDeleteContent(id, title) {
    setContentList(prev => prev.filter(c => c.id !== id))
    toast.info(`"${title}" removed`)
  }

  async function handleToggleStatus(id, currentStatus) {
    const next = currentStatus === 'Published' ? 'Draft' : 'Published'
    try {
      await cadlixApi.updateContent(id, { isPrivate: next === 'Draft' })
      setContentList(prev => prev.map(c => c.id === id ? { ...c, status: next } : c))
      toast.success(`Status changed to "${next}"`)
    } catch (error) {
      console.error('Failed to update status:', error)
      toast.error('Failed to update status')
    }
  }

  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <h2 className="admin-section-title">Content Library</h2>
        <Button variant="primary" size="small" onClick={() => setShowAddForm(v => !v)}>
          <i className={`bx ${showAddForm ? 'bx-x' : 'bx-plus'}`} aria-hidden="true"></i>
          {showAddForm ? 'Cancel' : 'Add Content'}
        </Button>
      </div>

      {showAddForm && (
        <form className="admin-add-form" onSubmit={handleAddContent}>
          <div className="admin-form-grid">
            <div className="admin-form-field admin-form-field--wide">
              <label className="admin-form-label">Title *</label>
              <Input
                name="title"
                placeholder="Enter title"
                value={form.title}
                onChange={handleFormChange}
              />
            </div>

            <div className="admin-form-field">
              <label className="admin-form-label">Type</label>
              <select className="admin-form-select" name="type" value={form.type} onChange={handleFormChange}>
                {CONTENT_TYPES.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            <div className="admin-form-field admin-form-field--wide">
              <label className="admin-form-label">
                Genre <span className="admin-form-label-hint">(select one or more)</span>
              </label>
              <div className="admin-genre-grid">
                {CONTENT_GENRES.map(g => (
                  <label
                    key={g.value}
                    className={`admin-genre-chip${form.genres.includes(g.value) ? ' selected' : ''}`}
                  >
                    <input
                      type="checkbox"
                      checked={form.genres.includes(g.value)}
                      onChange={() => handleGenreToggle(g.value)}
                    />
                    {g.label}
                  </label>
                ))}
              </div>
            </div>

            <div className="admin-form-field">
              <label className="admin-form-label">Year</label>
              <Input
                name="year"
                type="number"
                placeholder="2024"
                value={form.year}
                onChange={handleFormChange}
              />
            </div>

            <div className="admin-form-field">
              <label className="admin-form-label">Score (0–10)</label>
              <Input
                name="score"
                type="number"
                placeholder="8.5"
                step="0.1"
                min="0"
                max="10"
                value={form.score}
                onChange={handleFormChange}
              />
            </div>

            <div className="admin-form-field admin-form-field--wide">
              <label className="admin-form-label">Description</label>
              <textarea
                name="description"
                placeholder="Short description"
                value={form.description}
                onChange={handleFormChange}
                className="admin-textarea"
              />
            </div>

            <div className="admin-form-field">
              <label className="admin-form-label">Video File</label>
              <input
                type="file"
                name="videoFile"
                accept="video/*"
                onChange={handleFileChange}
                className="admin-file-input"
              />
            </div>

            <div className="admin-form-field">
              <label className="admin-form-label">Poster Image</label>
              <input
                type="file"
                name="posterFile"
                accept="image/*"
                onChange={handleFileChange}
                className="admin-file-input"
              />
            </div>

            <div className="admin-form-field">
              <label className="admin-form-label">Thumbnail Image</label>
              <input
                type="file"
                name="thumbnailFile"
                accept="image/*"
                onChange={handleFileChange}
                className="admin-file-input"
              />
            </div>

            <div className="admin-form-field">
              <label className="admin-form-label">Backdrop Image</label>
              <input
                type="file"
                name="backdropFile"
                accept="image/*"
                onChange={handleFileChange}
                className="admin-file-input"
              />
            </div>

            <div className="admin-form-field">
              <label className="admin-form-label">Director</label>
              <Input name="director" placeholder="Director name" value={form.director} onChange={handleFormChange} />
            </div>

            <div className="admin-form-field">
              <label className="admin-form-label">Cast (comma separated)</label>
              <Input name="cast" placeholder="Actor1, Actor2" value={form.cast} onChange={handleFormChange} />
            </div>

            <div className="admin-form-field">
              <label className="admin-form-label">Country (comma separated)</label>
              <Input name="country" placeholder="USA, UK" value={form.country} onChange={handleFormChange} />
            </div>

            <div className="admin-form-field">
              <label className="admin-form-label">External ID</label>
              <Input name="externalId" placeholder="external-id" value={form.externalId} onChange={handleFormChange} />
            </div>

            <div className="admin-form-field">
              <label className="admin-form-label">Main Genre</label>
              <select className="admin-form-select" name="category" value={form.category} onChange={handleFormChange}>
                <option value="">None</option>
                {CONTENT_GENRES.map(g => (
                  <option key={g.value} value={g.value}>{g.label}</option>
                ))}
              </select>
            </div>

            <div className="admin-form-field">
              <label className="admin-form-label">Duration</label>
              <Input name="duration" placeholder="1h 32m" value={form.duration} onChange={handleFormChange} />
            </div>
          </div>

          {uploading && (
            <div className="upload-progress">
              <div className="upload-progress-bar">
                <div className="upload-progress-fill" style={{ width: `${uploadProgress}%` }} />
              </div>
              <span className="upload-progress-text">{uploadProgress}%</span>
            </div>
          )}

          <div className="admin-form-actions">
            <Button variant="primary" type="submit" disabled={uploading}>
              <i className="bx bx-check" aria-hidden="true"></i>
              {uploading ? 'Uploading...' : 'Save Content'}
            </Button>
            <Button variant="ghost" type="button" onClick={() => { setShowAddForm(false); setForm(EMPTY_FORM); setFiles({ videoFile: null, posterFile: null, thumbnailFile: null, backdropFile: null }) }}>
              Discard
            </Button>
          </div>
        </form>
      )}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th><th>Type</th><th>Genre</th><th>Year</th><th>Score</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {contentList.map(item => (
              <tr key={item.id}>
                <td className="admin-table-username">{item.title}</td>
                <td>
                  <span className="admin-type-badge">{item.type}</span>
                </td>
                <td className="admin-table-email">{item.genres}</td>
                <td className="admin-table-date">{item.year}</td>
                <td>
                  {item.score != null
                    ? <span className="admin-score-val"><i className="bx bxs-star"></i>{item.score}</span>
                    : <span className="admin-table-email">—</span>
                  }
                </td>
                <td>
                  <button
                    className={`admin-content-status admin-content-status--${item.status.toLowerCase()} admin-status-toggle`}
                    onClick={() => handleToggleStatus(item.id, item.status)}
                    title={item.status === 'Published' ? 'Click to set Draft' : 'Click to Publish'}
                  >
                    {item.status}
                  </button>
                </td>
                <td>
                  <button
                    className="admin-delete-btn"
                    onClick={() => handleDeleteContent(item.id, item.title)}
                    aria-label={`Delete ${item.title}`}
                    title="Delete"
                  >
                    <i className="bx bx-trash" aria-hidden="true"></i>
                  </button>
                </td>
              </tr>
            ))}
            {contentList.length === 0 && (
              <tr>
                <td colSpan={7} className="admin-table-empty">No content entries.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
