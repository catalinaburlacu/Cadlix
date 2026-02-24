/**
 * XSS Prevention - Sanitize user input
 * @param {string} input - Raw user input
 * @returns {string} Sanitized input
 */
export function sanitizeInput(input) {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Sanitize object values recursively
 * @param {Object} obj - Object to sanitize
 * @returns {Object} Sanitized object
 */
export function sanitizeObject(obj) {
  if (typeof obj !== 'object' || obj === null) {
    return sanitizeInput(obj);
  }

  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }

  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    sanitized[key] = sanitizeObject(value);
  }
  return sanitized;
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Is valid email
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} Validation result with strength score
 */
export function validatePassword(password) {
  const result = {
    isValid: false,
    score: 0,
    errors: [],
  };

  if (!password || password.length < 8) {
    result.errors.push('Password must be at least 8 characters long');
  } else {
    result.score += 1;
  }

  if (!/[A-Z]/.test(password)) {
    result.errors.push('Password must contain at least one uppercase letter');
  } else {
    result.score += 1;
  }

  if (!/[a-z]/.test(password)) {
    result.errors.push('Password must contain at least one lowercase letter');
  } else {
    result.score += 1;
  }

  if (!/[0-9]/.test(password)) {
    result.errors.push('Password must contain at least one number');
  } else {
    result.score += 1;
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    result.errors.push('Password must contain at least one special character');
  } else {
    result.score += 1;
  }

  result.isValid = result.score >= 4;
  return result;
}

/**
 * Generate secure random token
 * @param {number} length - Token length
 * @returns {string} Random token
 */
export function generateToken(length = 32) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const randomValues = new Uint8Array(length);
  crypto.getRandomValues(randomValues);
  return Array.from(randomValues, (byte) => chars[byte % chars.length]).join('');
}
