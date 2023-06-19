chrome.runtime.onInstalled.addListener(async () => {
  chrome.contextMenus.create({
    id: 'bh-search',
    title: 'Search B&&H \' %s \'',
    type: 'normal',
    contexts: ['selection']
  });
});

chrome.contextMenus.onClicked.addListener((item, tab) => {
  if (item.menuItemId === 'bh-search') chrome.tabs.create({ url: `https://www.bhphotovideo.com/c/search?Ntt=${item.selectionText}`});
});

chrome.commands.onCommand.addListener((command, tab) => {
  if (command === 'duplicate-tab') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.create({ url: tabs[0].url, index: tabs[0].index + 1 });
    });
  } else if (command === 'pin-tab') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.update(tabs[0].id, { pinned: !tabs[0].pinned });
    });
  } else if (command === 'go-incognito') {
    chrome.windows.create({ url: tab.url, incognito: true, focused: true, state: 'maximized' });
  } else if (command === 'expand-collapse-tools') {
    chrome.runtime.sendMessage('expand-collapse-tools');
  }
});