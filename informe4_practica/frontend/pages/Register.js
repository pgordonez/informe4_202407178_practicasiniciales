import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [form, setForm] = useState({
    registro: '',
    nombres: '',
    apellidos: '',
    correo: '',
    contrasena: '',
    confirmar: ''
  });
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const registrar = async () => {
    setError('');
    const { registro, nombres, apellidos, correo, contrasena, confirmar } = form;

    if (!registro || !nombres || !apellidos || !correo || !contrasena || !confirmar) {
      setError('Por favor completa todos los campos.');
      return;
    }

    if (contrasena !== confirmar) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    if (contrasena.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setCargando(true);
    try {
      const res = await fetch('http://localhost:3001/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registro, nombres, apellidos, correo, contrasena })
      });

      const data = await res.json();

      if (data.success) {
        alert('Cuenta creada exitosamente. Ahora puedes iniciar sesión.');
        navigate('/');
      } else {
        setError(data.message || 'Error al crear la cuenta.');
      }
    } catch {
      setError('Error de conexión con el servidor.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="card auth-card" style={{ maxWidth: '480px' }}>
        <div className="auth-header">
          <h2>📝 Crear cuenta</h2>
          <p>Completa el formulario para registrarte</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <div className="form-group">
          <label>Número de Registro</label>
          <input
            name="registro"
            placeholder="Ej: 202300001"
            value={form.registro}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Nombres</label>
            <input
              name="nombres"
              placeholder="Juan Carlos"
              value={form.nombres}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Apellidos</label>
            <input
              name="apellidos"
              placeholder="García López"
              value={form.apellidos}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Correo electrónico</label>
          <input
            name="correo"
            type="email"
            placeholder="correo@ejemplo.com"
            value={form.correo}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Contraseña</label>
            <input
              name="contrasena"
              type="password"
              placeholder="••••••••"
              value={form.contrasena}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Confirmar contraseña</label>
            <input
              name="confirmar"
              type="password"
              placeholder="••••••••"
              value={form.confirmar}
              onChange={handleChange}
            />
          </div>
        </div>

        <button className="btn-primary" onClick={registrar} disabled={cargando}>
          {cargando ? 'Registrando...' : 'Crear cuenta'}
        </button>

        <p className="auth-link">
          ¿Ya tienes cuenta? <a href="/">Inicia sesión aquí</a>
        </p>
      </div>
    </div>
  );
}

export default Register;