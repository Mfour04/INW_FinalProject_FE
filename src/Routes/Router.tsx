import { Route, Routes } from 'react-router-dom';
import { HomePage } from '../pages/HomePage';
import { NotFound } from '../pages/NotFound';
import { UserProfile } from '../pages/userProfile/UserProfile';
import { ProtectedRoutes } from './ProtectedRoutes';
import { Unauthorized } from '../pages/Unauthorized';
import { Roles } from '../context/AuthContext/AuthProvider';
import { Novels } from '../pages/Novels/Novels';
import { LoginNeeded } from '../pages/LoginNeeded';
import { WritingRoom } from '../pages/WritingRoom/WritingRoom';

export const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path='/following' element={<ProtectedRoutes role={[Roles.Reader, Roles.Author]} />}>
        <Route index element={<></>} />
        <Route path=':id' element={<></>} />
        <Route path='new' element={<></>} />
      </Route>
      <Route path='/novels' >
        <Route index element={ <Novels /> }/>
        <Route path='writing-room' element={ <ProtectedRoutes role={[Roles.Reader, Roles.Author]} /> }>
          <Route index element={<WritingRoom />} />
        </ Route>
      </Route>
      <Route path='/admin' element={< ProtectedRoutes role={Roles.Admin}/>}>

      </Route>
      <Route path="/profile" element={<UserProfile />} />
      <Route path='/unauthorized' element={<Unauthorized />}/>
      <Route path='/needlogin' element={<LoginNeeded />}/>
      <Route path="/*" element={<NotFound />} />
    </Routes>
  );
}
