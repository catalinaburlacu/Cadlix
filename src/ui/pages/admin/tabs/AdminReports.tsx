import type { ReportItem } from '@/types'

interface AdminReportsProps {
  reports: ReportItem[]
  onResolve: (id: string) => void
  onDismiss: (id: string) => void
  onSelectReport: (report: ReportItem) => void
}

export default function AdminReports({ reports, onResolve, onDismiss, onSelectReport }: AdminReportsProps) {
  const pending = reports.filter(r => r.status === 'Pending').length

  return (
    <div className='admin-section'>
      <div className='admin-section-header'>
        <h2 className='admin-section-title'>User Reports</h2>
        <span className='admin-section-count'>
          {pending} pending · {reports.length} total
        </span>
      </div>

      {reports.length === 0 ? (
        <div className='admin-empty'>
          <i className='bx bx-check-shield' aria-hidden='true'></i>
          <p>No reports to show.</p>
        </div>
      ) : (
        <div className='admin-table-wrap'>
          <table className='admin-table'>
            <thead>
              <tr>
                <th>Reporter</th>
                <th>Target</th>
                <th>Type</th>
                <th>Reason</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map(rep => (
                <tr
                  key={rep.id}
                  className='admin-table-row--clickable'
                  onClick={() => onSelectReport(rep)}
                >
                  <td className='admin-table-username'>{rep.reporter}</td>
                  <td className='admin-table-email'>{rep.target}</td>
                  <td>
                    <span className='admin-type-badge'>{rep.targetType}</span>
                  </td>
                  <td className='admin-table-username' style={{ fontWeight: 500 }}>
                    {rep.reason}
                  </td>
                  <td className='admin-table-date'>{rep.date}</td>
                  <td>
                    <span
                      className={`admin-report-status admin-report-status--${rep.status.toLowerCase()}`}
                    >
                      {rep.status}
                    </span>
                  </td>
                  <td>
                    <div className='admin-report-actions' onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                      {rep.status === 'Pending' && (
                        <>
                          <button
                            className='admin-action-btn admin-action-btn--resolve'
                            onClick={() => onResolve(rep.id)}
                            title='Mark as resolved'
                            aria-label='Resolve report'
                          >
                            <i className='bx bx-check' aria-hidden='true'></i>
                          </button>
                          <button
                            className='admin-action-btn admin-action-btn--dismiss'
                            onClick={() => onDismiss(rep.id)}
                            title='Dismiss report'
                            aria-label='Dismiss report'
                          >
                            <i className='bx bx-x' aria-hidden='true'></i>
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
