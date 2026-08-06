import { MAPSERVER_URL } from '../shared/config/mapServer';

export class MapServerService {
  static buildUrl(queryParams: string): string {
    const base = MAPSERVER_URL;
    const cleanParams = queryParams.replace(/^[?&]/, '');
    if (base.endsWith('?') || base.endsWith('&')) {
      return `${base}${cleanParams}`;
    }
    return base.includes('?') ? `${base}&${cleanParams}` : `${base}?${cleanParams}`;
  }

  static async fetchText(queryParams: string): Promise<string> {
    const response = await fetch(this.buildUrl(queryParams));
    if (!response.ok) {
      throw new Error(`MapServer request failed: ${response.status}`);
    }
    return response.text();
  }

  static async fetchJson(queryParams: string): Promise<any> {
    const response = await fetch(this.buildUrl(queryParams));
    if (!response.ok) {
      throw new Error(`MapServer request failed: ${response.status}`);
    }
    return response.json();
  }
}
