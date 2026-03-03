interface StatCard {
  label: string
  value: string | number
  icon: string
  color: string
}

interface StatCardsProps {
  cards: StatCard[]
}

export default function StatCards({ cards }: StatCardsProps) {
  return (
    <div className='admin-stats-grid'>
      {cards.map(card => (
        <div key={card.label} className={`admin-stat-card admin-stat-card--${card.color}`}>
          <div className='admin-stat-icon'>
            <i className={`bx ${card.icon}`} aria-hidden='true'></i>
          </div>
          <div className='admin-stat-info'>
            <span className='admin-stat-value'>{card.value}</span>
            <span className='admin-stat-label'>{card.label}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
