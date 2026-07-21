import type { ApiRequestOptions } from './types';

/** Passed through as-is (the browser/undici sets the right Content-Type). */
function isRawBody(body: unknown): body is BodyInit {
  return (
    typeof body === 'string' ||
    body instanceof FormData ||
    body instanceof Blob ||
    body instanceof ArrayBuffer ||
    body instanceof URLSearchParams ||
    (typeof ReadableStream !== 'undefined' && body instanceof ReadableStream)
  );
}

/**
 * Normalizes high-level `ApiRequestOptions` into a native `RequestInit`:
 * - `FormData` / other raw bodies pass through untouched (multipart etc.);
 * - a plain object is JSON-stringified;
 * - `undefined`/`null` bodies are dropped.
 *
 * Content-Type is decided by the low-level fetch wrapper (JSON unless the body
 * is `FormData`).
 */
export function toRequestInit(options?: ApiRequestOptions): RequestInit {
  if (!options) return {};
  const { body, ...rest } = options;
  if (body === undefined || body === null) return rest;
  if (isRawBody(body)) return { ...rest, body };
  return { ...rest, body: JSON.stringify(body) };
}
