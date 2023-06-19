import {createContext} from "react";

export type CoreContext = {
  currentTab: chrome.tabs.Tab;
  isPageLoaded: boolean;
  isOnBh: boolean;
  isAperturePage: boolean;
}

export type CoreContextType = {
  coreContext: CoreContext,
  setCoreContext: React.Dispatch<React.SetStateAction<CoreContext>>
};

export const CoreContext = createContext<CoreContextType>({} as CoreContextType);