const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const pool = require('./db'); // usamos el pool exportado desde db.js

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.static('public'));
app.use(bodyParser.json());


app.post('/registrar-cliente', async (req, res) => {
    const {
        nombre, apellido, email, fecha_nac, genero, id_clase,
        id_grupo, forma_pago, monto
    } = req.body;

    try {
        await pool.query(
            'CALL registrar_cliente_inscripcion_pago($1,$2,$3,$4,$5,$6,$7,$8,$9)',
            [nombre, apellido, email, fecha_nac, genero, id_clase, id_grupo, forma_pago, monto]

        );
        res.status(200).json({ message: 'Cliente registrado correctamente.' });
    } catch (err) {
        console.error('Error ejecutando procedure:', err);
        res.status(500).json({ error: 'Error registrado Cliente' });
    }
});


app.get("/historial-pagos", async (req, res) => {
    try {
        const result = await pool.query(`
      SELECT 
        c.nombre, 
        c.apellido, 
        cl.nombre AS clase, 
        g.nombre AS grupo, 
        i.forma_de_pago, 
        i.monto, 
        i.fecha_inscripcion AS fecha
      FROM cliente c
      INNER JOIN inscripcion i ON c.id_cliente = i.id_cliente
      INNER JOIN clases cl ON i.id_clase = cl.id_clase
      INNER JOIN grupo g ON i.id_grupo = g.id_grupo
      ORDER BY i.fecha_inscripcion DESC
    `);
        res.json(result.rows);
    } catch (error) {
        console.error("Error al obtener historial:", error);
        res.status(500).send("Error en servidor");
    }
});

app.listen(PORT, () => {
    console.log('Servidor corriendo en http://localhost:${PORT}');
});