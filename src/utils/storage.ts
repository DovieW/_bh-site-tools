import {ToolName} from './catalogTool';
import * as App from '../App';

export enum StorageKey{
  TOOLS_IS_EXPANDED = 'toolsIsExpanded',
  ALERTS = 'alerts',
  LAST_USED_TOOL = 'lastUsedTool'
}

export async function getStorage(key: StorageKey | ToolName | null): Promise<any> {
  if (!App.isRunningAsExtension) return undefined;
  return await chrome.storage.sync.get(key);
}

export async function getStorageWithDefault<T>(key: string, defaultValue: T): Promise<{[key: string]: T}> {
  if (!App.isRunningAsExtension) return {[key]: defaultValue};
  return await chrome.storage.sync.get({[key]: defaultValue}) as {[key: string]: T};
}

export function setStorageWithKey(key: StorageKey | ToolName, value: any): void {
  if (!App.isRunningAsExtension) return;
  chrome.storage.sync.set({[key]: value});
}

export async function setStorage(obj: any): Promise<void> {
  if (!App.isRunningAsExtension) return;
  await chrome.storage.sync.set(obj);
}

export async function clearStorage(): Promise<void> {
  if (!App.isRunningAsExtension) return;
  await chrome.storage.sync.clear();
}

export function removeStorageWithKey(key: StorageKey | ToolName): void {
  if (!App.isRunningAsExtension) return;
  chrome.storage.sync.remove(key);
}