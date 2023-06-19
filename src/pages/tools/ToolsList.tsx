import { Container, Stack, Button, Collapse, Box, Paper, Alert, Snackbar } from '@mui/material';
import { useState, useEffect, useRef } from 'react';
import CatalogTool from './CatalogTool';
import * as Storage from '../../utils/storage';
import {PagesTool, StoragePagesTool} from './PagesTool';
import {useLoaderData} from 'react-router-dom';
import {PagesContext, PagesContextValue} from '../../contexts/PagesContext';
import * as DefaultData from '../../utils/defaultData';
import {ToolName} from '../../utils/catalogTool';
import {ActionsTool} from './ActionsTool';
import {AtcToolContext, AtcToolContextType} from '../../contexts/AtcContext';

import {DateTool} from './DateTool';
import {LocationTool} from './LocationTool';
import StoreIcon from '@mui/icons-material/Store';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';
import scrollIntoView from 'scroll-into-view-if-needed';
import * as App from '../../App';
import {AtcToolStorage, AtcTool} from './AtcTool';
import * as Tabs from '../../utils/tabs';

export interface StorageAlerts {
  notOnBhPage: boolean;
}

export interface StorageToolsIsExpanded {
  [ToolName.CATALOGS]: boolean;
  [ToolName.PAGES]: boolean;
  [ToolName.DATE]: boolean;
  [ToolName.ATC]: boolean;
  [ToolName.LOCATION]: boolean;
  [ToolName.ACTIONS]: boolean;
}

export interface ToolsPreloadData {
  toolsIsExpanded: StorageToolsIsExpanded;
  pagesTool: StoragePagesTool;
  atcTool: AtcToolStorage;
  alerts: StorageAlerts;
  lastUsedTool: ToolName | undefined;
}

export async function preloadTools(): Promise<ToolsPreloadData>{
  const storageAlerts = await Storage.getStorageWithDefault(Storage.StorageKey.ALERTS, DefaultData.alerts);
  const storageIsExpanded = await Storage.getStorageWithDefault(Storage.StorageKey.TOOLS_IS_EXPANDED, DefaultData.isToolsExpanded);
  const storagePagesData = await Storage.getStorageWithDefault(ToolName.PAGES, DefaultData.pagesTool);
  const storageAtcData = await Storage.getStorageWithDefault(ToolName.ATC, DefaultData.atcTool) as {[ToolName.ATC]: AtcToolStorage};
  const storageLastUsedTool = await Storage.getStorage(Storage.StorageKey.LAST_USED_TOOL) as {[Storage.StorageKey.LAST_USED_TOOL]: ToolName};

  // console.log('storageAtcData', storageAtcData);
  // if (storageAtcData?.history) { // accounting for history items from an older version history object
  //   storageAtcData.history = storageAtcData.history.filter(item => !!item.item);
  //   if (!storageAtcData.history) {
  //     storageAtcData.history = DefaultData.atcTool.history;
  //   }
  // }
  // console.log('storageAtcData', storageAtcData);

  return {
    toolsIsExpanded: storageIsExpanded[Storage.StorageKey.TOOLS_IS_EXPANDED],
    pagesTool: storagePagesData[ToolName.PAGES],
    atcTool: storageAtcData[ToolName.ATC],
    alerts: storageAlerts[Storage.StorageKey.ALERTS],
    lastUsedTool: storageLastUsedTool?.[Storage.StorageKey.LAST_USED_TOOL] ?? undefined
  } as ToolsPreloadData;
}
  
function getButtonSx(isToolExpanded: boolean) {
  const def = {
    justifyContent: 'flex-start',
    paddingLeft: '13px',
  };
  if (isToolExpanded) {
    return {
      ...def,
      backgroundColor: 'rgb(144 192 154 / 30%)',
      '&:hover': {
        backgroundColor: 'rgb(144 192 154 / 40%)'
      }
    }
  } else {
    return def;
  }
}

