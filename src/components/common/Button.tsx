import './Button.css'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'accent'
  size?: 'small' | 'medium' | 'large'
  isLoading?: boolean
}

export default function Button({
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  disabled = false,
  children,
  className = '',
  type = 'button',
  ...props
}: ButtonProps) {
  const baseClass = 'btn'
  const variantClass = `btn--${variant}`
  const sizeClass = `btn--${size}`
  const loadingClass = isLoading ? 'btn--loading' : ''
  const disabledClass = disabled ? 'btn--disabled' : ''

  return (
    <button
      type={type}
      className={`${baseClass} ${variantClass} ${sizeClass} ${loadingClass} ${disabledClass} ${className}`}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading && <span className='btn__spinner' aria-hidden='true' />}
      <span className={`btn__content ${isLoading ? 'btn__content--hidden' : ''}`}>{children}</span>
    </button>
  )
}
