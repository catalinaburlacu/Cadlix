import { useState, useMemo, useCallback } from 'react'
import { useUser } from '../../../context/useUser.js'
import SidebarLayout from '../../../components/layout/SidebarLayout.jsx'
import Input from '../../../components/common/Input.jsx'
import {
  MOCK_LEADERBOARD_USERS,
  LEADERBOARD_FILTERS,
  COUNTRY_FLAGS,
  SCORING_WEIGHTS,
} from '../../../mocks/leaderboard.js'
import './Leaderboard.css'

function LeaderboardRow({ user, rank, isCurrentUser }) {
  const rankChange = user.previousRank - rank

  return (
    <div className={`leaderboard-row ${isCurrentUser ? 'current-user' : ''}`}>
      <div className={`rank-cell rank-${rank}`}>
        {rank <= 3 ? (
          <span className="rank-badge">
            <i className={`bx ${rank === 1 ? 'bxs-trophy' : rank === 2 ? 'bxs-medal' : 'bxs-award'}`}></i>
            {rank}
          </span>
        ) : (
          <span className="rank-number">{rank}</span>
        )}
        {rankChange !== 0 && (
          <span className={`rank-change ${rankChange > 0 ? 'up' : 'down'}`}>
            <i className={`bx ${rankChange > 0 ? 'bx-up-arrow' : 'bx-down-arrow'}`}></i>
            {Math.abs(rankChange)}
          </span>
        )}
      </div>

      <div className="user-cell">
        <img
          src={user.avatar}
          alt={user.username}
          className="user-avatar"
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/40'
          }}
        />
        <div className="user-info">
          <span className="username">
            {user.username}
            {isCurrentUser && <span className="you-badge">You</span>}
          </span>
          <span className="country">
            {COUNTRY_FLAGS[user.country] || '🌍'} {user.country}
          </span>
        </div>
      </div>

      <div className="stats-cell watch-time">
        <i className="bx bx-time" aria-hidden="true"></i>
        <span className="stat-value">{user.hoursWatched}</span>
        <span className="stat-label">hours</span>
      </div>

      <div className="stats-cell movies">
        <i className="bx bx-film" aria-hidden="true"></i>
        <span className="stat-value">{user.moviesWatched}</span>
        <span className="stat-label">movies</span>
      </div>

      <div className="stats-cell episodes">
        <i className="bx bx-tv" aria-hidden="true"></i>
        <span className="stat-value">{user.episodesWatched}</span>
        <span className="stat-label">episodes</span>
      </div>

      <div className="stats-cell rating">
        <i className="bx bxs-star" aria-hidden="true"></i>
        <span className="stat-value">{user.avgRating}</span>
      </div>

      <div className="stats-cell reviews">
        <i className="bx bx-edit" aria-hidden="true"></i>
        <span className="stat-value">{user.reviewsWritten}</span>
        <span className="stat-label">reviews</span>
      </div>

      <div className="score-cell">
        <span className="score-value">{user.activityScore.toLocaleString()}</span>
        <span className="score-label">points</span>
      </div>
    </div>
  )
}

