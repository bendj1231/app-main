/**
 * Comprehensive form validation utility
 * Provides reusable validation functions for common form inputs
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export interface ValidationRule {
  validate: (value: string) => ValidationResult;
}

/**
 * Email validation
 */
export const validateEmail = (email: string): ValidationResult => {
  if (!email) {
    return { isValid: false, error: 'Email is required' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }

  return { isValid: true };
};

/**
 * Password validation
 * - At least 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 */
export const validatePassword = (password: string): ValidationResult => {
  if (!password) {
    return { isValid: false, error: 'Password is required' };
  }

  if (password.length < 8) {
    return { isValid: false, error: 'Password must be at least 8 characters long' };
  }

  if (!/[A-Z]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one uppercase letter' };
  }

  if (!/[a-z]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one lowercase letter' };
  }

  if (!/[0-9]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one number' };
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one special character' };
  }

  return { isValid: true };
};

/**
 * Simple password validation (less strict)
 * - At least 6 characters
 */
export const validateSimplePassword = (password: string): ValidationResult => {
  if (!password) {
    return { isValid: false, error: 'Password is required' };
  }

  if (password.length < 6) {
    return { isValid: false, error: 'Password must be at least 6 characters long' };
  }

  return { isValid: true };
};

/**
 * Required field validation
 */
export const validateRequired = (value: string, fieldName: string): ValidationResult => {
  if (!value || value.trim() === '') {
    return { isValid: false, error: `${fieldName} is required` };
  }

  return { isValid: true };
};

/**
 * Phone number validation
 * Accepts various formats: (123) 456-7890, 123-456-7890, 1234567890
 */
export const validatePhone = (phone: string): ValidationResult => {
  if (!phone) {
    return { isValid: false, error: 'Phone number is required' };
  }

  const phoneRegex = /^[\d\s\-\(\)\+]{10,}$/;
  if (!phoneRegex.test(phone)) {
    return { isValid: false, error: 'Please enter a valid phone number' };
  }

  return { isValid: true };
};

/**
 * URL validation
 */
export const validateUrl = (url: string): ValidationResult => {
  if (!url) {
    return { isValid: false, error: 'URL is required' };
  }

  try {
    new URL(url);
    return { isValid: true };
  } catch {
    return { isValid: false, error: 'Please enter a valid URL' };
  }
};

/**
 * Number validation
 */
export const validateNumber = (value: string, min?: number, max?: number): ValidationResult => {
  if (!value) {
    return { isValid: false, error: 'This field is required' };
  }

  const num = parseFloat(value);
  if (isNaN(num)) {
    return { isValid: false, error: 'Please enter a valid number' };
  }

  if (min !== undefined && num < min) {
    return { isValid: false, error: `Value must be at least ${min}` };
  }

  if (max !== undefined && num > max) {
    return { isValid: false, error: `Value must be at most ${max}` };
  }

  return { isValid: true };
};

/**
 * Date validation (YYYY-MM-DD format)
 */
export const validateDate = (date: string): ValidationResult => {
  if (!date) {
    return { isValid: false, error: 'Date is required' };
  }

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) {
    return { isValid: false, error: 'Please enter a valid date (YYYY-MM-DD)' };
  }

  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) {
    return { isValid: false, error: 'Please enter a valid date' };
  }

  return { isValid: true };
};

/**
 * Date of birth validation (must be at least 13 years old)
 */
export const validateDateOfBirth = (date: string): ValidationResult => {
  const dateValidation = validateDate(date);
  if (!dateValidation.isValid) {
    return dateValidation;
  }

  const birthDate = new Date(date);
  const today = new Date();
  const minAge = 13;
  const maxAge = 120;

  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()) 
    ? age - 1 
    : age;

  if (actualAge < minAge) {
    return { isValid: false, error: `You must be at least ${minAge} years old` };
  }

  if (actualAge > maxAge) {
    return { isValid: false, error: `Please enter a valid date of birth` };
  }

  return { isValid: true };
};

/**
 * Flight hours validation
 */
export const validateFlightHours = (hours: string): ValidationResult => {
  if (!hours) {
    return { isValid: false, error: 'Flight hours are required' };
  }

  const num = parseFloat(hours);
  if (isNaN(num)) {
    return { isValid: false, error: 'Please enter a valid number' };
  }

  if (num < 0) {
    return { isValid: false, error: 'Flight hours cannot be negative' };
  }

  if (num > 50000) {
    return { isValid: false, error: 'Please enter a valid flight hours value' };
  }

  return { isValid: true };
};

/**
 * License ID validation
 */
export const validateLicenseId = (licenseId: string): ValidationResult => {
  if (!licenseId) {
    return { isValid: false, error: 'License ID is required' };
  }

  if (licenseId.length < 3) {
    return { isValid: false, error: 'License ID must be at least 3 characters' };
  }

  if (licenseId.length > 50) {
    return { isValid: false, error: 'License ID must be less than 50 characters' };
  }

  return { isValid: true };
};

/**
 * Pilot ID validation
 */
export const validatePilotId = (pilotId: string): ValidationResult => {
  if (!pilotId) {
    return { isValid: false, error: 'Pilot ID is required' };
  }

  if (pilotId.length < 3) {
    return { isValid: false, error: 'Pilot ID must be at least 3 characters' };
  }

  if (pilotId.length > 50) {
    return { isValid: false, error: 'Pilot ID must be less than 50 characters' };
  }

  return { isValid: true };
};

/**
 * Name validation
 */
export const validateName = (name: string, fieldName: string = 'Name'): ValidationResult => {
  if (!name) {
    return { isValid: false, error: `${fieldName} is required` };
  }

  if (name.trim().length < 2) {
    return { isValid: false, error: `${fieldName} must be at least 2 characters` };
  }

  if (name.length > 100) {
    return { isValid: false, error: `${fieldName} must be less than 100 characters` };
  }

  return { isValid: true };
};

/**
 * Country validation
 */
export const validateCountry = (country: string): ValidationResult => {
  if (!country) {
    return { isValid: false, error: 'Country is required' };
  }

  if (country.length < 2) {
    return { isValid: false, error: 'Please enter a valid country name' };
  }

  return { isValid: true };
};

/**
 * Text area validation
 */
export const validateTextArea = (text: string, fieldName: string, minLength?: number, maxLength?: number): ValidationResult => {
  if (!text) {
    return { isValid: false, error: `${fieldName} is required` };
  }

  if (minLength && text.length < minLength) {
    return { isValid: false, error: `${fieldName} must be at least ${minLength} characters` };
  }

  if (maxLength && text.length > maxLength) {
    return { isValid: false, error: `${fieldName} must be less than ${maxLength} characters` };
  }

  return { isValid: true };
};

/**
 * Validate multiple fields at once
 */
export const validateForm = (fields: Record<string, string>, rules: Record<string, (value: string) => ValidationResult>): {
  isValid: boolean;
  errors: Record<string, string>;
} => {
  const errors: Record<string, string> = {};
  let isValid = true;

  for (const [fieldName, value] of Object.entries(fields)) {
    const rule = rules[fieldName];
    if (rule) {
      const result = rule(value);
      if (!result.isValid) {
        errors[fieldName] = result.error || 'Invalid value';
        isValid = false;
      }
    }
  }

  return { isValid, errors };
};
