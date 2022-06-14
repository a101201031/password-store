import { FC } from 'react';
import { App } from 'App';
import { theme } from 'theme';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { RecoilRoot } from 'recoil';

export const Bootstrap: FC = () => (
  <ThemeProvider theme={theme}>
    <Router>
      <RecoilRoot>
        <App />
      </RecoilRoot>
    </Router>
  </ThemeProvider>
);
