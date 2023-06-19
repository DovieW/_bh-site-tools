import {Autocomplete, Box, Button, IconButton, TextField, Tooltip, Typography} from "@mui/material";
import {Stack} from "@mui/system";
import {Countries, Country, getCountryByCode} from '../../utils/countries';
import Grid from '@mui/material/Unstable_Grid2';
import {useEffect, useState} from "react";
import ReplayIcon from '@mui/icons-material/Replay';
import * as Cookies from '../../utils/cookies';
import * as Tabs from '../../utils/tabs';
import * as Storage from '../../utils/storage';
import {ToolName} from "../../utils/catalogTool";

interface LocationToolStorage {
  lastUsed: string;
}

const COUNTRY_COOKIE = 'REDACTED';
const ZIPCODE_COOKIE = 'REDACTED';
type EntryMode = 'none' | 'country' | 'zipcode';

export function LocationTool() {
  const [setToText, setSetToText] = useState('');
  const [isCountrySet, setIsCountrySet] = useState(false);
  const [isZipcodeSet, setIsZipcodeSet] = useState(false);
  const [fieldValue, setFieldValue] = useState({label: '', code: ''} as Country);
  const [fieldInput, setFieldInput] = useState('');
  const [entryMode, setEntryMode] = useState<EntryMode>('none');
  const [isInvalidEntry, setIsInvalidEntry] = useState(false);

  useEffect(() => {
    (async () => {
      const lastUsed = await Storage.getStorage(ToolName.LOCATION) as {location: LocationToolStorage};
      fieldInputHandler(lastUsed?.location?.lastUsed);

      const countryCookie = await Cookies.getCookie(COUNTRY_COOKIE);
      let zipcodeCookie = await Cookies.getCookie(ZIPCODE_COOKIE);
      if (countryCookie && zipcodeCookie) {
        Cookies.removeCookie(ZIPCODE_COOKIE);
        zipcodeCookie = undefined;
      }

      if (countryCookie) {
        const country = getCountryByCode(countryCookie);
        if (country) setSetToText(country.label);
        setIsCountrySet(true);
      } else if (zipcodeCookie) {
        setSetToText(zipcodeCookie);
        setIsZipcodeSet(true);
      }
    })();
    Cookies.addListener((c) => {
      if (c.cookie.name === COUNTRY_COOKIE) {
        if (c.removed) {
          setSetToText('');
          setIsCountrySet(false);
        } else if (c.cause === 'explicit') {
          const country = getCountryByCode(c.cookie.value);
          if (country) setSetToText(country.label);
          setIsCountrySet(true);
        }
      } else if (c.cookie.name === ZIPCODE_COOKIE) {
        if (c.removed) {
          setSetToText('');
          setIsZipcodeSet(false);
        } else if (c.cause === 'explicit') {
          setSetToText(c.cookie.value);
          setIsZipcodeSet(true);
        }
      }
    });
  }, []);

  function setCookie() {
    if (entryMode !== 'none') {
      if (entryMode === 'country') {
        if (fieldValue.code) {
          if (isZipcodeSet) Cookies.removeCookie(ZIPCODE_COOKIE);
          Cookies.setCookie(COUNTRY_COOKIE, fieldValue.code);
        } else {
          setIsInvalidEntry(true);
          return;
        }
      } else if (entryMode === 'zipcode') {
        if (+fieldInput.length === 5) {
          if (isCountrySet) Cookies.removeCookie(COUNTRY_COOKIE);
          Cookies.setCookie(ZIPCODE_COOKIE, fieldInput);
        } else {
          setIsInvalidEntry(true);
          return;
        }
      }
      
      Storage.setStorageWithKey(ToolName.LOCATION, {lastUsed: fieldInput} as LocationToolStorage);
      Tabs.reloadTab();
      window.close();
    } else {
      setIsInvalidEntry(true);
    }
  }

  function fieldInputHandler(value: string) {
    setIsInvalidEntry(false);
    if (!value) {
      setFieldInput('');
      setEntryMode('none');
      return;
    }
    let nums = value.match(/\d+/)?.[0];
    let chars = value.match(/[a-zA-Z\s]+/)?.[0];
    const lastChar = value[value.length - 1];
    if (nums && chars) {
      if (lastChar.match(/[a-zA-Z]/)) {
        setFieldInput(chars);
        nums = '';
      } else {
        setFieldInput(nums);
        chars = '';
      }
    } else {
      if (nums) {
        setFieldInput(nums.length > 5 ? nums.slice(0, 5) : nums);
        setEntryMode('zipcode');
      } else if (chars) {
        setFieldInput(chars);
        setEntryMode('country');
        const country = Countries.find((c) => c.label.toLowerCase() === chars!.toLowerCase());
        if (country) {
          setFieldValue(country);
        } else {
          setEntryMode('none'); // if user continues to type after the country was selected automatically with above logic, then this will stop it from remembering the last catalog
        }
      } else {
        setFieldInput('');
        setEntryMode('none');
      }
    }
  }
  
  return (
    <>
      <Grid
        spacing={2}
        sx={{ marginTop: '7px', marginBottom: '7px' }}
        container
        alignItems="center"
      >
        <Grid xs={12}>
          <Stack direction='row' spacing={1} alignItems='center'>
            <Autocomplete
              freeSolo
              clearOnEscape
              disableClearable
              openOnFocus
              selectOnFocus
              fullWidth
              filterOptions={(options, params) => {
                let codeMatch: Country | undefined;
                let filtered: any = options.filter((option) => {
                  const value = params.inputValue.trim().toLowerCase();
                  const code = option.code.trim().toLowerCase();
                  if (code === value) {
                    codeMatch = option;
                    return false;
                  }
                  return option.label.toLowerCase().includes(value) || code.includes(value);
                });
                if (codeMatch) filtered = [codeMatch, ...filtered];
                return filtered;
              }}
              options={Countries}
              renderOption={(props, option) => (
                <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                <img
                  loading="lazy"
                  width="20"
                  src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                  srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                  alt=""
                />
                {option.label} ({option.code})
              </Box>
              )}
              value={fieldValue}
              onChange={(e, value) => {
                if (typeof value !== 'string') {
                  setFieldValue(value);
                  setEntryMode('country');
                }
              }}
              inputValue={fieldInput}
              onInputChange={(e, value) => fieldInputHandler(value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  error={isInvalidEntry}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setCookie();
                    }
                  }}
                  label="Country or ZIP Code"
                  variant="outlined"
                />
              )}
            />
            <Button
              variant='contained'
              onClick={setCookie}
              size='large'
            >
              Set
            </Button>
            <Tooltip title='Reset'>
              <span>
                <IconButton
                  onClick={() => {
                    if (isCountrySet) Cookies.removeCookie(COUNTRY_COOKIE);
                    if (isZipcodeSet) Cookies.removeCookie(ZIPCODE_COOKIE);
                    Tabs.reloadTab();
                    window.close();
                  }}
                >
                  <ReplayIcon
                    color={isCountrySet && isZipcodeSet ? 'primary' : 'action'}
                  />
                </IconButton>
              </span>
            </Tooltip>
          </Stack>
        </Grid>
        <Grid xs={12} pb={0}>
          <Stack direction='row'>
            <Typography sx={{ml: '3px'}} color='text.secondary' variant='caption'>{isCountrySet && isZipcodeSet ? 'Can\'t have country and zip set' : `Set to: ${setToText}`}</Typography>
          </Stack>
        </Grid>
      </Grid>
    </>
  );
}