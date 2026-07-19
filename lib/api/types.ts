/**
 * The shared shape both API instances expose. Services accept a value of this
 * type so the exact same service function can run against either the client
 * (`apiFetch`) or the server (`serverApiFetch`) instance.
 */
export type ApiFetch = <T>(path: string, options?: RequestInit) => Promise<T>;
