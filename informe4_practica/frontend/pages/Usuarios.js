import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [registroBuscar, setRegistroBuscar] = useState('');
  const [errorBusqueda, setErrorBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3001/usuarios')
      .then(res => res.json())
      .then(data => { setUsuarios(data); setCargando(false); })
      .catch(() => setCargando(false));
  }, []);

  const buscarPorRegistro = async () => {
    setErrorBusqueda('');
    if (!registroBuscar.trim()) return;
    const res = await fetch(`http://localhost:3001/usuario/${registroBuscar.trim()}`);
    const data = await res.json();
    if (data) {
      navigate(`/perfil/${registroBuscar.trim()}`);
    } else {
      setErrorBusqueda('Usuario no encontrado con ese número de registro.');
    }
  };

  const listaFiltrada = usuarios.filter(u =>
    busqueda === '' ||
    u.nombres.toLowerCase().includes(busqueda.toLowerCase()) ||
    u.apellidos.toLowerCase().includes(busqueda.toLowerCase()) ||
    u.registro.toString().includes(busqueda)
  );

  return (
    <div className="page-container">
      <h2 className="page-title">👥 Usuarios Registrados</h2>

      {/* Buscador por registro */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ marginBottom: '0.75rem', fontSize: '0.95rem', color: '#94a3b8' }}>
          🔍 Buscar perfil por Número de Registro
        </h3>
        {errorBusqueda && <div className="alert alert-error">{errorBusqueda}</div>}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            placeholder="Ej: 202300001"
            value={registroBuscar}
            onChange={e => setRegistroBuscar(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && buscarPorRegistro()}
          />
          <button className="btn-sm" onClick={buscarPorRegistro}>Buscar</button>
        </div>
      </div>

      {/* Filtro por nombre */}
      <div className="buscador" style={{ marginBottom: '1rem' }}>
        <input
          placeholder="Filtrar por nombre o registro..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
        />
      </div>

      {cargando && <p>Cargando usuarios...</p>}

      <div className="usuarios-grid">
        {listaFiltrada.map(u => {
          const iniciales = `${u.nombres?.[0] || ''}${u.apellidos?.[0] || ''}`.toUpperCase();
          return (
            <div
              className="card usuario-card"
              key={u.registro}
              onClick={() => navigate(`/perfil/${u.registro}`)}
              style={{ cursor: 'pointer' }}
            >
              <div className="usuario-avatar">{iniciales}</div>
              <div className="usuario-info">
                <strong>{u.nombres} {u.apellidos}</strong>
                <p>{u.correo}</p>
                <span className="usuario-reg">Reg: {u.registro}</span>
              </div>
              <span style={{ color: '#64748b', marginLeft: 'auto', fontSize: '1.2rem' }}>→</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Usuarios;