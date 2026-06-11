import { useState, useCallback, useEffect, useMemo } from 'react'
import { useUser } from '../../../context/useUser.js'
import { Link, useLocation } from 'react-router-dom'
import SidebarLayout from '../../../components/layout/SidebarLayout.jsx'
import { cadlixApi } from '../../../api/cadlixApi.js'
import { mapHistoryDTO } from '../../../api/mappers.js'
import { useToast } from '../../../hooks/useToast.js'
import '../home/Home.css'
import './History.css'

function formatWatchDate(value) {
  if (!value) return 'Unknown time'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Unknown time'
  return date.toLocaleString()
}

function getStatusLabel(status) {
  const labels = {
    watching: 'Watching',
    completed: 'Completed',
    paused: 'Paused',
    dropped: 'Dropped',
    planned: 'Planned',
  }
  return labels[status] || status
}

export default function History() {
  const { user, refreshUser } = useUser()
  const location = useLocation()
  const { showToast } = useToast()
  const [deleting, setDeleting] = useState(null)
  const [editing, setEditing] = useState(null)
  const [editForm, setEditForm] = useState({})

  const [historyEntries, setHistoryEntries] = useState([])

  const fetchHistory = useCallback(async (signal) => {
    if (!user?.id) {
      setHistoryEntries([])
      return
    }

    try {
      const data = await cadlixApi.getHistory(user.id, signal)
      setHistoryEntries(Array.isArray(data) ? data.map(mapHistoryDTO).filter(Boolean) : [])
    } catch (err) {
      if (err?.name === 'AbortError') return
      showToast(`Failed to load history: ${err?.message || err}`, 'error')
    }
  }, [user?.id, showToast])

  const handleDelete = useCallback(async (id) => {
    if (!window.confirm('Are you sure you want to delete this history entry?')) return

    setDeleting(id)
    try {
      await cadlixApi.deleteHistory(id)
      await refreshUser()
      showToast('History entry deleted successfully.', 'success')
    } catch (err) {
      showToast(`Failed to delete: ${err.message}`, 'error')
    } finally {
      setDeleting(null)
    }
  }, [refreshUser, showToast])

  const handleEdit = useCallback((entry) => {
    setEditing(entry.id)
    setEditForm({
      watchStatus: entry.watchStatus || 'watching',
      progressPercentage: entry.progressPercentage || 0,
      userRating: entry.userRating || '',
      episode: entry.episode || '',
    })
  }, [])

  const handleUpdate = useCallback(async (id) => {
    try {
      const payload = {
        watchStatus: editForm.watchStatus,
        progressPercentage: parseInt(editForm.progressPercentage, 10),
        userRating: editForm.userRating ? parseFloat(editForm.userRating) : null,
        episode: editForm.episode || null,
      }

      await cadlixApi.updateHistory(id, payload)
      await refreshUser()
      setEditing(null)
      showToast('History entry updated successfully.', 'success')
    } catch (err) {
      showToast(`Failed to update: ${err.message}`, 'error')
    }
  }, [editForm, refreshUser, showToast])

  const handleClearAll = useCallback(async () => {
    if (!user?.id) return
    if (!window.confirm('Are you sure you want to clear all history? This cannot be undone.')) return

    try {
      await cadlixApi.deleteUserHistory(user.id)
      await refreshUser()
      showToast('All history cleared successfully.', 'success')
    } catch (err) {
      showToast(`Failed to clear history: ${err.message}`, 'error')
    }
  }, [user, refreshUser, showToast])

  const [expandedSeries, setExpandedSeries] = useState(null)

  const { standalone, seriesGroups } = useMemo(() => {
    const stand = []
    const grouped = {}
    for (const e of historyEntries) {
      if (e.series && e.series !== '-' && e.series !== '') {
        const key = e.series
        if (!grouped[key]) grouped[key] = { name: key, episodes: [], progress: 0, poster: e.poster }
        grouped[key].episodes.push(e)
        grouped[key].progress = e.progressPercentage
        if (e.poster) grouped[key].poster = e.poster
      } else {
        stand.push(e)
      }
    }
    return {
      standalone: stand,
      seriesGroups: Object.values(grouped).sort((a, b) => {
        const aLast = a.episodes.reduce((max, e) => Math.max(max, new Date(e.watchedAt).getTime()), 0)
        const bLast = b.episodes.reduce((max, e) => Math.max(max, new Date(e.watchedAt).getTime()), 0)
        return bLast - aLast
      }),
    }
  }, [historyEntries])

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory, location.pathname])

  function renderCard(entry, isSeriesCard = false) {
    const isEditing = editing === entry.id
    return (
      <div key={entry.id} className='history-card'>
        {isEditing ? (
          <div className='history-edit-form'>
            <div className='form-group'>
              <label>Status</label>
                <select
                  value={editForm.watchStatus}
                  onChange={e => setEditForm({ ...editForm, watchStatus: e.target.value })}
                >
                  <option value='watching'>Watching</option>
                  <option value='completed'>Completed</option>
                  <option value='paused'>Paused</option>
                  <option value='dropped'>Dropped</option>
                  <option value='planned'>Planned</option>
                </select>
            </div>
            <div className='form-group'>
              <label>Progress (%)</label>
              <input
                type='number' min='0' max='100'
                value={editForm.progressPercentage}
                onChange={e => setEditForm({ ...editForm, progressPercentage: e.target.value })}
              />
            </div>
            <div className='form-group'>
              <label>Rating (0-10)</label>
              <input
                type='number' min='0' max='10' step='0.1'
                value={editForm.userRating}
                onChange={e => setEditForm({ ...editForm, userRating: e.target.value })}
              />
            </div>
            {isSeriesCard && (
              <div className='form-group'>
                <label>Episode</label>
                <input
                  type='text'
                  value={editForm.episode}
                  onChange={e => setEditForm({ ...editForm, episode: e.target.value })}
                />
              </div>
            )}
            <div className='form-actions'>
              <button className='btn btn--primary' onClick={() => handleUpdate(entry.id)}>Save</button>
              <button className='btn' onClick={() => setEditing(null)}>Cancel</button>
            </div>
          </div>
        ) : (
          <>
            <Link to={`/watch/${entry.movieId}`} className='history-main'>
              <div className='history-poster-wrap'>
                <img
                  className='history-poster'
                  src={entry.poster || '/api/media/image/defaults/default-poster.png'}
                  alt={entry.title}
                  loading='lazy'
                  onError={e => { e.target.src = '/api/media/image/defaults/default-poster.png' }}
                />
              </div>
              <div className='history-info'>
                <h3>{entry.title}</h3>
                <span className={`history-type history-type--${(entry.category || '').toLowerCase()}`}>
                  {entry.category}
                </span>
              </div>
              <div className='history-meta'>
                <p><strong>Status:</strong> {getStatusLabel(entry.watchStatus)}</p>
                <p><strong>Progress:</strong> {entry.progressPercentage || 0}%</p>
                {entry.userRating && <p><strong>Rating:</strong> {entry.userRating}/10</p>}
                <p><strong>Series:</strong> {entry.series || '-'}</p>
                <p><strong>Episode:</strong> {entry.episode || '-'}</p>
                <p><strong>Moment:</strong> {entry.progress || '-'}</p>
                <p><strong>Watched At:</strong> {formatWatchDate(entry.watchedAt)}</p>
              </div>
            </Link>
            <div className='history-actions'>
              <button className='btn btn--small' onClick={() => handleEdit(entry)}>
                <i className='bx bx-edit'></i> Edit
              </button>
              <button
                className='btn btn--small btn--danger'
                onClick={() => handleDelete(entry.id)}
                disabled={deleting === entry.id}
              >
                <i className='bx bx-trash'></i> {deleting === entry.id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </>
        )}
      </div>
    )
  }

  function renderSeriesGroup(group) {
    const isExpanded = expandedSeries === group.name
    const latest = group.episodes.reduce((a, b) =>
      new Date(a.watchedAt) > new Date(b.watchedAt) ? a : b
    )
    return (
      <div key={group.name} className='history-card history-series-group'>
        <Link to={`/watch/${latest.movieId}`} className='history-main'>
          <div className='history-poster-wrap'>
            <img
              className='history-poster'
              src={group.poster || '/api/media/image/defaults/default-poster.png'}
              alt={group.name}
              loading='lazy'
              onError={e => { e.target.src = '/api/media/image/defaults/default-poster.png' }}
            />
          </div>
          <div className='history-info'>
            <h3>{group.name}</h3>
            <span className='history-type history-type--series'>Series</span>
          </div>
          <div className='history-meta'>
            <p><strong>Progress:</strong> {group.progress}%</p>
            <p><strong>Episodes watched:</strong> {group.episodes.length}</p>
            <p><strong>Last watched:</strong> {formatWatchDate(latest.watchedAt)}</p>
          </div>
        </Link>
        <div className='history-actions'>
          <button
            className='btn btn--small'
            onClick={() => setExpandedSeries(isExpanded ? null : group.name)}
          >
            <i className={`bx ${isExpanded ? 'bx-chevron-up' : 'bx-chevron-down'}`}></i>
            {isExpanded ? ' Hide episodes' : ' Show episodes'}
          </button>
        </div>
        {isExpanded && (
          <div className='history-series-episodes'>
            {group.episodes.map(ep => (
              <div key={ep.id} className='history-series-episode'>
                <Link to={`/watch/${ep.movieId}`} className='history-series-ep-link'>
                  <span className='history-series-ep-title'>{ep.title}</span>
                  <span className='history-series-ep-meta'>
                    {ep.progressPercentage}% &middot; {formatWatchDate(ep.watchedAt)}
                  </span>
                </Link>
                <button
                  className='btn btn--small btn--danger'
                  onClick={() => handleDelete(ep.id)}
                  disabled={deleting === ep.id}
                >
                  <i className='bx bx-trash'></i>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <SidebarLayout
      pageClass='history-page'
      navbarContent={<h1 className='history-heading'>Watch History</h1>}
    >
      <div className='page-content history-content'>
        <section className='history-intro'>
          <div className='history-intro-text'>
            <h2>Viewed Movies and Series</h2>
            <p>Track what you watched, which series/episode, and the exact viewing moment.</p>
          </div>
          {historyEntries.length > 0 && (
            <button className='btn btn--danger' onClick={handleClearAll}>
              <i className='bx bx-trash'></i> Clear All History
            </button>
          )}
        </section>

        <section className='history-list' aria-label='Viewing history'>
          {historyEntries.length === 0 ? (
            <div className='history-empty'>
              <i className='bx bx-history'></i>
              <p>No watch history yet.</p>
              <Link to='/explore' className='btn btn--primary'>Explore Content</Link>
            </div>
          ) : (
            <>
              {seriesGroups.map(renderSeriesGroup)}
              {standalone.map(e => renderCard(e))}
            </>
          )}
        </section>
      </div>
    </SidebarLayout>
  )
}
