import { ThemeProvider } from '@mui/material/styles';
import { App } from 'App';
import { BrowserRouter as Router } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { theme } from 'theme';
import { FirebaseRoot } from './Firebase';

function Bootstrap() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <RecoilRoot>
          <FirebaseRoot>
            <App />
          </FirebaseRoot>
        </RecoilRoot>
      </Router>
    </ThemeProvider>
  );
}

export { Bootstrap };