export default function Leaderboard() {
  const { user: currentUser } = useUser()
  const [timeFilter, setTimeFilter] = useState('all')
  const [scopeFilter, setScopeFilter] = useState('global')
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)
  const itemsPerPage = 10

  const filteredUsers = useMemo(() => {
    let users = [...MOCK_LEADERBOARD_USERS]

    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase()
      users = users.filter((u) => u.username.toLowerCase().includes(query))
    }

    users.sort((a, b) => b.activityScore - a.activityScore)

    return users
  }, [searchQuery, timeFilter, scopeFilter])

  const paginatedUsers = useMemo(() => {
    const start = (page - 1) * itemsPerPage
    return filteredUsers.slice(start, start + itemsPerPage)
  }, [filteredUsers, page])

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)

  const currentUserRank = useMemo(() => {
    if (!currentUser) return null
    return filteredUsers.findIndex((u) => u.id === currentUser.id) + 1
  }, [filteredUsers, currentUser])

  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value)
    setPage(1)
  }, [])

  return (
    <SidebarLayout>
      <div className="leaderboard-page">
        <header className="leaderboard-header">
          <div className="leaderboard-title-block">
            <i className="bx bx-trophy leaderboard-icon" aria-hidden="true"></i>
            <h1 className="leaderboard-title">Leaderboard</h1>
          </div>
          <p className="leaderboard-subtitle">Rankings based on watch activity and engagement</p>
        </header>

        <div className="leaderboard-controls">
          <div className="filter-group">
            <span className="filter-label">Time Period:</span>
            <div className="filter-tabs" role="tablist" aria-label="Time period">
              {LEADERBOARD_FILTERS.TIME.map((filter) => (
                <button
                  key={filter.id}
                  role="tab"
                  aria-selected={timeFilter === filter.id}
                  className={`filter-tab ${timeFilter === filter.id ? 'active' : ''}`}
                  onClick={() => setTimeFilter(filter.id)}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <span className="filter-label">Scope:</span>
            <div className="filter-tabs" role="tablist" aria-label="Ranking scope">
              {LEADERBOARD_FILTERS.SCOPE.map((filter) => (
                <button
                  key={filter.id}
                  role="tab"
                  aria-selected={scopeFilter === filter.id}
                  className={`filter-tab ${scopeFilter === filter.id ? 'active' : ''}`}
                  onClick={() => setScopeFilter(filter.id)}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          <div className="search-group">
            <i className="bx bx-search search-icon" aria-hidden="true"></i>
            <Input
              type="search"
              placeholder="Search users..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="search-input"
              aria-label="Search leaderboard"
            />
          </div>
        </div>

        <div className="scoring-info">
          <span className="scoring-title">Scoring:</span>
          <span className="scoring-weight">
            <i className="bx bx-time"></i> {SCORING_WEIGHTS.watchTime} pt/hr
          </span>
          <span className="scoring-weight">
            <i className="bx bx-film"></i> {SCORING_WEIGHTS.moviesCompleted} pts/movie
          </span>
          <span className="scoring-weight">
            <i className="bx bx-edit"></i> {SCORING_WEIGHTS.reviewsWritten} pts/review
          </span>
          <span className="scoring-weight">
            <i className="bx bx-heart"></i> {SCORING_WEIGHTS.likesReceived} pt/like
          </span>
        </div>

        {currentUser && currentUserRank > 0 && (
          <div className="your-ranking-card">
            <div className="your-ranking-info">
              <span className="your-ranking-label">Your Ranking</span>
              <span className="your-ranking-position">#{currentUserRank}</span>
            </div>
            <div className="your-ranking-stats">
              <span>
                <i className="bx bx-time"></i> {currentUser.stats?.hoursWatched || 0} hours
              </span>
              <span>
                <i className="bx bx-film"></i> {currentUser.stats?.titlesWatched || 0} movies
              </span>
              <span>
                <i className="bx bx-star"></i> {currentUser.stats?.rating || 0} avg rating
              </span>
            </div>
          </div>
        )}

        <div className="leaderboard-table" role="table" aria-label="User leaderboard">
          <div className="leaderboard-thead" role="rowgroup">
            <div className="leaderboard-tr" role="row">
              <div className="th rank-col" role="columnheader">Rank</div>
              <div className="th user-col" role="columnheader">User</div>
              <div className="th stat-col" role="columnheader">
                <i className="bx bx-time"></i> Watch Time
              </div>
              <div className="th stat-col" role="columnheader">
                <i className="bx bx-film"></i> Movies
              </div>
              <div className="th stat-col" role="columnheader">
                <i className="bx bx-tv"></i> Episodes
              </div>
              <div className="th stat-col" role="columnheader">
                <i className="bx bxs-star"></i> Avg Rating
              </div>
              <div className="th stat-col" role="columnheader">
                <i className="bx bx-edit"></i> Reviews
              </div>
              <div className="th score-col" role="columnheader">Score</div>
            </div>
          </div>

          <div className="leaderboard-tbody" role="rowgroup">
            {paginatedUsers.map((user, index) => (
              <LeaderboardRow
                key={user.id}
                user={user}
                rank={(page - 1) * itemsPerPage + index + 1}
                isCurrentUser={currentUser?.id === user.id}
              />
            ))}
          </div>
        </div>

        {totalPages > 1 && (
          <div className="pagination" role="navigation" aria-label="Leaderboard pagination">
            <button
              className="pagination-btn"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              aria-label="Previous page"
            >
              <i className="bx bx-chevron-left"></i>
            </button>

            <div className="pagination-pages">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum
                if (totalPages <= 5) {
                  pageNum = i + 1
                } else if (page <= 3) {
                  pageNum = i + 1
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i
                } else {
                  pageNum = page - 2 + i
                }
                return (
                  <button
                    key={pageNum}
                    className={`pagination-page ${page === pageNum ? 'active' : ''}`}
                    onClick={() => setPage(pageNum)}
                    aria-label={`Page ${pageNum}`}
                    aria-current={page === pageNum ? 'page' : undefined}
                  >
                    {pageNum}
                  </button>
                )
              })}
            </div>

            <button
              className="pagination-btn"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              aria-label="Next page"
            >
              <i className="bx bx-chevron-right"></i>
            </button>
          </div>
        )}

        {filteredUsers.length === 0 && (
          <div className="leaderboard-empty">
            <i className="bx bx-user-x empty-icon"></i>
            <p>No users found matching your search.</p>
          </div>
        )}
      </div>
    </SidebarLayout>
  )
}
