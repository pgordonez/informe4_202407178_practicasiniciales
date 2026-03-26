import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function Cursos() {
  const { registro: registroParam } = useParams();
  const navigate = useNavigate();
  const usuarioSesion = JSON.parse(localStorage.getItem('usuario'));

  const registro = registroParam || usuarioSesion?.registro;
  const esPropioPerl = !registroParam || registroParam === usuarioSesion?.registro;

  const [cursosAprobados, setCursosAprobados] = useState([]);
  const [todosCursos, setTodosCursos] = useState([]);
  const [usuarioPerfil, setUsuarioPerfil] = useState(null);
  const [cargando, setCargando] = useState(true);

  const cargarAprobados = () => {
    fetch(`http://localhost:3001/cursos-aprobados/${registro}`)
      .then(res => res.json())
      .then(data => setCursosAprobados(data));
  };

  useEffect(() => {
    if (!registro) { setCargando(false); return; }

    // Cargar datos del usuario del perfil
    fetch(`http://localhost:3001/usuario/${registro}`)
      .then(res => res.json())
      .then(data => setUsuarioPerfil(data));

    cargarAprobados();

    // Solo cargar todos los cursos si es el propio perfil
    if (esPropioPerl) {
      fetch('http://localhost:3001/cursos')
        .then(res => res.json())
        .then(data => { setTodosCursos(data); setCargando(false); });
    } else {
      setCargando(false);
    }
  }, [registro]);

  const aprobar = async (curso_id) => {
    await fetch('http://localhost:3001/cursos-aprobados', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ registro, curso_id })
    });
    cargarAprobados();
  };

  const quitar = async (curso_id) => {
    await fetch(`http://localhost:3001/cursos-aprobados/${registro}/${curso_id}`, {
      method: 'DELETE'
    });
    cargarAprobados();
  };

  const idsAprobados = cursosAprobados.map(c => c.id);
  const totalCreditos = cursosAprobados.reduce((sum, c) => sum + (c.creditos || 0), 0);

  if (!usuarioSesion) {
    return (
      <div className="page-container">
        <div className="card" style={{ textAlign: 'center' }}>
          <h3>No has iniciado sesión</h3>
          <button className="btn-primary" onClick={() => navigate('/')}>Ir al Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <button className="btn-secondary" style={{ marginBottom: '1rem' }} onClick={() => navigate(-1)}>
        ← Volver al perfil
      </button>

      <h2 className="page-title">🎓 Cursos Aprobados</h2>

      {usuarioPerfil && (
        <p style={{ color: '#94a3b8', marginBottom: '1rem' }}>
          Estudiante: <strong style={{ color: '#e2e8f0' }}>{usuarioPerfil.nombres} {usuarioPerfil.apellidos}</strong>
        </p>
      )}

      <div className="card" style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: '#94a3b8' }}>Total de créditos aprobados</span>
        <span style={{ fontSize: '1.4rem', fontWeight: '700', color: '#6366f1' }}>{totalCreditos}</span>
      </div>

      {cargando && <p>Cargando...</p>}

      {/* Cursos aprobados */}
      <div className="cursos-grid">
        {cursosAprobados.length === 0 && (
          <div className="card" style={{ textAlign: 'center', color: '#94a3b8' }}>
            No hay cursos aprobados registrados.
          </div>
        )}
        {cursosAprobados.map(c => (
          <div className="card curso-card" key={c.id}>
            <div className="curso-icono">📚</div>
            <div className="curso-info" style={{ flex: 1 }}>
              <strong>{c.nombre}</strong>
              {c.creditos && <span className="curso-ciclo">Créditos: {c.creditos}</span>}
            </div>
            {esPropioPerl && (
              <button
                onClick={() => quitar(c.id)}
                style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '1.1rem' }}
                title="Quitar curso"
              >✕</button>
            )}
          </div>
        ))}
      </div>

      {/* Agregar cursos (solo perfil propio) */}
      {esPropioPerl && todosCursos.length > 0 && (
        <div className="card" style={{ marginTop: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1rem', color: '#94a3b8' }}>➕ Agregar curso aprobado</h3>
          <div className="cursos-grid">
            {todosCursos
              .filter(c => !idsAprobados.includes(c.id))
              .map(c => (
                <div className="card curso-card" key={c.id} style={{ opacity: 0.7 }}>
                  <div className="curso-icono">📖</div>
                  <div className="curso-info" style={{ flex: 1 }}>
                    <strong>{c.nombre}</strong>
                    {c.creditos && <span className="curso-ciclo">Créditos: {c.creditos}</span>}
                  </div>
                  <button
                    onClick={() => aprobar(c.id)}
                    style={{ background: '#22c55e', border: 'none', color: 'white', cursor: 'pointer', borderRadius: '6px', padding: '4px 10px', fontSize: '0.85rem' }}
                  >+ Aprobar</button>
                </div>
              ))}
            {todosCursos.filter(c => !idsAprobados.includes(c.id)).length === 0 && (
              <p style={{ color: '#94a3b8' }}>¡Aprobaste todos los cursos! 🎉</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Cursos;