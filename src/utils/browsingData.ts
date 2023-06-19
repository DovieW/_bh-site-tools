import * as App from '../App';

export function clearSiteData() {
  if (!App.isRunningAsExtension) return;
  chrome.browsingData.remove({
    "origins": ["REDACTED"]
  }, {
    "cache": true,
    "cookies": true,
    "fileSystems": true,
    "indexedDB": true,
    "localStorage": true,
    "serviceWorkers": true,
    "webSQL": true
  });
}