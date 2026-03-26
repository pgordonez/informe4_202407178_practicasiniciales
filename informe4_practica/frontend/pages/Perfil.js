import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function Perfil() {
  const { registro: registroBuscado } = useParams();
  const navigate = useNavigate();

  const [usuarioSesion] = useState(() => {
    try { return JSON.parse(localStorage.getItem('usuario')); }
    catch { return null; }
  });

  const esPropioPerl = !registroBuscado || registroBuscado === String(usuarioSesion?.registro);

  const [usuario, setUsuario] = useState(null);
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({});
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');

  useEffect(() => {
    const reg = registroBuscado || usuarioSesion?.registro;
    if (!reg) return;
    fetch(`http://localhost:3001/usuario/${reg}`)
      .then(res => res.json())
      .then(data => {
        setUsuario(data);
        setForm(data || {});
      })
      .catch(() => setUsuario(null));
  }, [registroBuscado]);

  const cerrarSesion = () => {
    localStorage.removeItem('usuario');
    navigate('/');
  };

  const guardar = async () => {
    setError('');
    setExito('');
    if (!form.nombres || !form.apellidos || !form.correo) {
      setError('Nombres, apellidos y correo son obligatorios.');
      return;
    }
    try {
      const res = await fetch(`http://localhost:3001/usuario/${usuario.registro}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.success) {
        const actualizado = { ...usuarioSesion, ...form };
        localStorage.setItem('usuario', JSON.stringify(actualizado));
        setUsuario(actualizado);
        setExito('Perfil actualizado correctamente.');
        setEditando(false);
      } else {
        setError(data.message || 'Error al actualizar.');
      }
    } catch {
      setError('Error de conexión con el servidor.');
    }
  };

  if (!usuarioSesion) {
    return (
      <div className="page-container">
        <div className="card" style={{ textAlign: 'center' }}>
          <h3>No has iniciado sesión</h3>
          <button className="btn-primary" style={{ marginTop: '1rem' }} onClick={() => navigate('/')}>
            Ir al Login
          </button>
        </div>
      </div>
    );
  }

  if (!usuario) {
    return (
      <div className="page-container">
        <div className="card" style={{ textAlign: 'center', color: '#94a3b8' }}>
          <h3>Usuario no encontrado</h3>
          <button className="btn-secondary" style={{ marginTop: '1rem' }} onClick={() => navigate(-1)}>
            ← Volver
          </button>
        </div>
      </div>
    );
  }

  const iniciales = `${usuario.nombres?.[0] || ''}${usuario.apellidos?.[0] || ''}`.toUpperCase();

  return (
    <div className="page-container">
      {registroBuscado && (
        <button className="btn-secondary" style={{ marginBottom: '1rem' }} onClick={() => navigate(-1)}>
          ← Volver
        </button>
      )}

      <div className="card perfil-card">
        <div className="perfil-avatar">{iniciales}</div>
        <h2 className="perfil-nombre">{usuario.nombres} {usuario.apellidos}</h2>
        <p className="perfil-correo">{usuario.correo}</p>

        {exito && (
          <div className="alert" style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.4)', color: '#86efac' }}>
            {exito}
          </div>
        )}
        {error && <div className="alert alert-error">{error}</div>}

        {!editando ? (
          <>
            <div className="perfil-info">
              <div className="perfil-dato">
                <span className="perfil-label">Número de Registro</span>
                <span className="perfil-valor">{usuario.registro}</span>
              </div>
            </div>

            <div className="perfil-acciones">
              {/* Botón Cursos — siempre visible */}
              <button
                className="btn-secondary"
                onClick={() => navigate(`/cursos/${usuario.registro}`)}
              >
                🎓 Cursos Aprobados
              </button>

              {esPropioPerl && (
                <>
                  <button
                    className="btn-secondary"
                    onClick={() => { setEditando(true); setForm({ ...usuario }); }}
                  >
                    ✏️ Editar perfil
                  </button>
                  <button className="btn-danger" onClick={cerrarSesion}>
                    Cerrar sesión
                  </button>
                </>
              )}
            </div>
          </>
        ) : (
          <div style={{ marginTop: '1rem', textAlign: 'left' }}>
            <div className="form-row">
              <div className="form-group">
                <label>Nombres</label>
                <input
                  value={form.nombres || ''}
                  onChange={e => setForm({ ...form, nombres: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Apellidos</label>
                <input
                  value={form.apellidos || ''}
                  onChange={e => setForm({ ...form, apellidos: e.target.value })}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Correo electrónico</label>
              <input
                type="email"
                value={form.correo || ''}
                onChange={e => setForm({ ...form, correo: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>
                Nueva contraseña{' '}
                <span style={{ color: '#64748b', fontSize: '0.8rem' }}>(dejar vacío para no cambiar)</span>
              </label>
              <input
                type="password"
                placeholder="••••••••"
                onChange={e => setForm({ ...form, contrasena: e.target.value })}
              />
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button className="btn-primary" style={{ width: 'auto' }} onClick={guardar}>
                Guardar
              </button>
              <button className="btn-secondary" onClick={() => { setEditando(false); setError(''); }}>
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Perfil;