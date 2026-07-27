/**
 * Low-level fetch shape both instances expose (raw `RequestInit`). Used
 * internally by the client/server wrappers.
 */
export type ApiFetch = <T>(path: string, options?: RequestInit) => Promise<T>;

/**
 * Request options for the high-level `ApiClient.request`. Same as `RequestInit`
 * except `body` may be a plain object (auto-JSON), a `FormData` (multipart —
 * the Content-Type is left to the browser), or any native `BodyInit`.
 */
export type ApiRequestOptions = Omit<RequestInit, 'body'> & { body?: unknown };

/**
 * High-level API surface consumed by feature services. `request<T>` returns the
 * parsed response body directly. A service accepts an `ApiClient` so the same
 * method runs on the client (browser instance) or during a server prefetch
 * (cookie-forwarding instance).
 */
export interface ApiClient {
  request: <T>(path: string, options?: ApiRequestOptions) => Promise<T>;
}
