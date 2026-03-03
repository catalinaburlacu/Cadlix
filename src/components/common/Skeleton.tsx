import './Skeleton.css'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: 'text' | 'circle' | 'rect'
  width?: string
  height?: string
  className?: string
}

export default function Skeleton({ type = 'text', width, height, className = '', ...props }: SkeletonProps) {
  const style: React.CSSProperties = {
    width: width || undefined,
    height: height || undefined,
  }

  return (
    <div
      className={`skeleton skeleton--${type} ${className}`}
      style={style}
      aria-hidden='true'
      {...props}
    />
  )
}

interface SkeletonAvatarProps {
  size?: 'small' | 'medium' | 'large'
}

export function SkeletonAvatar({ size = 'medium' }: SkeletonAvatarProps) {
  const sizes: Record<'small' | 'medium' | 'large', string> = {
    small: '32px',
    medium: '48px',
    large: '64px',
  }

  return (
    <Skeleton type='circle' width={sizes[size]} height={sizes[size]} className='skeleton-avatar' />
  )
}

interface SkeletonStatsProps {
  count?: number
}

export function SkeletonStats({ count = 8 }: SkeletonStatsProps) {
  return (
    <div className='skeleton-stats'>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className='skeleton-stat-item'>
          <Skeleton type='text' width='60%' />
          <Skeleton type='text' width='40%' />
        </div>
      ))}
    </div>
  )
}
