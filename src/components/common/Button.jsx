import React from 'react';
import PropTypes from 'prop-types';
import './Button.css';

/**
 * Reusable Button component with variants
 * @param {string} variant - Button style variant (primary, secondary, danger, ghost)
 * @param {string} size - Button size (small, medium, large)
 * @param {boolean} isLoading - Show loading state
 * @param {boolean} disabled - Disable button
 * @param {React.ReactNode} children - Button content
 * @param {Function} onClick - Click handler
 */
export default function Button({
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  disabled = false,
  children,
  className = '',
  type = 'button',
  ...props
}) {
  const baseClass = 'btn';
  const variantClass = `btn--${variant}`;
  const sizeClass = `btn--${size}`;
  const loadingClass = isLoading ? 'btn--loading' : '';
  const disabledClass = disabled ? 'btn--disabled' : '';

  return (
    <button
      type={type}
      className={`${baseClass} ${variantClass} ${sizeClass} ${loadingClass} ${disabledClass} ${className}`}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading && <span className="btn__spinner" aria-hidden="true" />}
      <span className={`btn__content ${isLoading ? 'btn__content--hidden' : ''}`}>
        {children}
      </span>
    </button>
  );
}

Button.propTypes = {
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger', 'ghost', 'accent']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  isLoading: PropTypes.bool,
  disabled: PropTypes.bool,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  onClick: PropTypes.func,
};
