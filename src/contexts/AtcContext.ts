import {createContext} from "react";
import {AtcToolStorage} from "../pages/tools/AtcTool";

export type AtcToolContextType = {
  atcToolContext: AtcToolStorage,
  setAtcToolContext: React.Dispatch<React.SetStateAction<AtcToolStorage>>
};

export const AtcToolContext = createContext<AtcToolContextType>({} as AtcToolContextType);