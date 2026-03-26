import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function RecuperarContrasena() {
  const [paso, setPaso] = useState(1);
  const [registro, setRegistro] = useState('');
  const [correo, setCorreo] = useState('');
  const [nuevaContrasena, setNuevaContrasena] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  // Paso 1: solo verificar que el usuario existe, sin cambiar nada
  const verificar = async () => {
    setError('');
    if (!registro || !correo) {
      setError('Completa todos los campos.');
      return;
    }
    setCargando(true);
    try {
      const res = await fetch('http://localhost:3001/verificar-usuario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registro, correo })
      });
      const data = await res.json();
      if (data.success) {
        setPaso(2);
      } else {
        setError(data.message || 'Registro o correo incorrecto.');
      }
    } catch {
      setError('Error de conexión.');
    } finally {
      setCargando(false);
    }
  };

  // Paso 2: cambiar la contraseña
  const cambiar = async () => {
    setError('');
    if (!nuevaContrasena || !confirmar) {
      setError('Completa todos los campos.');
      return;
    }
    if (nuevaContrasena !== confirmar) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    if (nuevaContrasena.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    setCargando(true);
    try {
      const res = await fetch('http://localhost:3001/recuperar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registro, correo, nueva_contrasena: nuevaContrasena })
      });
      const data = await res.json();
      if (data.success) {
        alert('Contraseña actualizada. Inicia sesión con tu nueva contraseña.');
        navigate('/');
      } else {
        setError(data.message || 'Error al actualizar.');
      }
    } catch {
      setError('Error de conexión.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="card auth-card">
        <div className="auth-header">
          <h2>🔑 Recuperar Contraseña</h2>
          <p>{paso === 1 ? 'Ingresa tus datos para verificar tu identidad' : 'Elige una nueva contraseña'}</p>
        </div>

        {/* Indicador de pasos */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
          {[1, 2].map(n => (
            <div key={n} style={{
              flex: 1, height: '4px', borderRadius: '2px',
              background: n <= paso ? '#6366f1' : '#334155'
            }} />
          ))}
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {paso === 1 ? (
          <>
            <div className="form-group">
              <label>Número de Registro</label>
              <input
                placeholder="Ej: 202300001"
                value={registro}
                onChange={e => setRegistro(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && verificar()}
              />
            </div>
            <div className="form-group">
              <label>Correo electrónico</label>
              <input
                type="email"
                placeholder="correo@ejemplo.com"
                value={correo}
                onChange={e => setCorreo(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && verificar()}
              />
            </div>
            <button className="btn-primary" onClick={verificar} disabled={cargando}>
              {cargando ? 'Verificando...' : 'Verificar identidad'}
            </button>
          </>
        ) : (
          <>
            <div className="form-group">
              <label>Nueva contraseña</label>
              <input
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={nuevaContrasena}
                onChange={e => setNuevaContrasena(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Confirmar contraseña</label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmar}
                onChange={e => setConfirmar(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && cambiar()}
              />
            </div>
            <button className="btn-primary" onClick={cambiar} disabled={cargando}>
              {cargando ? 'Guardando...' : 'Cambiar contraseña'}
            </button>
          </>
        )}

        <p className="auth-link" style={{ marginTop: '1rem' }}>
          <a href="/">← Volver al Login</a>
        </p>
      </div>
    </div>
  );
}

export default RecuperarContrasena;