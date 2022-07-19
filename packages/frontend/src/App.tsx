import {
  Account,
  AccountBoard,
  AccountEditBoard,
  CircularIndicator,
  Main,
} from 'components';
import { SignIn, SignUp } from 'components/sign';
import { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from 'router';

export const App = () => (
  <Routes>
    <Route
      path="/"
      element={
        <Suspense fallback={<CircularIndicator />}>
          <ProtectedRoute />
        </Suspense>
      }
    >
      <Route element={<Main />}>
        <Route index element={<AccountBoard />} />
        <Route path="/accounts" element={<AccountEditBoard />} />
        <Route path="/account/:aid" element={<Account />} />
      </Route>
    </Route>
    <Route path="/signin" element={<SignIn />} />
    <Route path="/signup" element={<SignUp />} />
  </Routes>
);
