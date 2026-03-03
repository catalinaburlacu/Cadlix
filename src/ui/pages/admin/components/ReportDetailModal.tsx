import type { ReportItem } from '@/types'

interface ReportDetailModalProps {
  report: ReportItem | null
  onClose: () => void
  onResolve: (id: string) => void
  onDismiss: (id: string) => void
}

export default function ReportDetailModal({ report: rep, onClose, onResolve, onDismiss }: ReportDetailModalProps) {
  if (!rep) return null
  return (
    <div className='admin-modal-overlay' onClick={onClose}>
      <div
        className='admin-modal admin-modal--report'
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        role='dialog'
        aria-modal='true'
        aria-label={`Report #${rep.id}`}
      >
        <button className='admin-modal-close' onClick={onClose} aria-label='Close'>
          <i className='bx bx-x'></i>
        </button>

        <div className='admin-report-modal-header'>
          <div className='admin-report-modal-title-row'>
            <i className='bx bx-flag admin-report-modal-icon' aria-hidden='true'></i>
            <h2 className='admin-report-modal-title'>Report Details</h2>
          </div>
          <span className={`admin-report-status admin-report-status--${rep.status.toLowerCase()}`}>
            {rep.status}
          </span>
        </div>

        <div className='admin-report-modal-meta'>
          <div className='admin-report-modal-row'>
            <span className='admin-report-modal-label'>Reporter</span>
            <span className='admin-report-modal-value'>
              <i className='bx bx-user' aria-hidden='true'></i>
              {rep.reporter}
            </span>
          </div>
          <div className='admin-report-modal-row'>
            <span className='admin-report-modal-label'>Target</span>
            <span className='admin-report-modal-value'>{rep.target}</span>
          </div>
          <div className='admin-report-modal-row'>
            <span className='admin-report-modal-label'>Target Type</span>
            <span className='admin-type-badge'>{rep.targetType}</span>
          </div>
          <div className='admin-report-modal-row'>
            <span className='admin-report-modal-label'>Reason</span>
            <span className='admin-report-modal-value admin-report-modal-reason'>{rep.reason}</span>
          </div>
          <div className='admin-report-modal-row'>
            <span className='admin-report-modal-label'>Date</span>
            <span className='admin-report-modal-value'>{rep.date}</span>
          </div>
        </div>

        <div className='admin-report-modal-desc-block'>
          <span className='admin-report-modal-label'>Description</span>
          <p className='admin-report-modal-desc'>{rep.description}</p>
        </div>

        {rep.status === 'Pending' && (
          <div className='admin-report-modal-actions'>
            <button
              className='admin-report-modal-btn admin-report-modal-btn--resolve'
              onClick={() => {
                onResolve(rep.id)
                onClose()
              }}
            >
              <i className='bx bx-check' aria-hidden='true'></i>
              Mark as Resolved
            </button>
            <button
              className='admin-report-modal-btn admin-report-modal-btn--dismiss'
              onClick={() => {
                onDismiss(rep.id)
                onClose()
              }}
            >
              <i className='bx bx-x' aria-hidden='true'></i>
              Dismiss
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
