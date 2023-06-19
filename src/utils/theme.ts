import {Theme} from "@mui/material/styles";
import {Components} from "@mui/material/styles/components";

export const NormalSize: Components<Omit<Theme, "components">> = {
  MuiToggleButton: {
    defaultProps: {
      size: 'medium'
    }
  },
  MuiIconButton: {
    defaultProps: {
      size: 'large'
    }
  },
  MuiTextField: {
    defaultProps: {
      size: 'medium'
    }
  }
};

export const SmallSize: Components<Omit<Theme, "components">> = {
  MuiToggleButton: {
    defaultProps: {
      size: 'small'
    }
  },
  MuiIconButton: {
    defaultProps: {
      size: 'medium'
    }
  },
  MuiTextField: {
    defaultProps: {
      size: 'small'
    }
  }
};