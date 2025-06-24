import { Route, Routes } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { NotFound } from './pages/NotFound';
import { NovelRead } from './pages/novelRead/NovelRead';

export const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/*" element={<NotFound />} />
      <Route path="/novelRead" element={<NovelRead />} />
    </Routes>
  );
}
