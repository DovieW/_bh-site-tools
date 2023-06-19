import * as App from '../App';

export async function saveJsObjectAsFile(object: any, filename: string): Promise<void> {
    if (!App.isRunningAsExtension) return;

    const json = JSON.stringify(object);
    var blob = new Blob([json], {type: 'application/json'});
    var url = URL.createObjectURL(blob);

    chrome.downloads.download({
      url: url,
      filename: filename,
      saveAs: true
    });
}