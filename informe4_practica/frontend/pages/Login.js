import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const login = async () => {
    setError('');
    if (!correo || !contrasena) {
      setError('Por favor completa todos los campos.');
      return;
    }

    setCargando(true);
    try {
      const res = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, contrasena })
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem('usuario', JSON.stringify(data.usuario));
        navigate('/publicaciones');
      } else {
        setError(data.message || 'Credenciales incorrectas');
      }
    } catch {
      setError('Error de conexión con el servidor.');
    } finally {
      setCargando(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter') login();
  };

  return (
    <div className="auth-container">
      <div className="card auth-card">
        <div className="auth-header">
          <h2>🎓 Bienvenido</h2>
          <p>Ingresa tus credenciales para continuar</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <div className="form-group">
          <label>Correo electrónico</label>
          <input
            type="email"
            placeholder="correo@ejemplo.com"
            value={correo}
            onChange={e => setCorreo(e.target.value)}
            onKeyDown={handleKey}
          />
        </div>

        <div className="form-group">
          <label>Contraseña</label>
          <input
            type="password"
            placeholder="••••••••"
            value={contrasena}
            onChange={e => setContrasena(e.target.value)}
            onKeyDown={handleKey}
          />
        </div>

        <button className="btn-primary" onClick={login} disabled={cargando}>
          {cargando ? 'Ingresando...' : 'Ingresar'}
        </button>

        <p className="auth-link">
          ¿No tienes cuenta? <a href="/register">Regístrate aquí</a>
        </p>
        <p className="auth-link">
          <a href="/recuperar">¿Olvidaste tu contraseña?</a>
        </p>
      </div>
    </div>
  );
}

export default Login;