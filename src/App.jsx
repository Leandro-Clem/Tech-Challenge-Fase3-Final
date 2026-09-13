import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Admin from './pages/Admin';
import EditPost from './pages/EditPost';
import Home from './pages/Home';
import Login from './pages/Login';
import NewPost from './pages/NewPost';
import NotFound from './pages/NotFound';
import PostDetail from './pages/PostDetail';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/posts/:id" element={<PostDetail />} />
        <Route path="/login" element={<Login />} />

        {/* Restritas a professores autenticados */}
        <Route element={<ProtectedRoute role="professor" />}>
          <Route path="/posts/novo" element={<NewPost />} />
          <Route path="/posts/:id/editar" element={<EditPost />} />
          <Route path="/admin" element={<Admin />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
