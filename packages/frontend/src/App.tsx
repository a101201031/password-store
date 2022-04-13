import { Routes, Route, Link } from 'react-router-dom';
import { SignUp, SignIn } from 'components/sign';
import { Main } from 'components/Main';
import { AccountList, ShowPassword } from 'components';

export const App = () => (
  <Routes>
    <Route path="/" element={<Main />}>
      <Route path="/main" element={<ShowPassword />} />
      <Route path="/account-list" element={<AccountList />} />
    </Route>
    <Route path="/signin" element={<SignIn />} />
    <Route path="/signup" element={<SignUp />} />
  </Routes>
);
