const isDev = import.meta.env.DEV;

export const MAPSERVER_URL =
  import.meta.env.VITE_MAPSERVER_URL ||
  (isDev ? 'http://localhost:8081/?' : '/mapserver/?');

export function buildMapServerUrl(queryParams: string): string {
  const base = MAPSERVER_URL;
  const cleanParams = queryParams.replace(/^[?&]/, '');
  if (base.endsWith('?') || base.endsWith('&')) {
    return `${base}${cleanParams}`;
  }
  return base.includes('?') ? `${base}&${cleanParams}` : `${base}?${cleanParams}`;
}
