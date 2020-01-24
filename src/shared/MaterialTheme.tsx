import { createMuiTheme } from '@material-ui/core/styles';

const sourceSansPro = {
  fontFamily: 'SourceSansPro-light',
  fontStyle: 'normal',
  fontWeight: 400,
};

const colorOrange = '#dd6b02';
const inputBackgroundGreen = '#d3ebea';

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#fd8415',
      main: colorOrange,
      dark: '#aa5302',
      contrastText: '#fff',
    },
  },
  typography: {
    fontFamily: ['"SourceSansPro-light"', 'Helvetica', 'Arial'].join(','),
    button: {
      textTransform: 'none',
      fontSize: '1rem',
    },
  },
  shape: {
    borderRadius: 0,
  },
  overrides: {
    MuiCssBaseline: {
      '@global': {
        '@font-face': sourceSansPro,
      },
    },
    MuiButton: {
      contained: {
        boxShadow: 'none',
        hover: {
          boxShadow: 'none',
        },
      },
    },
    MuiIcon: {
      root: {
        fontSize: '1rem',
      },
    },
    MuiInput: {
      root: {
        backgroundColor: inputBackgroundGreen,
      },
    },
    MuiPaper: {
      root: {
        backgroundColor: '#eee',
        color: '#000',
      },
    },
    MuiInputBase: {
      input: {
        color: '#000',
        paddingLeft: '7px',
        '&$underline': {
          borderBottom: 'none',
        },
      },
      // .MuiListItem-button:hover
    },
    MuiFormLabel: {
      root: {
        color: '#000',
      },
    },
    MuiListItem: {
      root: {
        '&:hover': {
          backgroundColor: '#eaeaea',
        },
      },
      button: {
        paddingLeft: '5px !important',
        '&$hover': {
          color: '#000',
          backgroundColor: '#fff',
        },
      },
    },
    // .MuiListItem-root.Mui-selected, .MuiListItem-root.Mui-selected:hover
    MuiSelect: {
      icon: {
        height: '29px',
        width: '29px',
        marginTop: '-3px',
        backgroundColor: colorOrange,
        color: '#fff',
      },
      root: {
        '&$selected': {
          paddingTop: 6,
          color: 'red',
        },
      },
    },
    MuiFormControl: {
      root: {
        // minWidth: '100%',
      },
    },
    MuiFormControlLabel: {
      label: {
        display: 'hidden',
      },
    },
    // .MuiListItem-button:hover
    MuiMenuItem: {
      root: {
        '&$selected': {
          color: '#fff',
          backgroundColor: colorOrange,
        },
      },
    },
  },
});

export default theme;
