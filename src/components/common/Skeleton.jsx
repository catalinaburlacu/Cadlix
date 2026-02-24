import React from 'react';
import './Skeleton.css';

/**
 * Skeleton loading component for better UX during data loading
 */
export default function Skeleton({ type = 'text', width, height, className = '', ...props }) {
  const style = {
    width: width || undefined,
    height: height || undefined,
  };

  return (
    <div 
      className={`skeleton skeleton--${type} ${className}`} 
      style={style}
      aria-hidden="true"
      {...props}
    />
  );
}

/**
 * Skeleton Avatar component
 */
export function SkeletonAvatar({ size = 'medium' }) {
  const sizes = {
    small: '32px',
    medium: '48px',
    large: '64px',
  };

  return (
    <Skeleton 
      type="circle" 
      width={sizes[size]} 
      height={sizes[size]}
      className="skeleton-avatar"
    />
  );
}

/**
 * Skeleton Stats Grid component
 */
export function SkeletonStats({ count = 8 }) {
  return (
    <div className="skeleton-stats">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-stat-item">
          <Skeleton type="text" width="60%" />
          <Skeleton type="text" width="40%" />
        </div>
      ))}
    </div>
  );
}
