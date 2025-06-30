import { Route, Routes } from 'react-router-dom';
import { HomePage } from '../pages/HomePage';
import { NotFound } from '../pages/NotFound';
import { UserProfile } from '../pages/userProfile/UserProfile';
import { ProtectedRoutes } from './ProtectedRoutes';
import { Unauthorized } from '../pages/Unauthorized';
import { Roles } from '../context/AuthContext/AuthProvider';

export const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path='/following' element={<ProtectedRoutes role={[Roles.Reader, Roles.Author]} />}>
        <Route index element={<></>} />
        <Route path=':id' element={<></>} />
        <Route path='new' element={<></>} />
      </Route>
      <Route path='/admin' element={< ProtectedRoutes role={Roles.Admin}/>}>

      </Route>
      <Route path="/profile" element={<UserProfile />} />
      <Route path='/unauthorized' element={<Unauthorized />}/>
      <Route path="/*" element={<NotFound />} />
    </Routes>
  );
}
