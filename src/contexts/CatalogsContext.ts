import React from 'react';
import {StorageCatalogsTool} from '../pages/tools/CatalogTool';

export interface CatalogsContextValue {
  catalogsContext: StorageCatalogsTool,
  setCatalogsContext: React.Dispatch<React.SetStateAction<StorageCatalogsTool>>
}

export const CatalogsContext = React.createContext<CatalogsContextValue>({} as any);