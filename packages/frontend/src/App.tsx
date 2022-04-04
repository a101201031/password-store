import { Routes, Route, Link } from 'react-router-dom';
import { SignUp, SignIn } from 'components/sign';

export const App = () => (
  <Routes>
    <Route path="/" element={<SignIn />} />
    <Route path="/signup" element={<SignUp />} />
  </Routes>
);
