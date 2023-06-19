import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import {LocalizationProvider} from '@mui/x-date-pickers';
import {Button, IconButton, Stack, TextField, Tooltip, Typography} from '@mui/material';
import {useEffect, useState} from 'react';
import Grid from '@mui/system/Unstable_Grid';
import ReplayIcon from '@mui/icons-material/Replay';
import * as Cookies from '../../utils/cookies';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import * as Storage from '../../utils/storage';
import {ToolName} from '../../utils/catalogTool';
import * as Tabs from '../../utils/tabs';

const COOKIE_DATE_FORMAT = 'REDACTED';
const SET_TO_DATE_FORMAT = 'REDACTED';
const COOKIE_NAME = 'REDACTED';
const DEFAULT_SET_TO = 'Set to: (current)';

interface Storage {
  lastUsedDate: string;
}

function setCookie(date: Dayjs) {
  Cookies.setCookie(COOKIE_NAME, date.format(COOKIE_DATE_FORMAT));
  Storage.setStorageWithKey(ToolName.DATE, {lastUsedDate: date.format(COOKIE_DATE_FORMAT)} as Storage);
  Tabs.reloadTab();
  window.close();
}

export function DateTool() {
  const [value, setValue] = useState<Dayjs | null>(null);
  const [setToText, setSetToText] = useState(DEFAULT_SET_TO);

  function reset() {
    Cookies.removeCookie(COOKIE_NAME);
    Tabs.reloadTab();
    window.close();
  }

  useEffect(() => {
    (async () => {
      const cookie = await Cookies.getCookie(COOKIE_NAME);
      if (cookie) setSetToText(`Set to: ${dayjs(cookie).format(SET_TO_DATE_FORMAT)}`);
      Cookies.addListener((c) => {
        if (c.cookie.name === COOKIE_NAME) {
          if (c.removed) setSetToText(DEFAULT_SET_TO);
          else if (c.cause === 'explicit') setSetToText(`Set to: ${dayjs(c.cookie.value).format(SET_TO_DATE_FORMAT)}`);
        }
      });
      try {
        const storage = await Storage.getStorage(ToolName.DATE) as {date: Storage};
        if (storage?.date?.lastUsedDate) setValue(dayjs(storage.date.lastUsedDate));
        else setValue(dayjs());
      } catch (e) {console.error(e);}
    })();
  }, []);

  const handleChange = (newValue: Dayjs | null) => {
    setValue(newValue);
  };

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Grid
          sx={{marginTop: '7px', marginBottom: '7px'}}
          container
          alignItems="center"
          spacing={2}
        >
          <Grid xs={12}>
            <Stack direction="row" spacing={1} alignItems='center'>
              <MobileDateTimePicker
                value={value}
                onChange={handleChange}
                renderInput={(params) => <TextField fullWidth {...params} label='Date & Time'/>}
                views={['year', 'month', 'day', 'hours', 'minutes']}
              />
              <Button onClick={() => {if (value) setCookie(value)}} variant="contained" size='large'>SET</Button>
              <Tooltip title='Reset'><span><IconButton onClick={reset}><ReplayIcon/></IconButton></span></Tooltip>
            </Stack>
          </Grid>
          <Grid xs={12} pb={0}>
            <Stack direction="row" spacing={1} alignItems='center'>
              <Typography variant="caption" sx={{ml: '3px'}} color='text.secondary'>{setToText}</Typography>
            </Stack>
          </Grid>
        </Grid>
      </LocalizationProvider>
    </>
  );
}