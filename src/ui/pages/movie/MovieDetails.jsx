import { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import SidebarLayout from '../../../components/layout/SidebarLayout.jsx'
import Button from '../../../components/common/Button.jsx'
import { useApiQuery } from '../../../hooks/useApiQuery.js'
import { cadlixApi } from '../../../api/cadlixApi.js'
import { mapContentDTO, mapReviewDTO } from '../../../api/mappers.js'
import { UserContext } from '../../../context/UserContext.js'
import './MovieDetails.css'

export default function MovieDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useContext(UserContext) || {}

  const { data: movieResponse, loading, error } = useApiQuery(
    () => cadlixApi.getContentById(id),
    [id],
    null
  )

  const movie = movieResponse ? mapContentDTO(movieResponse) : null

  // ── Reviews ─────────────────────────────────────────────────────
  const [reviews, setReviews] = useState([])
  const [reviewsLoading, setReviewsLoading] = useState(true)
  const [reviewForm, setReviewForm] = useState({ rating: 5, text: '' })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!id) return
    setReviewsLoading(true)
    cadlixApi.getMovieReviews(id)
      .then(data => setReviews((data || []).map(mapReviewDTO)))
      .catch(() => setReviews([]))
      .finally(() => setReviewsLoading(false))
  }, [id])

  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    if (!user?.id) return
    setSubmitting(true)
    try {
      const created = await cadlixApi.createReview({
        movieId: Number(id),
        rating: reviewForm.rating,
        text: reviewForm.text,
      })
      setReviews(prev => {
        const mapped = mapReviewDTO(created)
        const idx = prev.findIndex(r => r.userId === mapped.userId && r.movieId === mapped.movieId)
        if (idx !== -1) {
          const next = [...prev]
          next[idx] = mapped
          return next
        }
        return [mapped, ...prev]
      })
      setReviewForm({ rating: 5, text: '' })
    } catch (err) {
      console.error('Failed to submit review:', err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteReview = async (reviewId) => {
    try {
      await cadlixApi.deleteReview(reviewId)
      setReviews(prev => prev.filter(r => r.id !== reviewId))
    } catch (err) {
      console.error('Failed to delete review:', err)
    }
  }

  const handleReviewLike = async (reviewId) => {
    try {
      await cadlixApi.toggleReviewLike(reviewId)
      setReviews(prev => prev.map(r =>
        r.id === reviewId
          ? { ...r, isLikedByCurrentUser: !r.isLikedByCurrentUser, likesCount: r.likesCount + (r.isLikedByCurrentUser ? -1 : 1) }
          : r
      ))
    } catch (err) {
      console.error('Failed to like review:', err)
    }
  }

  if (loading) {
    return (
      <SidebarLayout>
        <div className='movie-details-loading'>
          <p>Loading...</p>
        </div>
      </SidebarLayout>
    )
  }

  if (error || !movie) {
    return (
      <SidebarLayout>
        <div className='movie-details-error'>
          <h2>Movie not found</h2>
          <p>The movie you're looking for doesn't exist.</p>
          <Button variant='primary' onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </div>
      </SidebarLayout>
    )
  }

  const castDisplay = Array.isArray(movie.cast) ? movie.cast.join(', ') : movie.cast || 'Unknown'
  const countryDisplay = Array.isArray(movie.country) ? movie.country.join(', ') : movie.country || 'Unknown'
  const durationDisplay = movie.duration || (movie.durationSeconds ? `${Math.floor(movie.durationSeconds / 60)} min` : 'N/A')

  return (
    <SidebarLayout>
      <div className='movie-details'>
        <div className='movie-details-backdrop'>
          <img src={movie.backdrop || movie.poster || '/api/media/image/defaults/default-backdrop.png'} alt='' aria-hidden='true' />
          <div className='movie-details-backdrop-gradient' />
        </div>

        <div className='movie-details-content'>
          <div className='movie-details-poster'>
            <img src={movie.poster || '/api/media/image/defaults/default-poster.png'} alt={movie.title} />
          </div>

          <div className='movie-details-info'>
            <div className='movie-details-badges'>
              <span className='movie-details-badge movie-details-badge--type'>
                {movie.type === 'tv' ? 'Series' : movie.type === 'documentary' ? 'Documentary' : 'Movie'}
              </span>
              {movie.genres && movie.genres.length > 0 && (
                <span className='movie-details-badge movie-details-badge--genre'>{movie.genres.join(', ')}</span>
              )}
            </div>

            <h1 className='movie-details-title'>{movie.title}</h1>

            <div className='movie-details-meta'>
              <span className='movie-details-meta-item'>
                <i className='bx bx-calendar'></i>
                {movie.year || 'N/A'}
              </span>
              <span className='movie-details-meta-item'>
                <i className='bx bx-globe'></i>
                {countryDisplay}
              </span>
              <span className='movie-details-meta-item'>
                <i className='bx bx-time'></i>
                {durationDisplay}
              </span>
            </div>

            <div className='movie-details-rating'>
              <i className='bx bxs-star'></i>
              <span className='movie-details-rating-value'>{movie.score ?? 'N/A'}</span>
              <span className='movie-details-rating-label'>Score</span>
            </div>

            <div className='movie-details-actions'>
              {movie.videoSource ? (
                <Link to={`/watch/${movie.id}`} className='btn btn-primary btn-large'>
                  <i className='bx bx-play'></i>
                  Watch Now
                </Link>
              ) : (
                <Button variant='primary' size='large' disabled>
                  <i className='bx bx-play'></i>
                  Not Available
                </Button>
              )}
              <Button variant='ghost' size='large'>
                <i className='bx bx-plus'></i>
                Add to List
              </Button>
            </div>

            {movie.description && (
              <div className='movie-details-description'>
                <h3>Synopsis</h3>
                <p>{movie.description}</p>
              </div>
            )}

            {movie.director && (
              <div className='movie-details-section'>
                <h3>Director</h3>
                <p>{movie.director}</p>
              </div>
            )}

            {castDisplay !== 'Unknown' && (
              <div className='movie-details-section'>
                <h3>Cast</h3>
                <p>{castDisplay}</p>
              </div>
            )}
          </div>
        </div>

        {/* ── Reviews Section ───────────────────────────────────────── */}

        <div className='movie-details-reviews'>
          <h2>Reviews</h2>

          {user?.id && (
            <form className='review-form' onSubmit={handleReviewSubmit}>
              <div className='review-form-rating'>
                <label>Your Rating</label>
                <div className='star-rating-input'>
                  {[1,2,3,4,5,6,7,8,9,10].map(n => (
                    <button
                      key={n}
                      type='button'
                      className={`star-btn ${n <= reviewForm.rating ? 'active' : ''}`}
                      onClick={() => setReviewForm(prev => ({ ...prev, rating: n }))}
                    >
                      <i className='bx bxs-star'></i>
                    </button>
                  ))}
                  <span className='rating-value'>{reviewForm.rating}/10</span>
                </div>
              </div>
              <div className='review-form-text'>
                <label htmlFor='reviewText'>Your Review</label>
                <textarea
                  id='reviewText'
                  value={reviewForm.text}
                  onChange={e => setReviewForm(prev => ({ ...prev, text: e.target.value }))}
                  placeholder='Share your thoughts about this title...'
                  rows={3}
                />
              </div>
              <Button type='submit' variant='primary' disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Review'}
              </Button>
            </form>
          )}

          {reviewsLoading ? (
            <p className='reviews-loading'>Loading reviews...</p>
          ) : reviews.length === 0 ? (
            <p className='reviews-empty'>No reviews yet. Be the first to review!</p>
          ) : (
            <div className='reviews-list'>
              {reviews.map(review => (
                <div key={review.id} className='review-card'>
                  <div className='review-card-header'>
                    <div className='review-card-user'>
                      {review.userAvatar && (
                        <img src={review.userAvatar} alt='' className='review-avatar' />
                      )}
                      <strong>{review.username || `User #${review.userId}`}</strong>
                    </div>
                    <div className='review-card-rating'>
                      {Array.from({ length: 10 }, (_, i) => (
                        <i
                          key={i}
                          className={`bx bxs-star ${i < review.rating ? 'active' : ''}`}
                        ></i>
                      ))}
                      <span>{review.rating}/10</span>
                    </div>
                  </div>
                  {review.text && <p className='review-card-text'>{review.text}</p>}
                  <div className='review-card-footer'>
                    <span className='review-date'>
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                    <div className='review-card-actions'>
                      {user?.id && (
                        <button
                          className={`review-like-btn ${review.isLikedByCurrentUser ? 'liked' : ''}`}
                          onClick={() => handleReviewLike(review.id)}
                        >
                          <i className={`bx ${review.isLikedByCurrentUser ? 'bxs-heart' : 'bx-heart'}`}></i>
                          <span>{review.likesCount}</span>
                        </button>
                      )}
                      {user?.id === review.userId && (
                        <button
                          className='review-delete-btn'
                          onClick={() => handleDeleteReview(review.id)}
                        >
                          <i className='bx bx-trash'></i> Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </SidebarLayout>
  )
}