export function Tools() {
  const [data, setData] = useState(useLoaderData() as ToolsPreloadData);
  const [alerts, setAlerts] = useState(data.alerts);
  const lastUsedTool = useRef(data.lastUsedTool);

  const [isCatalogToolExpanded, setIsCatalogToolExpanded] = useState(data.toolsIsExpanded[ToolName.CATALOGS]);
  const [isPagesToolExpanded, setIsPagesToolExpanded] = useState(data.toolsIsExpanded[ToolName.PAGES]);
  const [isDateToolExpanded, setIsDateToolExpanded] = useState(data.toolsIsExpanded[ToolName.DATE]);
  const [isAtcToolExpanded, setIsAtcToolExpanded] = useState(data.toolsIsExpanded[ToolName.ATC]);
  const [isLocationToolExpanded, setIsLocationToolExpanded] = useState(data.toolsIsExpanded[ToolName.LOCATION]);
  const [isActionsToolExpanded, setIsActionsToolExpanded] = useState(data.toolsIsExpanded[ToolName.ACTIONS]);

  const catalogsToolRef = useRef<HTMLDivElement>(null);
  const pagesToolRef = useRef<HTMLDivElement>(null);
  const dateToolRef = useRef<HTMLDivElement>(null);
  const atcToolRef = useRef<HTMLDivElement>(null);
  const locationToolRef = useRef<HTMLDivElement>(null);
  const actionsToolRef = useRef<HTMLDivElement>(null);

  const timeToScroll = 300;
  const scrollOptions = {scrollMode: 'if-needed', block: 'end', behavior: 'smooth'} as const;

  const setLastUsedTool = (tool: ToolName) => {
    if (tool !== lastUsedTool.current) {
      lastUsedTool.current = tool;
      Storage.setStorageWithKey(Storage.StorageKey.LAST_USED_TOOL, tool);
    }
  };
  const catalogsSet = (): void => setLastUsedTool(ToolName.CATALOGS);
  const pagesSet = (): void => setLastUsedTool(ToolName.PAGES);
  const dateSet = (): void => setLastUsedTool(ToolName.DATE);
  const atcSet = (): void => setLastUsedTool(ToolName.ATC);
  const locationSet = (): void => setLastUsedTool(ToolName.LOCATION);
  const actionsSet = (): void => setLastUsedTool(ToolName.ACTIONS);

  useEffect(() => {
    if (data.lastUsedTool) scrollToolIntoView(data.lastUsedTool);

    catalogsToolRef?.current?.addEventListener("click", catalogsSet);
    pagesToolRef?.current?.addEventListener("click", pagesSet);
    dateToolRef?.current?.addEventListener("click", dateSet);
    atcToolRef?.current?.addEventListener("click", atcSet);
    locationToolRef?.current?.addEventListener("click", locationSet);
    actionsToolRef?.current?.addEventListener("click", actionsSet);

    return () => {
      catalogsToolRef?.current?.removeEventListener("click", catalogsSet);
      pagesToolRef?.current?.removeEventListener("click", pagesSet);
      dateToolRef?.current?.removeEventListener("click", dateSet);
      atcToolRef?.current?.removeEventListener("click", atcSet);
      locationToolRef?.current?.removeEventListener("click", locationSet);
      actionsToolRef?.current?.removeEventListener("click", actionsSet);
    };
  }, []);

  useEffect(() => {
    Storage.setStorageWithKey(Storage.StorageKey.TOOLS_IS_EXPANDED, data.toolsIsExpanded);
  }, [data]);
  
const handleShortcut = () => {
  if (Object.values(data.toolsIsExpanded).includes(true)) {
    setIsCatalogToolExpanded(false);
    setIsPagesToolExpanded(false);
    setIsDateToolExpanded(false);
    setIsAtcToolExpanded(false);
    setIsLocationToolExpanded(false);
    setIsActionsToolExpanded(false);

    setData((p) => ({
      ...p,
      toolsIsExpanded: {
        [ToolName.CATALOGS]: false,
        [ToolName.PAGES]: false,
        [ToolName.DATE]: false,
        [ToolName.ATC]: false,
        [ToolName.LOCATION]: false,
        [ToolName.ACTIONS]: false,
      }
    }));
  } else {
    setIsCatalogToolExpanded(true);
    setIsPagesToolExpanded(true);
    setIsDateToolExpanded(true);
    setIsAtcToolExpanded(true);
    setIsLocationToolExpanded(true);
    setIsActionsToolExpanded(true);

    setData((p) => ({
      ...p,
      toolsIsExpanded: {
        [ToolName.CATALOGS]: true,
        [ToolName.PAGES]: true,
        [ToolName.DATE]: true,
        [ToolName.ATC]: true,
        [ToolName.LOCATION]: true,
        [ToolName.ACTIONS]: true,
      }
    }));
  }
  Storage.removeStorageWithKey(Storage.StorageKey.LAST_USED_TOOL);
};
useEffect(() => {
  const listener = (message: any) => {
    if (message === "expand-collapse-tools") handleShortcut();
  };
  Tabs.removeMessageListener(listener);
  Tabs.addMessageListener(listener);
  return () => {
    Tabs.removeMessageListener(listener);
  }
}, [data]);

  function scrollToolIntoView(tool: ToolName) {
    try {
      switch (tool) {
        case ToolName.CATALOGS:
          if (catalogsToolRef.current) scrollIntoView(catalogsToolRef?.current as Element, scrollOptions);
          break;
        case ToolName.PAGES:
          if (pagesToolRef.current) scrollIntoView(pagesToolRef?.current as Element, scrollOptions);
          break;
        case ToolName.DATE:
          if (dateToolRef.current) scrollIntoView(dateToolRef?.current as Element, scrollOptions);
          break;
        case ToolName.ATC:
          if (atcToolRef.current) scrollIntoView(atcToolRef?.current as Element, scrollOptions);
          break;
        case ToolName.LOCATION:
          if (locationToolRef.current) scrollIntoView(locationToolRef?.current as Element, scrollOptions);
          break;
        case ToolName.ACTIONS:
          if (actionsToolRef.current) scrollIntoView(actionsToolRef?.current as Element, scrollOptions);
          break;
      }
    } catch (e) {console.error(e);}
  }

  function toolCollapseHandler(toolName: ToolName, isExpanded: boolean) {
    try {
      switch (toolName) {
        case ToolName.CATALOGS:
          setIsCatalogToolExpanded(isExpanded);
          if (isExpanded) setTimeout(() => {scrollIntoView(catalogsToolRef?.current as Element, scrollOptions)}, timeToScroll);
          break;
        case ToolName.PAGES:
          setIsPagesToolExpanded(isExpanded);
          if (isExpanded) setTimeout(() => {scrollIntoView(pagesToolRef?.current as Element, scrollOptions)}, timeToScroll);
          break;
        case ToolName.ATC:
          setIsAtcToolExpanded(isExpanded);
          if (isExpanded) setTimeout(() => {scrollIntoView(atcToolRef?.current as Element, scrollOptions)}, timeToScroll);
          break;
        case ToolName.DATE:
          setIsDateToolExpanded(isExpanded);
          if (isExpanded) setTimeout(() => {scrollIntoView(dateToolRef?.current as Element, scrollOptions)}, timeToScroll);
          break;
        case ToolName.LOCATION:
          setIsLocationToolExpanded(isExpanded);
          if (isExpanded) setTimeout(() => {scrollIntoView(locationToolRef?.current as Element, scrollOptions)}, timeToScroll);
          break;
        case ToolName.ACTIONS:
          setIsActionsToolExpanded(isExpanded);
          if (isExpanded) setTimeout(() => {scrollIntoView(actionsToolRef?.current as Element, scrollOptions)}, timeToScroll);
          break;
      }
      setData((prev) => ({
        ...prev,
        toolsIsExpanded: {
          ...prev.toolsIsExpanded,
          [toolName]: isExpanded
        }
      }));
      if (isExpanded) {
        Storage.setStorageWithKey(Storage.StorageKey.LAST_USED_TOOL, toolName);
        lastUsedTool.current = toolName;
      }
      else if (!Object.values(data.toolsIsExpanded).includes(true)) Storage.removeStorageWithKey(Storage.StorageKey.LAST_USED_TOOL);
    } catch (e) {
      console.error('toolCollapseHandler: ' + e);
    }
  }

  const [pagesContext, setPagesContext] = useState(data.pagesTool);
  const [atcToolContext, setAtcToolContext] = useState(data.atcTool);

  useEffect(() => {
    Storage.setStorageWithKey(ToolName.PAGES, pagesContext);
  }, [pagesContext]);
  useEffect(() => {
    Storage.setStorageWithKey(ToolName.ATC, atcToolContext);
  }, [atcToolContext]);

  return (
    <>
      <Box sx={{ 
        width: '100%',
        marginTop: '10px',
        mb: '15px',
      }}>
        <Stack alignItems="flex-start" justifyContent="center" spacing={.5}>
          <PagesContext.Provider value={{pagesContext, setPagesContext} as PagesContextValue}>
            <Container>
              <Button
                fullWidth
                variant='text'
                disableElevation
                sx={{...getButtonSx(isCatalogToolExpanded)}}
                onClick={() => {
                  toolCollapseHandler(ToolName.CATALOGS, !isCatalogToolExpanded);
                }}
                // startIcon={ToolBtnIcon(isCatalogToolExpanded)}
                startIcon={<StoreIcon/>}
                size='medium'
              >
                CATALOGS
              </Button>
              <Collapse
                in={isCatalogToolExpanded}
                timeout="auto"
                unmountOnExit
                ref={catalogsToolRef}
              >
                <CatalogTool/>
              </Collapse>
            </Container>
            <Container>
              <Button
                fullWidth
                sx={{...getButtonSx(isPagesToolExpanded)}}
                variant='text'
                disableElevation
                onClick={() => toolCollapseHandler(ToolName.PAGES, !isPagesToolExpanded)}
                // startIcon={ToolBtnIcon(isPagesToolExpanded)}
                startIcon={<BookmarksIcon/>}
                size='medium'
              >
                PAGES
              </Button>
              <Collapse 
                in={isPagesToolExpanded}
                timeout="auto"
                unmountOnExit
                ref={pagesToolRef}
              >
                <PagesTool/>
              </Collapse>
            </Container>
          </PagesContext.Provider>
          <AtcToolContext.Provider value={{atcToolContext, setAtcToolContext} as AtcToolContextType}>
            <Container>
              <Button
                fullWidth
                sx={{...getButtonSx(isAtcToolExpanded)}}
                variant='text'
                disableElevation
                onClick={() => toolCollapseHandler(ToolName.ATC, !isAtcToolExpanded)}
                // startIcon={ToolBtnIcon(isAtcToolExpanded)}
                startIcon={<AddShoppingCartIcon/>}
                size='medium'
              >
                ADD TO CART
              </Button>
              <Collapse 
                in={isAtcToolExpanded}
                timeout="auto"
                unmountOnExit
                ref={atcToolRef}
              >
                <AtcTool/>
              </Collapse>
            </Container>
          </AtcToolContext.Provider>
          <Container>
            <Button
              sx={{...getButtonSx(isDateToolExpanded)}}
              fullWidth
              variant='text'
                disableElevation
              onClick={() => {
                toolCollapseHandler(ToolName.DATE, !isDateToolExpanded);
              }}
              // startIcon={ToolBtnIcon(isDateToolCollapsed)}
              startIcon={<CalendarMonthIcon/>}
              size='medium'
            >
              SITE DATE
            </Button>
            <Collapse
              in={isDateToolExpanded}
              timeout="auto"
              unmountOnExit
              ref={dateToolRef}
            >
              <DateTool/>
            </Collapse>
          </Container>
          <Container>
            <Button
              sx={{...getButtonSx(isLocationToolExpanded)}}
              fullWidth
              variant='text'
              disableElevation
              onClick={() => {
                toolCollapseHandler(ToolName.LOCATION, !isLocationToolExpanded);
              }}
              // startIcon={ToolBtnIcon(isLocationToolExpanded)}
              startIcon={<FmdGoodIcon/>}
              size='medium'
            >
              SITE LOCATION
            </Button>
            <Collapse
              in={isLocationToolExpanded}
              timeout="auto"
              unmountOnExit
              ref={locationToolRef}
            >
              <LocationTool/>
            </Collapse>
          </Container>
          <Container
          >
            <Button
              sx={{...getButtonSx(isActionsToolExpanded)}}
              fullWidth
              variant='text'
              disableElevation
              onClick={() => toolCollapseHandler(ToolName.ACTIONS, !isActionsToolExpanded)}
              // startIcon={ToolBtnIcon(isActionsToolExpanded)}
              startIcon={<MiscellaneousServicesIcon/>}
              size='medium'
            >
              MISC
            </Button>
            <Collapse 
              in={isActionsToolExpanded}
              timeout="auto"
              unmountOnExit
              ref={actionsToolRef}
            >
              <ActionsTool/>
            </Collapse>
          </Container>
        </Stack>
      </Box>
      <Snackbar
        open={alerts.notOnBhPage && !App.isOnBh}
      >
        <Alert 
          severity="info"
          action={
            <Button 
              onClick={() => {
                setAlerts((prev) => {
                  const result = {...prev, notOnBhPage: false}
                  Storage.setStorageWithKey(Storage.StorageKey.ALERTS, result);
                  return result;
                });
              }}
              sx={{ margin: 'auto' }}
            >
              Got it
            </Button>
          } 
        >
          Some features are only available on a B&H page
        </Alert>
      </Snackbar>
    </>
  );
}
