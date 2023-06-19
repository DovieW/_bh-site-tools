import React, {createContext } from 'react';
import {StoragePagesTool} from '../pages/tools/PagesTool';

export interface PagesContextValue {
  pagesContext: StoragePagesTool, 
  setPagesContext: React.Dispatch<React.SetStateAction<StoragePagesTool>>
}

export const PagesContext = createContext<PagesContextValue>({} as any);