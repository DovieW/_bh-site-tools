import FormGroup from "@mui/material/FormGroup";
import {useContext} from "react";
import {CatalogsContext} from "../../contexts/CatalogsContext";

export interface CatalogsSettings {
  prefillCatalog: boolean;
}

export function CatalogsSettings() {
  const {catalogsContext, setCatalogsContext} = useContext(CatalogsContext);

  function changeSetting(setting: keyof CatalogsSettings, value: boolean) {
    setCatalogsContext({
      ...catalogsContext,
      settings: {
        ...catalogsContext.settings,
        [setting]: value
      }
    });
  }

  return (
    <>
      <FormGroup>
        {/* <FormControlLabel
          control={<Switch
            checked={catalogsContext.settings.prefillCatalog}
            onChange={(event) => changeSetting('prefillCatalog', event.target.checked)}
          />}
          label="Prefill with last used catalog"
        /> */}
      </FormGroup>
    </>
  );
}