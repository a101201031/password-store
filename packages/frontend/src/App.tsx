import {
  Account,
  AccountAdd,
  AccountBoard,
  AccountEdit,
  AccountEditBoard,
  Group,
  GroupAdd,
  GroupBoard,
  GroupEdit,
  Main,
  User,
} from 'components';
import { SignIn, SignUp } from 'components/sign';
import { Navigate, Route, Routes } from 'react-router-dom';
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
          <Route path=":gid" element={<GroupEdit />} />
        </Route>
        <Route path="/user" element={<User />} />
        <Route path="*" element={<Navigate to="/" replace={true} />} />
      </Route>
    </Route>
    <Route path="/sign-in" element={<SignIn />} />
    <Route path="/sign-up" element={<SignUp />} />
  </Routes>
);
