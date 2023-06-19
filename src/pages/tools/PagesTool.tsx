import {Autocomplete, Box, ButtonGroup, IconButton, TextField, ToggleButton, Tooltip} from '@mui/material';
import { useEffect, useState, useContext} from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import StartIcon from '@mui/icons-material/Start';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import LaunchIcon from '@mui/icons-material/Launch';
import NoteAddOutlinedIcon from '@mui/icons-material/NoteAddOutlined';
import * as Tabs from '../../utils/tabs';
import {PagesContext} from '../../contexts/PagesContext';
import LanIcon from '@mui/icons-material/Lan';
import {CoreContext} from '../../contexts/CoreContext';
import Icon from '@mdi/react';
import { mdiIncognito } from '@mdi/js';

export interface Environment {
  name: string;
  hostname: string;
}

export interface Page {
  name: string;
  path: string;
}

export interface StoragePagesTool {
  environments: Environment[];
  pages: Page[];
  lastUsed?: {
    environment: Environment | undefined;
    page: Page | null;
    useCurrEnv: boolean;
    useCurrPage: boolean;
  };
}

export const PagesTool = () => {
  const {pagesContext, setPagesContext} = useContext(PagesContext);
  const {coreContext, setCoreContext} = useContext(CoreContext);

  const [selectedUseCurrPage, setSelectedUseCurrPage] = useState(pagesContext?.lastUsed?.useCurrPage ?? false);
  const [selectedUseCurrEnv, setSelectedUseCurrEnv] = useState(pagesContext?.lastUsed?.useCurrEnv ?? false);

  const [selectedEnv, setSelectedEnv] = useState<Environment>(pagesContext?.lastUsed?.environment ?? pagesContext?.environments[0]);
  const [selectedPath, setSelectedPath] = useState<Page | null>(pagesContext?.lastUsed?.page ?? null);
  const [convertEnv, setConvertEnv] = useState('');
  const [convertPath, setConvertPath] = useState('');
  const [envInput, setEnvInput] = useState('');
  const [pageInput, setPageInput] = useState('');
  const disableNavigateBtns = !selectedEnv && !selectedUseCurrEnv;

  function navigate(newTab: boolean = false, copyUrl: boolean = false, incognito: boolean = false) {
    if (selectedEnv || selectedUseCurrEnv){
      const hostname = selectedUseCurrEnv ? convertEnv : (selectedEnv?.hostname || '');
      let path = selectedUseCurrPage ? convertPath : selectedPath?.path || '';
      if (path && path[0] !== '/') path = `/${path}`; // add leading slash if not present
      let url = `${hostname}${path}`;

      setPagesContext({
        ...pagesContext,
        lastUsed: {
          environment: selectedEnv,
          page: selectedPath,
          useCurrEnv: selectedUseCurrEnv,
          useCurrPage: selectedUseCurrPage
        }
      });

      Tabs.navigate(url, newTab, copyUrl, true, incognito);
    }
  }

  useEffect(() => {
    if (coreContext.isOnBh && coreContext.currentTab) {
      const convertUrl = new URL(coreContext.currentTab.url || 'https://google.com');
      const convertEnv = convertUrl.protocol + '//' + convertUrl.host;
      const setEnv = pagesContext.environments.find((env) => Tabs.getHostnameFromString(env.hostname) === convertEnv); // this is for when you have an environment with a path saved. for example "REDACTED"
      setConvertEnv(setEnv ? setEnv.hostname : convertEnv);
      setConvertPath(convertUrl.pathname + convertUrl.search);
    } else {
      setSelectedUseCurrEnv(false);
      setSelectedUseCurrPage(false);
    }
  }, [coreContext]);

  useEffect(() => {
    if (coreContext.isOnBh && coreContext.currentTab) {
      setSelectedUseCurrPage(pagesContext?.lastUsed?.useCurrPage ?? false);
      setSelectedUseCurrEnv(pagesContext?.lastUsed?.useCurrEnv ?? false);
    }
  }, [pagesContext, coreContext]);

  return (
    <>
      <Grid
        sx={{marginTop: '7px', marginBottom: '7px'}}
        container
        alignItems="center"
        spacing={2}
      >
        <Grid xs={6}> {/* Environment */}
          <Autocomplete
            disabled={selectedUseCurrEnv}
            autoComplete
            disableClearable
            selectOnFocus
            openOnFocus
            clearOnEscape
            options={pagesContext.environments}
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) => option.name === value.name}
            value={selectedEnv}
            onChange={(event, value) => {
              setSelectedEnv(value);
            }}
            inputValue={envInput}
            onInputChange={(event, value) => {
              setEnvInput(value);
              const env = pagesContext.environments.find((env) => env.name.toLowerCase() === value.toLowerCase());
              if (env) {
                setSelectedEnv(env);
              }
            }}
            renderInput={(params) => 
              <TextField 
                {...params} 
                label="Environments" 
                variant="outlined"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    navigate();
                  }
                }}
              />
            }
          />
        </Grid>
        <Grid xs={6}> {/* Pages */}
          <Autocomplete
            disabled={selectedUseCurrPage}
            autoComplete
            // disableClearable
            clearOnEscape
            // inputValue={selectedPath?.name}
            openOnFocus
            selectOnFocus
            fullWidth
            value={selectedPath}
            options={pagesContext.pages}
            getOptionLabel={(option) => option.name}
            onChange={(event, value) => {
              setSelectedPath(value);
            }}
            inputValue={pageInput}
            onInputChange={(event, value) => {
              setPageInput(value);
              const page = pagesContext.pages.find((page) => page.name.toLowerCase() === value.toLowerCase());
              if (page) {
                setSelectedPath(page);
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    navigate();
                  }
                }}
                label="Page"
                id="outlined"
              />
            )}
          />
        </Grid>
        <Grid xs={2}> {/* Buttons */}
          <Box 
            sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}
            p={0}
          >
            <Tooltip title="Current Environment">
              <span>
                <ToggleButton
                  value="check"
                  selected={selectedUseCurrEnv}
                  onChange={() => {
                    setSelectedUseCurrEnv(!selectedUseCurrEnv);
                    if (selectedUseCurrPage) setSelectedUseCurrPage(false);
                  }}
                  disabled={!coreContext.isOnBh}
                >
                  <LanIcon />
                </ToggleButton>
              </span>
            </Tooltip>
          </Box>
        </Grid>
        <Grid xs={2}>
        <Box 
            sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}
          >
            <Tooltip title="Current Page">
              <span>
                <ToggleButton
                  value="check"
                  selected={selectedUseCurrPage}
                  onChange={() => {
                    setSelectedUseCurrPage(!selectedUseCurrPage);
                    if (selectedUseCurrEnv) setSelectedUseCurrEnv(false);
                  }}
                  disabled={!coreContext.isOnBh}
                >
                  <NoteAddOutlinedIcon />
                </ToggleButton>
              </span>
            </Tooltip>
          </Box>
        </Grid>
        <Grid xs={8}>
          <Box
            display="flex"
            justifyContent="flex-end"
            alignItems="center"
          >
            <ButtonGroup sx={{alignItems: 'center'}}>
              <Tooltip title="Go">
                <span>
                  <IconButton
                    onClick={() => {
                      navigate();
                    }}
                    disabled={disableNavigateBtns}
                  >
                    <StartIcon />
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title="New Tab">
                <span>
                  <IconButton
                    onClick={() => navigate(true)}
                    disabled={disableNavigateBtns}
                  >
                    <LaunchIcon />
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title="Copy URL">
                <span>
                  <IconButton
                    onClick={() => navigate(false, true)}
                    disabled={disableNavigateBtns}
                  >
                    <ContentCopyOutlinedIcon />
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title="Incognito">
                <span>
                  <IconButton
                    onClick={() => navigate(false, true, true)}
                    disabled={disableNavigateBtns || coreContext.currentTab.incognito}
                    sx={{transform: 'scale(1.1)', p: '10px'}}
                  >
                    <Icon path={mdiIncognito} size={1} color='#676767'/>
                  </IconButton>
                </span>
              </Tooltip>
            </ButtonGroup>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}