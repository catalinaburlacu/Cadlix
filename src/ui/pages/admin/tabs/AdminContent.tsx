import { useState } from 'react'
import Button from '../../../../components/common/Button'
import Input from '../../../../components/common/Input'
import { useToast } from '../../../../hooks/useToast'
import {
  CONTENT_GENRES as ALL_GENRES,
  CONTENT_TYPES as ALL_TYPES,
} from '../../../../mocks/constants'
import { EMPTY_FORM } from '../../../../mocks/admin'
import type { ContentItem } from '@/types'

interface AdminContentProps {
  contentList: ContentItem[]
  setContentList: React.Dispatch<React.SetStateAction<ContentItem[]>>
}

const CONTENT_TYPES = ALL_TYPES.filter(t => t.value !== '')
const CONTENT_GENRES = ALL_GENRES.filter(g => g.value !== '')

export default function AdminContent({ contentList, setContentList }: AdminContentProps) {
  const toast = useToast()
  const [showAddForm, setShowAddForm] = useState(false)
  const [form, setForm] = useState<{ title: string; type: string; genre: string[]; year: string; score: string }>(EMPTY_FORM)

  function handleFormChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleGenreToggle(value: string): void {
    setForm(prev => ({
      ...prev,
      genre: prev.genre.includes(value)
        ? prev.genre.filter(g => g !== value)
        : [...prev.genre, value],
    }))
  }

  function handleAddContent(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault()
    if (!form.title.trim()) {
      toast.error('Title is required')
      return
    }
    if (form.genre.length === 0) {
      toast.error('Select at least one genre')
      return
    }
    const score = parseFloat(form.score)
    if (form.score && (isNaN(score) || score < 0 || score > 10)) {
      toast.error('Score must be between 0 and 10')
      return
    }
    const newItem: ContentItem = {
      id: `c-${Date.now()}`,
      title: form.title.trim(),
      type: form.type,
      genre: form.genre.map(v => CONTENT_GENRES.find(g => g.value === v)?.label ?? v).join(', '),
      year: parseInt(form.year) || new Date().getFullYear(),
      score: form.score ? score : null,
      status: 'Draft',
    }
    setContentList(prev => [newItem, ...prev])
    setForm(EMPTY_FORM)
    setShowAddForm(false)
    toast.success(`"${newItem.title}" added successfully`)
  }

  function handleDeleteContent(id: string, title: string): void {
    setContentList(prev => prev.filter(c => c.id !== id))
    toast.info(`"${title}" removed`)
  }

  function handleToggleStatus(id: string, currentStatus: string): void {
    const next = currentStatus === 'Published' ? 'Draft' : 'Published'
    setContentList(prev => prev.map(c => (c.id === id ? { ...c, status: next } : c)))
    toast.success(`Status changed to "${next}"`)
  }

  return (
    <div className='admin-section'>
      <div className='admin-section-header'>
        <h2 className='admin-section-title'>Content Library</h2>
        <Button variant='primary' size='small' onClick={() => setShowAddForm(v => !v)}>
          <i className={`bx ${showAddForm ? 'bx-x' : 'bx-plus'}`} aria-hidden='true'></i>
          {showAddForm ? 'Cancel' : 'Add Content'}
        </Button>
      </div>

      {showAddForm && (
        <form className='admin-add-form' onSubmit={handleAddContent}>
          <div className='admin-form-grid'>
            <div className='admin-form-field admin-form-field--wide'>
              <label className='admin-form-label'>Title *</label>
              <Input
                name='title'
                placeholder='Enter title'
                value={form.title}
                onChange={handleFormChange}
              />
            </div>

            <div className='admin-form-field'>
              <label className='admin-form-label'>Type</label>
              <select
                className='admin-form-select'
                name='type'
                value={form.type}
                onChange={handleFormChange}
              >
                {CONTENT_TYPES.map(t => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <div className='admin-form-field admin-form-field--wide'>
              <label className='admin-form-label'>
                Genre <span className='admin-form-label-hint'>(select one or more)</span>
              </label>
              <div className='admin-genre-grid'>
                {CONTENT_GENRES.map(g => (
                  <label
                    key={g.value}
                    className={`admin-genre-chip${form.genre.includes(g.value) ? ' selected' : ''}`}
                  >
                    <input
                      type='checkbox'
                      checked={form.genre.includes(g.value)}
                      onChange={() => handleGenreToggle(g.value)}
                    />
                    {g.label}
                  </label>
                ))}
              </div>
            </div>

            <div className='admin-form-field'>
              <label className='admin-form-label'>Year</label>
              <Input
                name='year'
                type='number'
                placeholder='2024'
                value={form.year}
                onChange={handleFormChange}
              />
            </div>

            <div className='admin-form-field'>
              <label className='admin-form-label'>Score (0–10)</label>
              <Input
                name='score'
                type='number'
                placeholder='8.5'
                step='0.1'
                min='0'
                max='10'
                value={form.score}
                onChange={handleFormChange}
              />
            </div>
          </div>
          <div className='admin-form-actions'>
            <Button variant='primary' type='submit'>
              <i className='bx bx-check' aria-hidden='true'></i>
              Save Content
            </Button>
            <Button
              variant='ghost'
              type='button'
              onClick={() => {
                setShowAddForm(false)
                setForm(EMPTY_FORM)
              }}
            >
              Discard
            </Button>
          </div>
        </form>
      )}

      <div className='admin-table-wrap'>
        <table className='admin-table'>
          <thead>
            <tr>
              <th>Title</th>
              <th>Type</th>
              <th>Genre</th>
              <th>Year</th>
              <th>Score</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {contentList.map(item => (
              <tr key={item.id}>
                <td className='admin-table-username'>{item.title}</td>
                <td>
                  <span className='admin-type-badge'>{item.type}</span>
                </td>
                <td className='admin-table-email'>{item.genre}</td>
                <td className='admin-table-date'>{item.year}</td>
                <td>
                  {item.score != null ? (
                    <span className='admin-score-val'>
                      <i className='bx bxs-star'></i>
                      {item.score}
                    </span>
                  ) : (
                    <span className='admin-table-email'>—</span>
                  )}
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
                    className='admin-delete-btn'
                    onClick={() => handleDeleteContent(item.id, item.title)}
                    aria-label={`Delete ${item.title}`}
                    title='Delete'
                  >
                    <i className='bx bx-trash' aria-hidden='true'></i>
                  </button>
                </td>
              </tr>
            ))}
            {contentList.length === 0 && (
              <tr>
                <td colSpan={7} className='admin-table-empty'>
                  No content entries.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
