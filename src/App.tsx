import {useEffect, useState} from 'react';
import { createMemoryRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';

import { ThemeOptions, ThemeProvider, createTheme } from '@mui/material/styles';
import {Box, CircularProgress} from '@mui/material';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './App.scss';

import * as Tools from './pages/tools/ToolsList';
import * as Settings from './pages/settings/SettingsLayout';
import * as Tabs from './utils/tabs';
import Layout from './components/Layout';
import {NormalSize, SmallSize} from './utils/theme';
import {CoreContext} from './contexts/CoreContext';

export const lightTheme: ThemeOptions = {
  components: NormalSize,
  palette: {
    primary: {
      main: '#3f9a59',
    },
    secondary: {
      main: '#bd2c26',
    },
  }
};

// export const darkTheme: ThemeOptions = {
//   palette: {
//     primary: {
//       main: '#3f9a59',
//     },
//     secondary: {
//       main: '#bd2c26',
//     },
//   }
// };

export let currentTab = {} as chrome.tabs.Tab;
export let isPageLoaded = false;
export let isOnBh = false;
export let isAperturePage = true; // seems to always be true, works fine for the purpose of ATC
export let isRunningAsExtension = !!chrome.tabs; // for testing with 'npm start' since the Chrome APIs won't be available

const router = createMemoryRouter(
  createRoutesFromElements(
    <Route path='/' element={<Layout/>}>
      <Route index element={<Tools.Tools/>} loader={Tools.preloadTools}/>
      <Route path='/settings' element={<Settings.SettingsPage/>} loader={Settings.SettingsPageLoader}/>
    </Route>
  )
);

export function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [coreContext, setCoreContext] = useState<CoreContext>({
    currentTab: {} as chrome.tabs.Tab,
    isPageLoaded: false,
    isOnBh: false,
    isAperturePage: true,
  });
  
  useEffect(() => {
    (async () => {
      currentTab = await Tabs.getCurrentTab(); // (still true? ->) idk y, on aperture pages currentTab is undefined or something if the page is still loading, which is fine since it will be populated correctly in the listener below once it loads
      if (currentTab.status === 'complete') {
        isPageLoaded = true;
        isAperturePage = await Tabs.isAperturePage();
      } else {
        currentTab.url = currentTab.pendingUrl;
        (async () => {
          await new Promise((resolve, reject) => {
            const interval = setInterval(async () => {
              const tab = await Tabs.getTabById(currentTab.id!);
              if (tab.status === 'complete') {
                isAperturePage = await Tabs.isAperturePage();
                isOnBh = Tabs.ifCurrentTabIsBh(tab);
                setCoreContext((p) => {
                  return {
                    ...p,
                    currentTab: tab,
                    isOnBh: isOnBh,
                    isAperturePage: isAperturePage,
                    isPageLoaded: true,
                  }
                });
                clearInterval(interval);
                resolve({} as any);
              }
            }, 100);
          });
        })(); 
      }
      isOnBh = Tabs.ifCurrentTabIsBh(currentTab);

      setCoreContext((p) => {
        return {
          currentTab: currentTab,
          isPageLoaded: isPageLoaded,
          isOnBh: isOnBh,
          isAperturePage: isAperturePage,
        }
      })
      setIsLoaded(true);
    })();
  }, []);

  return (
    <>
      <ThemeProvider theme={createTheme(lightTheme)}>
        { (isLoaded && 
            <CoreContext.Provider value={{coreContext, setCoreContext}}>
              <Box className='App'>
                <RouterProvider router={router} />
              </Box>
            </CoreContext.Provider>)
            ||
          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
          }}>
            <CircularProgress size={100} sx={{mb: '85px'}}/>
          </Box>
        }
      </ThemeProvider>
    </>
  );
}

export default App;