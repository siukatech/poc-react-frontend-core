import {
  ThemeProvider,
  // Theme,
  createTheme,
  styled,
  useTheme,
  // ThemeOptions,
} from '@mui/material/styles';
import type {
  Theme,
  ThemeOptions,
} from '@mui/material/styles';

import shadeColor from './shade-color';

// const theme = createTheme({
const themeOptions = {
  palette: {
    // mode: 'dark',
    mode: 'light',
    primary: {
      main: shadeColor[500],
    },
  },
  // });
} as ThemeOptions;

/**
 * Reference:
 * https://github.com/mingfang/jsonforms-demo/blob/master/src/index.tsx#L9
 * https://github.com/rjsf-team/react-jsonschema-form/issues/1987#issuecomment-1147517375
 */
// const themeFormReadonly = createTheme({
const themeFormReadonlyOptions = {
  components: {
    MuiTextField: {
      defaultProps: {
        variant: 'standard',
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          margin: '0.3em 0',
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        underline: {
          '&.Mui-disabled': {
            borderBottom: 'none',
            '&&&:before': {
              borderBottom: 'none',
            },
            '&&:after': {
              borderBottom: 'none',
            },
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          '&.Mui-disabled': {
            display: 'none',
          },
        },
      },
    },
  },
  palette: {
    action: {
      disabled: 'black',
    },
    text: {
      disabled: 'black',
    },
  },
  // });
} as ThemeOptions;

// export default theme;
// export { themeFormReadonly };
export default themeOptions;
export { themeFormReadonlyOptions };
