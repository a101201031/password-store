import {
  Account,
  AccountAdd,
  AccountBoard,
  AccountEdit,
  AccountEditBoard,
  Group,
  GroupAdd,
  GroupBoard,
  Main,
} from 'components';
import { SignIn, SignUp } from 'components/sign';
import { Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from 'router';

export const App = () => (
  <Routes>
    <Route path="/" element={<ProtectedRoute />}>
      <Route element={<Main />}>
        <Route index element={<AccountBoard />} />
        <Route path="/accounts" element={<AccountEditBoard />} />
        <Route path="/account" element={<Account />}>
          <Route path="add" element={<AccountAdd />} />
          <Route path=":aid" element={<AccountEdit />} />
        </Route>
        <Route path="/groups" element={<GroupBoard />} />
        <Route path="/group" element={<Group />}>
          <Route path="add" element={<GroupAdd />} />
        </Route>
      </Route>
    </Route>
    <Route path="/signin" element={<SignIn />} />
    <Route path="/signup" element={<SignUp />} />
  </Routes>
);
