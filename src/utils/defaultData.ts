import {AtcHistoryItem} from "../pages/tools/AtcTool";
import {StorageCatalogsTool} from "../pages/tools/CatalogTool";
import {StoragePagesTool} from "../pages/tools/PagesTool";
import {StorageAlerts} from "../pages/tools/ToolsList";

export const isToolsExpanded = {catalogs: false, pages: false, atc: false, actions: false, location: false};

export const pagesTool: StoragePagesTool = {
  pages: [{name: 'Orders', path: 'REDACTED'}, {name: 'Cart', path: '/a/cart'}, {name: 'Item', path: '/c/product/834774-REG/Sensei_CK_L_Cap_Keeper_for_Lens.html'}],
  environments: [
    REDACTED
  ],
  // lastUsed: {
  //   page: {name: 'Home', path: '/'},
  //   environment: {name: 'ASF', hostname: 'REDACTED'},
  //   useCurrEnv: true,
  //   useCurrPage: false
  // }
}

export const catalogsTool: StorageCatalogsTool = {
  // changeCatalogHistory: [{catalogId: '2'}, {catalogId: '3'}, {catalogId: '4'}],
  changeCatalogHistory: [],
  settings: {
    prefillCatalog: true,
  }
};

export const atcTool = {
  history: [{item: 'SECKL', qty: 1}, {item: '1719563-REG', qty: 1}] as AtcHistoryItem[],
};

export const alerts: StorageAlerts = {
  notOnBhPage: true
}

export function getFakeCurrentTab(): chrome.tabs.Tab{
  return {"REDACTED};
}