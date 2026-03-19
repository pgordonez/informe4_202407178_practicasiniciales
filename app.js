const express = require('express');
const mysql = require('mysql2');

const app = express();
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'informe4_practica'
});

db.connect(err => {
  if (err) throw err;
  console.log('Conectado a MySQL');
});

app.get('/usuarios', (req, res) => {
  db.query('SELECT * FROM usuarios', (err, result) => {
    if (err) return res.send(err);
    res.json(result);
  });
});

app.post('/publicaciones', (req, res) => {
  const { usuario_id, tipo, referencia_id, mensaje } = req.body;

  const sql = 'INSERT INTO publicaciones (usuario_id, tipo, referencia_id, mensaje) VALUES (?, ?, ?, ?)';
  
  db.query(sql, [usuario_id, tipo, referencia_id, mensaje], (err, result) => {
    if (err) return res.send(err);
    res.send('Publicación creada');
  });
});

app.listen(3000, () => {
  console.log('Servidor en http://localhost:3000');
});

app.get('/publicaciones', (req, res) => {
  const sql = 'SELECT * FROM publicaciones';

  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      return res.send('Error al obtener publicaciones');
    }
    res.json(result);
  });
});
