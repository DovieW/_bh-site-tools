import {Alert, Box, Button, Snackbar, Tab, Tabs, Typography} from '@mui/material';
import {useEffect, useState} from 'react';
import {PagesContext, PagesContextValue} from '../../contexts/PagesContext';
import {PagesSettings} from './PagesSettings';
import * as Storage from '../../utils/storage';
import {ToolName} from '../../utils/catalogTool';
import * as DefaultData from '../../utils/defaultData';
import {StoragePagesTool} from '../tools/PagesTool';
import {useLoaderData} from 'react-router-dom';
import {GeneralSettings} from './GeneralSettings';
import {StorageCatalogsTool} from '../tools/CatalogTool';
import {Stack} from '@mui/system';

interface SettingsPageLoaderData {
  catalogsContext: StorageCatalogsTool;
  pagesContext: StoragePagesTool;
}

export async function SettingsPageLoader(): Promise<SettingsPageLoaderData> {
  const storagePagesData = await Storage.getStorageWithDefault(ToolName.PAGES, DefaultData.pagesTool);
  const storageCatalogsData = await Storage.getStorageWithDefault(ToolName.CATALOGS, DefaultData.catalogsTool);
  const pagesContext = storagePagesData[ToolName.PAGES];

  return {
    catalogsContext: storageCatalogsData[ToolName.CATALOGS],
    pagesContext: pagesContext,
  };
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3, pb: 0 }}>
          <Typography component={'span'}>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export function SettingsPage() {
  const [data, setData] = useState(useLoaderData() as SettingsPageLoaderData);
  const [pagesContext, setPagesContext] = useState(data.pagesContext);
  const [catalogsContext, setCatalogsContext] = useState(data.catalogsContext);
  const [openToast, setOpenToast] = useState(false);
  
  const savePages = () => {
    const filteredPagesContext: StoragePagesTool = {
      pages: pagesContext.pages.filter(page => page.name !== '' && page.path !== ''),
      environments: pagesContext.environments.filter(env => env.name !== '' && env.hostname !== '')
    };
    Storage.setStorageWithKey(ToolName.PAGES, filteredPagesContext);
    if (!openToast) setOpenToast(true);
  }

  useEffect(() => {
    Storage.setStorageWithKey(ToolName.CATALOGS, catalogsContext);
  }, [catalogsContext]);

  const [tabIndex, setTabIndex] = useState(0);
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };
  
  return (
    <>
      <Box sx={{ 
        width: '100%',
        // marginTop: '43px'
       }} id='settings-page-root-box'>
        <Stack direction='row' spacing={2} display={'flex'} alignItems={'center'} id='settings-page-stack' sx={{position: 'sticky', top: '0', backgroundColor: 'white', zIndex: '10', boxShadow: '0px 13px 22px -23px black', borderBottom: 1, borderColor: 'divider'}}>
          <Box sx={{width: '100%'}} id='settings-page-child-box'>
            <Tabs 
              // variant="fullWidth"
              allowScrollButtonsMobile
              value={tabIndex}
              onChange={handleTabChange}
            >
              <Tab label="General" />
              {/* <Tab label="Catalogs" /> */}
              <Tab label="Pages" />
            </Tabs>
          </Box>
          <Box id='settings-page-button-box'>
            <Button 
              sx={{mt: -0.7, mr: 2}}
              variant="contained"
              size="small"
              disabled={tabIndex === 0}
              onClick={savePages}
            >
              Save
            </Button>
          </Box>
        </Stack>
        <TabPanel value={tabIndex} index={0}>
          <GeneralSettings/>
        </TabPanel>
        {/* <TabPanel value={tabIndex} index={1}>
          <CatalogsContext.Provider value={{catalogsContext, setCatalogsContext} as CatalogsContextValue}>
            <CatalogsSettings/>
          </CatalogsContext.Provider>
        </TabPanel> */}
        <TabPanel value={tabIndex} index={1}>
          <PagesContext.Provider value={{pagesContext, setPagesContext} as PagesContextValue}>
            <PagesSettings/>
          </PagesContext.Provider>
        </TabPanel>
      </Box>
      <Snackbar
        open={openToast}
        autoHideDuration={4000}
        onClose={() => setOpenToast(false)}
      >
        <Alert onClose={() => setOpenToast(false)} severity="success">Saved</Alert>
      </Snackbar>
    </>
  );
}
export default SettingsPage;