import { useId, type ReactNode } from 'react'
import './Input.css'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  touched?: boolean
  icon?: ReactNode
  className?: string
}

export default function Input({
  label,
  error,
  helperText,
  touched,
  icon,
  className = '',
  id,
  ...props
}: InputProps) {
  const generatedId = useId()
  const inputId = id || generatedId
  const hasError = !!error && !!touched

  return (
    <div className={`input-wrapper ${className}`}>
      {label && (
        <label htmlFor={inputId} className='input-label'>
          {label}
          {props.required && (
            <span className='input-required' aria-hidden='true'>
              *
            </span>
          )}
        </label>
      )}
      <div
        className={`input-container ${hasError ? 'input-container--error' : ''} ${icon ? 'input-container--with-icon' : ''}`}
      >
        {icon && (
          <span className='input-icon' aria-hidden='true'>
            {icon}
          </span>
        )}
        <input
          id={inputId}
          className={`input-field ${hasError ? 'input-field--error' : ''}`}
          aria-invalid={hasError}
          aria-describedby={
            hasError ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
          }
          {...props}
        />
      </div>
      {hasError ? (
        <span id={`${inputId}-error`} className='input-error' role='alert'>
          {error}
        </span>
      ) : helperText ? (
        <span id={`${inputId}-helper`} className='input-helper'>
          {helperText}
        </span>
      ) : null}
    </div>
  )
}
