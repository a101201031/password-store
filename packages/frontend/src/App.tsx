import { Routes, Route } from 'react-router-dom';
import { SignUp, SignIn } from 'components/sign';
import { Main } from 'components/Main';
import { Accounts, AddAccount, ShowPassword } from 'components';
import { ProtectedRoute } from 'router';

export const App = () => (
  <Routes>
    <Route path="/" element={<Main />}>
      <Route element={<ProtectedRoute />}>
        <Route index element={<ShowPassword />} />
        <Route path="/accounts" element={<Accounts />} />
        <Route path="/accounts/add" element={<AddAccount />} />
      </Route>
    </Route>
    <Route path="/signin" element={<SignIn />} />
    <Route path="/signup" element={<SignUp />} />
  </Routes>
);
