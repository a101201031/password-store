import { App } from 'App';
import { BrowserRouter as Router } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { FirebaseRoot } from './Firebase';
import { MaterialUIRoot } from './MaterialUI';

function Bootstrap() {
  return (
    <RecoilRoot>
      <MaterialUIRoot>
        <Router>
          <FirebaseRoot>
            <App />
          </FirebaseRoot>
        </Router>
      </MaterialUIRoot>
    </RecoilRoot>
  );
}

export { Bootstrap };
