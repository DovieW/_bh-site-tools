import {Button, FormControlLabel, FormGroup, Stack, Switch} from "@mui/material";
import {useContext, useEffect, useState} from "react";
import {clearSiteData} from "../../utils/browsingData";
import * as Cookies from "../../utils/cookies";
import * as Tabs from "../../utils/tabs";
import Grid from '@mui/material/Unstable_Grid2';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import SubjectIcon from '@mui/icons-material/Subject';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import * as App from '../../App';
import * as Catalogs from '../../utils/catalogs';
import {CoreContext} from "../../contexts/CoreContext";

async function openB2bPortal() {
  let cookie = await Cookies.getCookie('REDACTED');
  if (cookie) {
    const currentCat = await Catalogs.getCurrentCatalog(App.currentTab);
    if (currentCat) {
      const cat = Catalogs.getCatalog(+currentCat);
      const url = Tabs.isUrlProd(App.currentTab.url ?? '') ? 'REDACTED' : 'REDACTED';
      if (cat && url) Tabs.navigate(`REDACTED`, true);   
    }
  }
}

export function ActionsTool() {
  const {coreContext, setCoreContext} = useContext(CoreContext);
  const [REDACTED, REDACTED] = useState(true);
  const [REDACTED, REDACTED] = useState(true);
  const [REDACTED, REDACTED] = useState(true);
  // const [isRestartChrome, setIsRestartChrome] = useState(false);

  function toggleSSR() {
    Cookies.setCookie('REDACTED', REDACTED ? 'Y' : 'N');
  }

  function toggleAperture() {
    Cookies.setCookie('REDACTED', REDACTED ? 'Y' : 'N');
  }

  function toggleInHouse() {
    Cookies.setCookie('REDACTED', REDACTED ? 'Y' : 'N');
  }

  async function sessionInSplunk() {
    let jId = await Cookies.getCookie('REDACTED');
    let prodOrDev = '';
    if (Tabs.isUrlProd(App.currentTab.url || '')) {
      prodOrDev = Tabs.splunkProdDomain;
    } else {
      prodOrDev = Tabs.splunkDevDomain;
    }
    Tabs.navigate(`REDACTED`, true);
  }

  useEffect(() => {
    (async () => {
      const REDACTED = await Cookies.getCookie('REDACTED');
      if (REDACTED && REDACTED === 'Y') REDACTED(false);

      const REDACTED = await Cookies.getCookie('bypass_ng');
      if (REDACTED && REDACTED === 'Y') REDACTED(false);

      const isInHouseOff = await Cookies.getCookie('IN_HOUSE_IP_OFF');
      if (isInHouseOff && isInHouseOff === 'Y') REDACTED(false);
    })();

    Cookies.addListener((changeInfo) => {
      if (changeInfo.cookie.name === 'REDACTED') {
        if (changeInfo.removed) REDACTED(true);
        else if (changeInfo.cause === 'explicit') changeInfo.cookie.value === 'Y' ? REDACTED(false) : REDACTED(true);
      } else if (changeInfo.cookie.name === 'REDACTED') {
        if (changeInfo.removed) REDACTED(true);
        else if (changeInfo.cause === 'explicit') changeInfo.cookie.value === 'Y' ? REDACTED(false) : REDACTED(true);
      } else if (changeInfo.cookie.name === 'REDACTED') {
        if (changeInfo.removed) REDACTED(true);
        else if (changeInfo.cause === 'explicit') changeInfo.cookie.value === 'Y' ? REDACTED(false) : REDACTED(true);  
      }
    });
  }, []);

  return (
    <>
      <Grid 
        sx={{marginTop: '7px', marginBottom: '7px'}}
        container 
        spacing={2}
        alignItems="center"
      >
        <Grid xs={12}>
          <Stack spacing={1} direction='row'>
            <Button startIcon={<DeleteForeverIcon/>} size="small" variant="contained" onClick={() => {clearSiteData(); Tabs.reloadTab(); window.close();}}>Clear Site Data</Button>
            <Button startIcon={<SubjectIcon/>} size="small" variant="contained" disabled={!coreContext.isOnBh} onClick={sessionInSplunk}>Session Logs</Button>
            {/* <Button size="small" variant="contained" onClick={restartChrome}>{isRestartChrome ? 'Are you sure?' : 'Restart Chrome'}</Button> */}
          </Stack>
        </Grid>
        <Grid xs={12}>
          <Stack spacing={1} direction='row'>
            <Button startIcon={<CorporateFareIcon/>} size="small" variant="contained" disabled={!coreContext.isOnBh} onClick={openB2bPortal}>B2B Portal</Button>
          </Stack>
        </Grid>
        <Grid xs={12}>
          <FormGroup
            sx={{height: '31px', justifyContent: 'center'}}
          >
            <FormControlLabel 
              control={
                <Switch
                  checked={REDACTED}
                  onChange={REDACTED}
                />
              } 
              label={'SSR'} 
            />
            <FormControlLabel 
              control={
                <Switch
                  checked={REDACTED}
                  onChange={REDACTED}
                />
              } 
              label={'Aperture'} 
            />
            <FormControlLabel 
              control={
                <Switch
                  checked={REDACTED}
                  onChange={REDACTED}
                />
              } 
              label={'REDACTED'}
            />
          </FormGroup>
        </Grid>
      </Grid>
    </>
  );
}