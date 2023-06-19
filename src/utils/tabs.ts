import * as App from '../App';
import {getFakeCurrentTab} from './defaultData';

export async function getCurrentTab(): Promise<chrome.tabs.Tab> {
    if (!App.isRunningAsExtension) return getFakeCurrentTab();
    const tabs = await chrome.tabs.query({active: true, currentWindow: true});
    return tabs[0];
}

export async function getTabById(tabId: number): Promise<chrome.tabs.Tab> {
  if (!App.isRunningAsExtension) return getFakeCurrentTab();
  return await chrome.tabs.get(tabId);
}

export function reloadTab(tabId: number = App.currentTab!.id!): void {
  if (!App.isRunningAsExtension || 
    (!App.isOnBh && tabId === App.currentTab.id) // prevent reload on non B&H tabs
    ) return;
  chrome.tabs.reload(tabId);
}

export function getEnvFromHostname(hostname: string): string {
  const result = hostname.match(/(\/\/)?(.*).bhphotovideo/);
  return result ? result[2] : '';
}

export function getHostnameFromTab(tab: chrome.tabs.Tab): string { // example return: 'https://www.bhphotovideo.com:8080' port optional
  const result = tab && tab.url ? tab.url.match(/(.*\.com(:[0-9]{1,4})?)/) : '';
  return result ? result[1] : '';
}

export function getHostnameFromString(url: string): string { // example return: 'https://www.bhphotovideo.com:8080' port optional
  const result = url.match(/(.*\.com(:[0-9]{1,4})?)/);
  return result ? result[1] : '';
}

export function getPathFromTab(tab: chrome.tabs.Tab): string {
  if (!tab || !tab.url) return '';
  const url = new URL(tab.url);
  return url.pathname + url.search;
}

export async function navigate(
  url: string,
  newTab: boolean = false,
  copyUrl: boolean = false,
  newTabFocus: boolean = true,
  incognito: boolean = false,
) {
  if (!App.isRunningAsExtension) return null;
  if (incognito) return await chrome.windows.create({url: url, incognito: true, focused: true, state: 'maximized'});

  let result: null | chrome.tabs.Tab = null;
  if (copyUrl) {
    navigator.clipboard.writeText(url);
  } else if (newTab || !App.isRunningAsExtension) {
    result = await chrome.tabs.create({url: url, index: App.currentTab.index + 1, active: newTabFocus});
  } else {
    chrome.tabs.update({
      url: url,
    });
    window.close();
  }
  return result;
}

export function ifCurrentTabIsBh(tab: chrome.tabs.Tab): boolean {
  if (!App.isRunningAsExtension) return false;
  if (tab && tab.url && tab.url.includes('bhphotovideo')) {
    return true;
  }
  return false;
}

export function isUrlProd(url: string): boolean {
  if (url.includes('bhphotovideo')) {
    if (url.includes('www') || url.includes('REDACTED')) {
      return true;
    }
    return false;
  }
  return false;
}

export const splunkDevDomain = 'REDACTED';
export const splunkProdDomain = 'REDACTED';

export async function executeScript(code: (...args: any[]) => any, args: any[] = []): Promise<any> {
  if (!App.isRunningAsExtension || App.currentTab.url?.startsWith('chrome://')) return null; // executeScript doesn't work on chrome:// pages
  try {
    let result = await chrome.scripting.executeScript({
      world: 'MAIN',
      target : {tabId : App.currentTab.id!},
      func: code,
      args: args,
    }).then(
      (r) => {
        return r;
      }
    );
    return result[0].result;
  } catch (e) {console.error(e);}
}

export declare var BH: any;
export async function isAperturePage(): Promise<boolean> {
  const result = await executeScript(() => typeof BH !== "undefined" && BH !== null && BH.hasOwnProperty('REDACTED'));
  return result ? result : false;
}

export function closeTab(index: number) {
  if (!App.isRunningAsExtension) return;
  chrome.tabs.remove(index);
}

export function sendMessage(message: any) {
  if (!App.isRunningAsExtension) return;
  chrome.tabs.sendMessage(App.currentTab.id!, message);
}

export function addMessageListener(callback: (message: any, sender: chrome.runtime.MessageSender, sendResponse: (response: any) => void) => void) {
  if (!App.isRunningAsExtension) return;
  chrome.runtime.onMessage.addListener(callback);
}

export function removeMessageListener(callback: (message: any, sender: chrome.runtime.MessageSender, sendResponse: (response: any) => void) => void) {
  if (!App.isRunningAsExtension) return;
  chrome.runtime.onMessage.removeListener(callback);
}

export function onUpdatedAddListener(callback: (tabId: number, changeInfo: any, tab: chrome.tabs.Tab) => void) {
  if (!App.isRunningAsExtension) return;
  chrome.tabs.onUpdated.addListener(callback);
}