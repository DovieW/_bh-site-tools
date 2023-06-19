import * as App from '../App';

export async function getCookie(name: string): Promise<string | undefined> {
  if (!App.isRunningAsExtension) return undefined;
  const store = await getCookieStoreId();
  let cookie = await chrome.cookies.get({name: name, url: allEnvUrl, storeId: store});
  return cookie ? cookie.value : '';
}

// get all cookies
export async function getAllCookies(): Promise<chrome.cookies.Cookie[]> {
  if (!App.isRunningAsExtension) return [];
  const store = await getCookieStoreId();
  let cookies = await chrome.cookies.getAll({domain: allDomain, storeId: store});
  return cookies;
}

export async function setCookie(name: string, value: string): Promise<void> {
  if (!App.isRunningAsExtension) return;
  const store = await getCookieStoreId();
  await chrome.cookies.set({name: name, value: value, url: allEnvUrl, domain: allDomain, storeId: store});
}

export function addListener(callback: (changeInfo: chrome.cookies.CookieChangeInfo) => void): void {
  if (!App.isRunningAsExtension) return;
  chrome.cookies.onChanged.addListener(callback);
}

export async function removeCookie(name: string): Promise<void> {
  if (!App.isRunningAsExtension) return;
  const store = await getCookieStoreId();
  chrome.cookies.remove({name: name, url: allEnvUrl, storeId: store});
}

async function getCookieStoreId(): Promise<string> {
  const stores = await chrome.cookies.getAllCookieStores();
  const store = stores.find(store => store.tabIds.includes(App.currentTab.id!));
  return store ? store.id : '';
}

REDACTED