import { useState, useEffect, useContext } from 'react';
import * as DefaultData from '../../utils/defaultData';

import {
  Autocomplete,
  TextField,
  Tooltip,
  IconButton,
  Box,
  Typography,
  ToggleButton,
  Stack,
} from '@mui/material';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import { Catalogs, ChangeCatalogHistoryItem } from '../../utils/catalogs';
import * as Tabs from '../../utils/tabs';
import { getCookie } from '../../utils/cookies';
import * as Storage from '../../utils/storage';
import * as Catalog from '../../utils/catalogs';
import {ToolName} from '../../utils/catalogTool';
import Grid from '@mui/material/Unstable_Grid2';
import {CatalogsSettings} from '../settings/CatalogsSettings';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import * as App from '../../App';
import LoadingButton from '@mui/lab/LoadingButton';
import ReplayIcon from '@mui/icons-material/Replay';
import {CoreContext} from '../../contexts/CoreContext';

export interface StorageCatalogsTool {
  changeCatalogHistory: ChangeCatalogHistoryItem[],
  settings: CatalogsSettings
}

const CatalogTool = () => {
  const {coreContext, setCoreContext} = useContext(CoreContext);
  
  function store() {
    let temp = [...catalogHistory].filter((item, index) => item.catalogId !== catalogValue.catalogId); 
    temp.unshift({ catalogId: catalogValue.catalogId } as ChangeCatalogHistoryItem);
    Storage.setStorageWithKey(ToolName.CATALOGS, {changeCatalogHistory: temp.slice(0, 10)} as StorageCatalogsTool);
  }

  async function changeCatalogNavigate(copyUrl: boolean = false, overrideCatalog?: number) {
    const catalog = Catalog.Catalogs.find((c) => c.id === +catalogInput);
    let url = catalogChangeUrl + (overrideCatalog || catalog?.id || catalogInput);
    if (isUsePunchout && catalog && catalog.punchout) {
      const env = Tabs.getHostnameFromTab(coreContext.currentTab);
      url = `${env}/home?A=validateCatalog&O=&Q=bc=SciQuest&cli=${catalog.id}&ide=${catalog!.punchout}&pburl=${env}/apps/Router/ReceivePunchoutOrder?supplierId=4070849&punchoutOperation=create`;
    }
    store();
    if (copyUrl) {
      navigator.clipboard.writeText(url);
    } else {
      setIsLoading(true);
      await fetch(url);
      Tabs.reloadTab(coreContext.currentTab!.id!);
      window.close();
    }
  }

  const [currentCatalog, setCurrentCatalog] = useState('');
  const [catalogChangeUrl, setCatalogChangeUrl] = useState('');
  const [catalogHistory, setCatalogHistory] = useState<ChangeCatalogHistoryItem[]>([]);
  const [isUsePunchout, setIsUsePunchout] = useState(false);

  const [catalogInput, setCatalogInput] = useState('');
  const [catalogValue, setCatalogValue] = useState<ChangeCatalogHistoryItem>({catalogId: ''});
  const [findCatalogInput, setFindCatalogInput] = useState('');
  const [findCatalogValue, setFindCatalogValue] = useState({id: -77777777, name: '', punchout: ''});

  const isDisableNavBtns = catalogInput.length === 0;
  const [isLoading, setIsLoading] = useState(false);

  function catalogInputHandler(value: string) {
    const dashChar = value.match(/^-/);
    const val = (dashChar ? dashChar[0] : '') + value.replace(/[^0-9]/g, '');
    setCatalogInput(val);
    setCatalogValue({ catalogId: val });
    const cat = Catalogs.find((cat) => cat.id.toString() === val);
    setIsUsePunchout(false);
    if (cat) {
      setFindCatalogValue(cat);
    } else if (+val || val === '') {
      setFindCatalogValue((prev) => ({ ...prev, id: -1, name: '', punchout: '' }));
    }
  }
  
  function findCatalogHandler(value: Catalog.Catalog) {
    const cat = Catalogs.find((cat) => cat.id === value.id);
    setIsUsePunchout(false);
    if (cat) {
      setCatalogValue({ catalogId: cat.id.toString() });
      setFindCatalogValue(value);
    }
  }

  useEffect(() => {
    (async () => {
      // let cookie = await getCookie('Catalog'); // definitely not accurate
      let lpiCookie: string | undefined;
      // if (!cookie) {
        lpiCookie = await getCookie('lpi'); // doesn't seem to always be accurate
      // }
      // if (cookie) setCurrentCatalog(cookie);
      // else 
      if (lpiCookie) setCurrentCatalog((lpiCookie?.split(',')[0].split('=')[1] || ''));

      let storage = await Storage.getStorageWithDefault(ToolName.CATALOGS, DefaultData.catalogsTool);
      setCatalogHistory(storage[ToolName.CATALOGS].changeCatalogHistory);
      catalogInputHandler(storage[ToolName.CATALOGS].changeCatalogHistory[0]?.catalogId ?? '');
    })();
  }, []);

  useEffect(() => {
    let changeCatalogUrl = 'REDACTED';
    const currentEnv = Tabs.getHostnameFromTab(coreContext.currentTab);
    setCatalogChangeUrl(`${currentEnv}${changeCatalogUrl}`);
  }, [coreContext]);

  return (
    <Grid
      sx={{marginTop: '7px', marginBottom: '7px'}}
      container
      alignItems="center"
      spacing={2}
    >
      <Grid xs={3.5}> {/* ID */}
        <Autocomplete
          freeSolo
          disableClearable
          clearOnEscape
          openOnFocus
          selectOnFocus
          options={catalogHistory}
          filterOptions={(options) => options}
          getOptionLabel={(option) => typeof option === 'string' ? option : option.catalogId}
          renderOption={(props, option) => {
            return (
            <Tooltip
              title={Catalog.getCatalog(+option.catalogId)?.name}
              placement="right"
              arrow
            >
              <li {...props} key={option.catalogId}>
                {option.catalogId}
              </li>
            </Tooltip>
          )}}
          value={catalogValue}
          inputValue={catalogInput}
          onInputChange={(e, value) => catalogInputHandler(value)}
          renderInput={(params) => (
            <TextField
              {...params}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isDisableNavBtns && coreContext.isOnBh) {
                  changeCatalogNavigate();
                }
              }}
              label="ID"
              variant="outlined"
            />
          )}
        />
      </Grid>
      <Grid xs={8.5}> {/* Name */}
        <Autocomplete
          autoComplete
          autoHighlight
          disableClearable
          openOnFocus
          clearOnEscape
          fullWidth
          options={Catalogs}
          getOptionLabel={(option) => option.name}
          renderOption={(props, option) => {
            return (
            <Tooltip
              title={option.id}
              placement="left"
              arrow
            >
              <li {...props} key={option.id}>
                {option.name}
              </li>
            </Tooltip>
          )}}
          inputValue={findCatalogInput}
          onInputChange={(e, input) => {
            setFindCatalogInput(input);
            const cat = Catalogs.find((cat) => cat.name.toLowerCase() === input.toLowerCase());
            if (cat) {
              setCatalogValue({ catalogId: cat.id.toString() });
              setFindCatalogValue(cat);
            }
          }}
          value={findCatalogValue}
          onChange={(e, value) => {
            findCatalogHandler(value);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Name"
              variant="outlined"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isDisableNavBtns && coreContext.isOnBh) {
                  changeCatalogNavigate();
                }
              }}
            />
          )}
        />
      </Grid>
      <Grid xs={12}> {/* Buttons */}
          <Box
            sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}
          >
            <Box>
              <Tooltip title="Punchout Portal">
                <span>
                  <ToggleButton
                    value="check"
                    selected={isUsePunchout}
                    onChange={() => setIsUsePunchout(!isUsePunchout)}
                    disabled={isDisableNavBtns || findCatalogValue.punchout === '' || !coreContext.isOnBh}
                  >
                    <RequestQuoteIcon />
                  </ToggleButton>
                </span>
              </Tooltip>
              <Typography variant="caption" sx={{marginLeft: '15px'}} color='text.secondary'>
                <Tooltip title={Catalog.getCatalog(+currentCatalog)?.name} placement="right" arrow><span>Set to: {currentCatalog}</span></Tooltip>
              </Typography>
            </Box>
            <Stack 
              direction="row"
              spacing={1}
              sx={{display: 'flex', justifyContent: 'flex-end', alignItems: 'center'}}
            >
              <Tooltip title="Copy URL">
                <span>
                  <IconButton
                    disabled={isDisableNavBtns || !coreContext.isOnBh}
                    onClick={() => changeCatalogNavigate(true)}
                  >
                    <ContentCopyOutlinedIcon />
                  </IconButton>
                </span>
              </Tooltip>
              <LoadingButton 
                loading={isLoading}
                variant="contained"
                disabled={isDisableNavBtns || !coreContext.isOnBh}
                onClick={() => changeCatalogNavigate()}
              >
                <span>Go</span>
              </LoadingButton>
              <Tooltip title="Reset">
                <span>
                  <IconButton
                    disabled={!coreContext.isOnBh}
                    onClick={() => {
                      changeCatalogNavigate(false, 2);
                    }}
                  >
                    <ReplayIcon />
                  </IconButton>
                </span>
              </Tooltip>
            </Stack>
        </Box>
      </Grid>
    </Grid>
  );
};

export default CatalogTool;