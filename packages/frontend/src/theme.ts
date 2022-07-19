import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#7b9acc',
      contrastText: '#fcf6f5',
    },
    secondary: {
      main: '#fcf6f5',
    },
    info: {
      main: '#fcf6f5',
    },
  },
  typography: {
    fontFamily: ['Roboto', 'sans-serif'].join(','),
  },
});

export { theme };
