import React, { useId } from 'react';
import PropTypes from 'prop-types';
import './Input.css';

/**
 * Reusable Input component with validation support
 * @param {string} label - Input label
 * @param {string} error - Error message
 * @param {string} helperText - Helper text below input
 * @param {boolean} touched - Whether field has been touched
 * @param {React.ReactNode} icon - Icon to display inside input
 */
export default function Input({
  label,
  error,
  helperText,
  touched,
  icon,
  className = '',
  id,
  ...props
}) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const hasError = error && touched;

  return (
    <div className={`input-wrapper ${className}`}>
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
          {props.required && <span className="input-required" aria-hidden="true">*</span>}
        </label>
      )}
      <div className={`input-container ${hasError ? 'input-container--error' : ''} ${icon ? 'input-container--with-icon' : ''}`}>
        {icon && <span className="input-icon" aria-hidden="true">{icon}</span>}
        <input
          id={inputId}
          className={`input-field ${hasError ? 'input-field--error' : ''}`}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          {...props}
        />
      </div>
      {hasError ? (
        <span id={`${inputId}-error`} className="input-error" role="alert">
          {error}
        </span>
      ) : helperText ? (
        <span id={`${inputId}-helper`} className="input-helper">
          {helperText}
        </span>
      ) : null}
    </div>
  );
}

Input.propTypes = {
  label: PropTypes.string,
  error: PropTypes.string,
  helperText: PropTypes.string,
  touched: PropTypes.bool,
  icon: PropTypes.node,
  className: PropTypes.string,
  id: PropTypes.string,
  required: PropTypes.bool,
  type: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
};
