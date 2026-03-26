import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Comentarios from './Comentarios';

function Publicaciones() {
  const navigate = useNavigate();

  const [usuario] = useState(() => {
    try { return JSON.parse(localStorage.getItem('usuario')); }
    catch { return null; }
  });

  const [publicaciones, setPublicaciones] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [cargando, setCargando] = useState(true);

  const [buscarCurso, setBuscarCurso] = useState('');
  const [buscarCatedratico, setBuscarCatedratico] = useState('');
  const [cursoFiltro, setCursoFiltro] = useState('');

  const [titulo, setTitulo] = useState('');
  const [contenido, setContenido] = useState('');
  const [cursoId, setCursoId] = useState('');
  const [catedratico, setCatedratico] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [errorForm, setErrorForm] = useState('');

  const [comentariosAbiertos, setComentariosAbiertos] = useState({});

  useEffect(() => {
    if (!usuario) { navigate('/'); return; }
    cargarCursos();
    cargarPublicaciones();
  }, []);

  const cargarCursos = () => {
    fetch('http://localhost:3001/cursos')
      .then(res => res.json())
      .then(data => setCursos(Array.isArray(data) ? data : []))
      .catch(() => setCursos([]));
  };

  const cargarPublicaciones = (params = {}) => {
    setCargando(true);
    const query = new URLSearchParams();
    if (params.curso_id)          query.append('curso_id', params.curso_id);
    if (params.buscar_curso)      query.append('buscar_curso', params.buscar_curso);
    if (params.buscar_catedratico) query.append('buscar_catedratico', params.buscar_catedratico);

    fetch(`http://localhost:3001/publicaciones?${query.toString()}`)
      .then(res => res.json())
      .then(data => { setPublicaciones(Array.isArray(data) ? data : []); setCargando(false); })
      .catch(() => { setPublicaciones([]); setCargando(false); });
  };

  const aplicarFiltros = () => {
    cargarPublicaciones({
      curso_id: cursoFiltro,
      buscar_curso: buscarCurso,
      buscar_catedratico: buscarCatedratico
    });
  };

  const limpiarFiltros = () => {
    setBuscarCurso('');
    setBuscarCatedratico('');
    setCursoFiltro('');
    cargarPublicaciones();
  };

  const publicar = async () => {
    setErrorForm('');
    if (!titulo.trim() || !contenido.trim()) {
      setErrorForm('El título y el contenido son obligatorios.');
      return;
    }
    if (!usuario || !usuario.registro) {
      setErrorForm('Sesión expirada. Vuelve a iniciar sesión.');
      navigate('/');
      return;
    }

    setEnviando(true);
    try {
      const res = await fetch('http://localhost:3001/publicaciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          registro: usuario.registro,
          titulo: titulo.trim(),
          contenido: contenido.trim(),
          curso_id: cursoId || null,
          catedratico: catedratico.trim() || null
        })
      });
      const data = await res.json();
      if (data.success) {
        setTitulo('');
        setContenido('');
        setCursoId('');
        setCatedratico('');
        cargarPublicaciones();
      } else {
        setErrorForm(data.message || 'Error al publicar. Intenta de nuevo.');
      }
    } catch {
      setErrorForm('Error de conexión con el servidor.');
    } finally {
      setEnviando(false);
    }
  };

  const eliminar = async (id) => {
    if (!window.confirm('¿Eliminar esta publicación?')) return;
    await fetch(`http://localhost:3001/publicaciones/${id}`, { method: 'DELETE' });
    cargarPublicaciones();
  };

  const toggleComentarios = (id) => {
    setComentariosAbiertos(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (!usuario) return null;

  return (
    <div className="page-container">
      <h2 className="page-title">📢 Publicaciones</h2>

      {/* Nueva publicación */}
      <div className="card nueva-publicacion">
        <h3>Nueva publicación</h3>

        {errorForm && <div className="alert alert-error">{errorForm}</div>}

        <div className="form-group">
          <label>Título</label>
          <input
            placeholder="¿De qué trata tu publicación?"
            value={titulo}
            onChange={e => setTitulo(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Contenido</label>
          <textarea
            placeholder="Escribe tu publicación aquí..."
            value={contenido}
            onChange={e => setContenido(e.target.value)}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Curso <span style={{ color: '#64748b', fontSize: '0.8rem' }}>(opcional)</span></label>
            <select value={cursoId} onChange={e => setCursoId(e.target.value)}>
              <option value="">-- Sin curso --</option>
              {cursos.map(c => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Catedrático <span style={{ color: '#64748b', fontSize: '0.8rem' }}>(opcional)</span></label>
            <input
              placeholder="Nombre del catedrático"
              value={catedratico}
              onChange={e => setCatedratico(e.target.value)}
            />
          </div>
        </div>

        <button className="btn-primary" onClick={publicar} disabled={enviando}>
          {enviando ? 'Publicando...' : '📤 Publicar'}
        </button>
      </div>

      {/* Filtros */}
      <div className="card filtros-card" style={{ marginBottom: '1.5rem' }}>
        <h3>🔍 Filtrar publicaciones</h3>
        <div className="filtros-grid">
          <div className="form-group" style={{ margin: 0 }}>
            <label>Por curso</label>
            <select value={cursoFiltro} onChange={e => setCursoFiltro(e.target.value)}>
              <option value="">Todos los cursos</option>
              {cursos.map(c => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label>Buscar por curso</label>
            <input
              placeholder="Nombre del curso..."
              value={buscarCurso}
              onChange={e => setBuscarCurso(e.target.value)}
            />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label>Buscar por catedrático</label>
            <input
              placeholder="Nombre del catedrático..."
              value={buscarCatedratico}
              onChange={e => setBuscarCatedratico(e.target.value)}
            />
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
          <button className="btn-secondary" onClick={aplicarFiltros}>Aplicar filtros</button>
          <button className="btn-danger" onClick={limpiarFiltros}>Limpiar</button>
        </div>
      </div>

      {/* Lista */}
      {cargando && <p style={{ color: '#94a3b8' }}>Cargando publicaciones...</p>}

      {!cargando && publicaciones.length === 0 && (
        <div className="card" style={{ textAlign: 'center', color: '#94a3b8' }}>
          No hay publicaciones aún. ¡Sé el primero en publicar!
        </div>
      )}

      {publicaciones.map(pub => {
        const iniciales = `${pub.nombres?.[0] || ''}${pub.apellidos?.[0] || ''}`.toUpperCase();
        const esMia = String(usuario.registro) === String(pub.registro);

        return (
          <div className="card publicacion-card" key={pub.id}>
            <div className="publicacion-header">
              <div className="publicacion-autor-avatar">{iniciales}</div>
              <div style={{ flex: 1 }}>
                <strong>{pub.nombres} {pub.apellidos}</strong>
                <div className="publicacion-reg">Reg: {pub.registro}</div>
              </div>
              {pub.curso_nombre && (
                <span className="publicacion-tag">📚 {pub.curso_nombre}</span>
              )}
              {esMia && (
                <button
                  onClick={() => eliminar(pub.id)}
                  style={{
                    background: 'transparent', border: 'none',
                    color: '#ef4444', cursor: 'pointer',
                    fontSize: '1rem', marginLeft: '0.5rem'
                  }}
                  title="Eliminar publicación"
                >🗑</button>
              )}
            </div>

            <h3 className="publicacion-titulo">{pub.titulo}</h3>
            <p className="publicacion-contenido">{pub.contenido}</p>

            {pub.catedratico && (
              <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '0.5rem' }}>
                👨‍🏫 {pub.catedratico}
              </p>
            )}

            <button
              className="btn-comentarios"
              onClick={() => toggleComentarios(pub.id)}
            >
              {comentariosAbiertos[pub.id] ? '▲ Ocultar comentarios' : '💬 Ver comentarios'}
            </button>

            {comentariosAbiertos[pub.id] && (
              <Comentarios publicacionId={pub.id} usuario={usuario} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default Publicaciones;