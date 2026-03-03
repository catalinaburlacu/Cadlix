import { useToast } from '../../../../hooks/useToast'
import type { ReviewItem } from '@/types'

interface AdminReviewsProps {
  reviews: ReviewItem[]
  setReviews: React.Dispatch<React.SetStateAction<ReviewItem[]>>
}

export default function AdminReviews({ reviews, setReviews }: AdminReviewsProps) {
  const toast = useToast()

  function handleDeleteReview(id: string): void {
    setReviews(prev => prev.filter(r => r.id !== id))
    toast.info('Review deleted')
  }

  return (
    <div className='admin-section'>
      <div className='admin-section-header'>
        <h2 className='admin-section-title'>User Reviews</h2>
        <span className='admin-section-count'>
          {reviews.length} review{reviews.length !== 1 ? 's' : ''}
        </span>
      </div>

      {reviews.length === 0 ? (
        <div className='admin-empty'>
          <i className='bx bx-comment-x' aria-hidden='true'></i>
          <p>No reviews to show.</p>
        </div>
      ) : (
        <div className='admin-reviews-list'>
          {reviews.map(r => (
            <div key={r.id} className='admin-review-card'>
              <div className='admin-review-header'>
                <div className='admin-review-meta'>
                  <span className='admin-review-user'>
                    <i className='bx bx-user' aria-hidden='true'></i>
                    {r.user}
                  </span>
                  <span className='admin-review-title'>
                    on <em>{r.title}</em>
                  </span>
                  <span className='admin-review-date'>{r.date}</span>
                </div>
                <div className='admin-review-right'>
                  <span className='admin-review-rating'>
                    <i className='bx bxs-star' aria-hidden='true'></i>
                    {r.rating}/10
                  </span>
                  <button
                    className='admin-delete-btn'
                    onClick={() => handleDeleteReview(r.id)}
                    aria-label='Delete review'
                    title='Delete review'
                  >
                    <i className='bx bx-trash' aria-hidden='true'></i>
                  </button>
                </div>
              </div>
              <p className='admin-review-text'>{r.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
