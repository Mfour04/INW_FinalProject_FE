import { Route, Routes } from 'react-router-dom';
import { HomePage } from '../pages/HomePage';
import { NotFound } from '../pages/NotFound';
import { UserProfile } from '../pages/userProfile/UserProfile';
import { ProtectedRoutes } from './ProtectedRoutes';
import { Unauthorized } from '../pages/Unauthorized';

export const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path='/following' element={<ProtectedRoutes />}>
        <Route index element={<></>} />
        <Route path=':id' element={<></>} />
        <Route path='new' element={<></>} />
      </Route>
      <Route path='/unauthorized' element={<Unauthorized />}/>
      <Route path="/profile" element={<UserProfile />} />
      <Route path="/*" element={<NotFound />} />
    </Routes>
  );
}
