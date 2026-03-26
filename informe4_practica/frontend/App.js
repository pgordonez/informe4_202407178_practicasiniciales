import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Publicaciones from './pages/Publicaciones';
import Usuarios from './pages/Usuarios';
import Perfil from './pages/Perfil';
import Cursos from './pages/Cursos';
import './styles.css';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/"                   element={<Login />} />
        <Route path="/register"           element={<Register />} />
        <Route path="/publicaciones"      element={<Publicaciones />} />
        <Route path="/usuarios"           element={<Usuarios />} />
        <Route path="/perfil"             element={<Perfil />} />
        <Route path="/perfil/:registro"   element={<Perfil />} />
        <Route path="/cursos/:registro"   element={<Cursos />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
