import {Button, Grid, Link, Stack, Tooltip, Typography} from "@mui/material";
import {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import {saveJsObjectAsFile} from "../../utils/download";
import * as Storage from "../../utils/storage";
import * as Tabs from '../../utils/tabs';

export function GeneralSettings() {
  const nav = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [disableImport, setDisableImport] = useState(true);
  const [isRestoreDefault, setIsRestoreDefault] = useState(false);
  const [exportData, setExportData] = useState<string | null>(null);
  const [isAllowExportAndReset, setIsAllowExportAndReset] = useState(true);

  function importSettings() {
    if (inputRef?.current?.files) {
      const file = inputRef.current.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        if (!reader.result) return;
        const jsonData = JSON.parse(reader.result as string);
        Storage.setStorage(JSON.parse(jsonData)).then(() => { // double parse needed, not sure why, over-stringified?
          nav('/');
        });
      };
      reader.readAsText(file);
    }
  }

  function restoreDefaultSettings() {
    if (isRestoreDefault) {
      Storage.clearStorage().then(() => {;
        nav('/');
      });
    } else {
      setIsRestoreDefault(true);
    }
  }

  useEffect(() => {
    (async () => {
      const data = await Storage.getStorage(null);
      if (!data) setIsAllowExportAndReset(false);
      setExportData(JSON.stringify(data));
    })();
  }, []);

  return (
    <>
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Button
          variant='contained'
          size='small'
          onClick={() => {
            Tabs.navigate('chrome://extensions/shortcuts', true);
          }}
        >
          Edit Shortcuts
        </Button>
      </Grid>
      <Grid item xs={12}>
        <hr/>
      </Grid>
      <Grid item xs={12}>
        <Button
          variant='contained'
          onClick={() => restoreDefaultSettings()}
          disabled={!isAllowExportAndReset}
          size='small'
        >
          {isRestoreDefault ? 'Are you sure?' : 'Reset settings'}
        </Button>
      </Grid>
      <Grid item xs={12}>
        <Stack
          direction='row'
          spacing={2}
          display={'flex'}
          alignItems={'center'}
        >
          <Button
            disabled={disableImport}
            variant='contained'
            onClick={importSettings}
            size='small'
          >
            Import
          </Button>
          <input type="file" onChange={() => {if (inputRef && inputRef.current && inputRef.current.files) setDisableImport(false)}} ref={inputRef} accept=".json"/>
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <Tooltip title="Doesn't export shortcuts">
          <span>
            <Button
              variant='contained'
              onClick={() => {if (exportData) saveJsObjectAsFile(exportData, 'bhtools-settings.json');}}
              disabled={!isAllowExportAndReset}
              size='small'
            >
              Export
            </Button>
          </span>
        </Tooltip>
      </Grid>
      <Grid item xs={12}>
        <Typography variant='caption' color='text.secondary'>
          <Link
            href='https://google.com'
            target='_blank'
          >
            Version: 0.1.12
          </Link>
        </Typography>
      </Grid>
    </Grid>
    </>
  );
}