/**
 * HTML Sanitization Utility
 * Prevents XSS attacks by sanitizing HTML content using DOMPurify
 */

import DOMPurify from 'dompurify';

/**
 * Sanitizes HTML content to prevent XSS attacks
 * Allows basic formatting tags (b, i, em, strong, p, br, ul, ol, li, a)
 * 
 * @param html - The HTML string to sanitize
 * @returns Sanitized HTML string
 */
export function sanitizeHtml(html: string): string {
  if (!html || typeof html !== 'string') {
    return '';
  }

  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li', 'a', 'span'],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class'],
    ALLOW_DATA_ATTR: false,
    FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form', 'input', 'button'],
    FORBID_ATTR: ['onclick', 'onerror', 'onload', 'onmouseover', 'onfocus', 'onblur'],
    FORCE_BODY: false,
  });
}

/**
 * Sanitizes HTML content with custom allowed tags
 * Use this when you need more permissive sanitization for specific use cases
 * 
 * @param html - The HTML string to sanitize
 * @param allowedTags - Array of allowed HTML tags
 * @param allowedAttrs - Array of allowed HTML attributes
 * @returns Sanitized HTML string
 */
export function sanitizeHtmlCustom(
  html: string,
  allowedTags: string[] = ['b', 'i', 'em', 'strong', 'p', 'br'],
  allowedAttrs: string[] = ['class']
): string {
  if (!html || typeof html !== 'string') {
    return '';
  }

  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: allowedTags,
    ALLOWED_ATTR: allowedAttrs,
    ALLOW_DATA_ATTR: false,
    FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form', 'input', 'button'],
    FORBID_ATTR: ['onclick', 'onerror', 'onload', 'onmouseover', 'onfocus', 'onblur'],
    FORCE_BODY: false,
  });
}

/**
 * Sanitizes JSON-LD schema content
 * This is a special case since JSON-LD uses JSON.stringify which is generally safe,
 * but we add validation to ensure the content is valid JSON
 * 
 * @param schema - The schema object to stringify and validate
 * @returns Sanitized JSON string
 */
export function sanitizeJsonLd(schema: object): string {
  try {
    const jsonString = JSON.stringify(schema);
    // Validate it's valid JSON
    JSON.parse(jsonString);
    return jsonString;
  } catch (error) {
    console.error('Invalid JSON-LD schema:', error);
    return '{}';
  }
}
