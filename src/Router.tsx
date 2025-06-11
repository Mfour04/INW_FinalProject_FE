import { Route, Routes } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { NotFound } from './pages/NotFound';
import { UserProfile } from './pages/userProfile/UserProfile';

export const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/profile" element={<UserProfile />} />
    </Routes>
  );
}
