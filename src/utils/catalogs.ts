import {getCookie} from "./cookies";
import * as Tabs from "./tabs";
import catalogsJson from '../data/catalogs.json';

export interface Catalog {
  id: number;
  name: string;
  punchout: string;
}

export interface ChangeCatalogHistoryItem {
  catalogId: string;
}

export function getCatalog(id: number): Catalog | undefined {
  return Catalogs.find((catalog) => catalog.id === id);
}

export async function getCurrentCatalog(tab: chrome.tabs.Tab): Promise<string | undefined> {
  let cookie = await getCookie('lpi');
  return cookie?.split(',')[0].split('=')[1] || undefined;
}

/* REDACTED
*/
export const Catalogs: Catalog[] = catalogsJson;