import { useEffect, useState } from 'react';

function Comentarios({ publicacionId, usuario }) {
  const [lista, setLista] = useState([]);
  const [comentario, setComentario] = useState('');
  const [enviando, setEnviando] = useState(false);

  const cargar = () => {
    fetch(`http://localhost:3001/comentarios/${publicacionId}`)
      .then(res => res.json())
      .then(data => setLista(data));
  };

  useEffect(() => {
    cargar();
  }, [publicacionId]);

  const enviar = async () => {
    if (!comentario.trim()) return;
    setEnviando(true);
    try {
      await fetch('http://localhost:3001/comentarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          registro: usuario.registro,
          publicacion_id: publicacionId,
          comentario: comentario.trim()
        })
      });
      setComentario('');
      cargar();
    } finally {
      setEnviando(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      enviar();
    }
  };

  return (
    <div className="comentarios-section">
      <h4>Comentarios ({lista.length})</h4>

      <div className="comentarios-lista">
        {lista.length === 0 && (
          <p className="sin-comentarios">Sé el primero en comentar...</p>
        )}
        {lista.map(c => {
          const iniciales = `${c.nombres?.[0] || ''}${c.apellidos?.[0] || ''}`.toUpperCase();
          return (
            <div className="comentario" key={c.id}>
              <div className="comentario-avatar">{iniciales}</div>
              <div className="comentario-body">
                <strong>{c.nombres} {c.apellidos}</strong>
                <p>{c.comentario}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="comentario-input">
        <input
          placeholder="Escribe un comentario... (Enter para enviar)"
          value={comentario}
          onChange={e => setComentario(e.target.value)}
          onKeyDown={handleKey}
          disabled={enviando}
        />
        <button className="btn-sm" onClick={enviar} disabled={enviando || !comentario.trim()}>
          {enviando ? '...' : 'Enviar'}
        </button>
      </div>
    </div>
  );
}

export default Comentarios;
