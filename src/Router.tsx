import { Route, Routes } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { NotFound } from './pages/NotFound';

export const Router = () => {
  return (
      <Routes>
        <Route path="/" element={ <HomePage /> } />
        <Route path='/following' element={ <></> }>
            <Route index element={ <></> } />
            <Route path=':id' element={ <></> } />
            <Route path='new' element={ <></> } />
        </Route>
        <Route path="/*" element={ <NotFound /> } />
      </Routes>
  );
}
