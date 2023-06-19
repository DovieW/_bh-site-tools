import { Alert, Autocomplete, IconButton, Snackbar, TextField, Tooltip } from '@mui/material';
import { Stack } from '@mui/system';
import { useContext, useState } from 'react';
import * as Tabs from '../../utils/tabs';
import Grid from '@mui/material/Unstable_Grid2';
import * as App from '../../App';
import {AtcToolContext} from '../../contexts/AtcContext';
import LoadingButton from '@mui/lab/LoadingButton';
import {CoreContext} from '../../contexts/CoreContext';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import * as Cookies from '../../utils/cookies';

declare var BH: any;

export interface ItemKey {
  skuNo: number;
  itemSource: string;
}

export interface AtcHistoryItem {
  item: string;
  qty: number;
}

export interface AtcToolStorage {
  history: AtcHistoryItem[];
}

export function AtcTool() {
  const {atcToolContext, setAtcToolContext} = useContext(AtcToolContext);
  const [itemValue, setItemValue] = useState(atcToolContext?.history?.[0] ?? {itemKey: '', qty: 1});
  const [itemInput, setItemInput] = useState('');
  const [qty, setQty] = useState(atcToolContext?.history?.[0]?.qty ?? 1);
  const [isError, setIsError] = useState(false);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {coreContext, setCoreContext} = useContext(CoreContext);

  // async function addToCart() {
  //   if (!itemInput.match(/^[0-9]*-[A-Z]*$/)) return;

  //   const vals = itemInput.split('-');
  //   fetch(`${Tabs.getHostnameFromTab(App.currentTab)}`, {
  //     method: 'POST',
  //     body: JSON.stringify({
  //       'items': [
  //         {
  //           'itemKey': {
  //             'skuNo': vals[0],
  //             'itemSource': vals[1],
  //           },
  //           'quantity': qty,
  //           'atct': 'Product Detail - ATC',
  //         },
  //       ],
  //     }),
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //   })
  //     .catch((error) => console.error(error));
  // }

  async function clearCart() {
    const utkn = await Cookies.getCookie('REDACTED');
    if (utkn) {
      setIsLoading(true);
      await fetch("REDACTED", {
        headers: {"x-csrf-token": utkn}
      });
      Tabs.reloadTab(App.currentTab.id!);
      window.close();
    }   
  }

  async function addToCart() {
    let itemVal = '';
    const itemInputVal = itemInput.trim();
    if (itemInputVal.match(/^[0-9]+-[a-zA-Z]+$/)) itemVal = itemInputVal;
    else if (itemInputVal.match(/^[a-zA-Z0-9]+$/)) {
      setIsLoading(true);
      const result = await fetch(`${Tabs.getHostnameFromTab(coreContext.currentTab)}REDACTED{itemInput}`);
      const data = await result.json();
      const itemKey = data?.[0]?.[itemInputVal];
      if (itemKey) {
        itemVal = itemKey.replace(/_/g, '-');
      } else {
        setIsLoading(false);
        setIsError(true);
        setOpen(true);
        return;
      }
    } else {setIsError(true); return;}
    setIsLoading(true);

    let temp = [...atcToolContext?.history ?? []].filter((item) => item.item !== itemInputVal);
    temp.unshift({item: itemInputVal, qty: qty} as AtcHistoryItem);
    setAtcToolContext({
      ...atcToolContext,
      history: temp.slice(0, 20)
    });

    if (!qty) setQty(1);
    const itemKey = itemVal.split('-');

    const sku = +itemKey[0];
    const itemSource = itemKey[1];
    if (coreContext.isAperturePage) {
      const result = await Tabs.executeScript(
        (sku: number, is: string, qty: number) => REDACTED([{itemKey:{skuNo: sku, itemSource: is}, quantity: qty}])
      , [sku, itemSource, qty]);
      if (!result) {
        setIsError(true);
        setOpen(true);
        setIsLoading(false);
        return;
      }
    } else {
      const fullDomain = Tabs.getHostnameFromTab(coreContext.currentTab);
      await fetch(`REDACTED`, {
        method: 'POST'
      });
    }
    Tabs.reloadTab(coreContext.currentTab.id!);
    window.close();
  }

  const handleClose = () => {
    setOpen(false);
  };
  
  return (
    <>
      <Grid
        sx={{ marginTop: '7px', marginBottom: '7px' }}
        container
        alignItems="center"
        spacing={2}
      >
        <Grid xs={12}>
          <Stack direction="row" spacing={1} alignItems='center'>
            <Autocomplete
              freeSolo
              clearOnEscape
              openOnFocus
              disableClearable
              selectOnFocus
              options={atcToolContext?.history ?? []}
              filterOptions={(options) => options}
              getOptionLabel={(option) => typeof option === 'string' ? option : option.item}
              renderOption={(props, option) => {
                return (
                <li {...props} key={option.toString()}>
                  {option.item}
                </li>
              )}}
              value={itemValue}
              inputValue={itemInput}
              onInputChange={(e, value) => {setItemInput(value); setIsError(false);}}
              renderInput={
                (params) => <TextField
                    {...params}
                    error={isError}
                    label="Itemcode / SKU-IS" 
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') addToCart();
                    }}
                    sx={{width: '165px'}}
                 />
              }
            />
            <TextField
              sx={{width: '80px'}}
              label="Qty"
              type="number"
              value={qty}
              onChange={(e) => { if ((+e.target.value > 0 && +e.target.value < 1000) || !e.target.value) setQty(parseInt(e.target.value));}}
              InputLabelProps={{shrink: true,}}
              inputProps={{ min: 1, max: 999 }}
              onBlur={(e) => {if (!e.target.value) setQty(1);}}
            />
            <LoadingButton 
              loading={isLoading}
              variant="contained"
              disabled={!coreContext.isOnBh || !coreContext.isPageLoaded}
              onClick={addToCart}
              size='large'
            >
              <span>ADD</span>
            </LoadingButton>
            <Tooltip title='Clear cart'>
              <span>
                <IconButton onClick={clearCart} disabled={!coreContext.isOnBh || !coreContext.isPageLoaded}>
                  <RemoveShoppingCartIcon/>
                </IconButton>
              </span>
            </Tooltip>
          </Stack>
        </Grid>
      </Grid>
      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>Invalid or already in cart</Alert>
      </Snackbar>
    </>
  );
}
