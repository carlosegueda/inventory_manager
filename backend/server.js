const express = require('express');
const cors = require('cors');
const sql = require('mssql');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const config = {
  user: 'carlos.osegueda',
  password: 'CO20212030669',
  server: '3.128.144.165',
  database: 'DB20212030669',
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

let pool;

sql.connect(config).then((p) => {
  pool = p;
  console.log('Conectado a SQL Server');
}).catch(err => {
  console.error('Error conectando a SQL Server:', err);
});

// Obtener todos los productos
app.get('/productos', async (req, res) => {
  try {
    const result = await pool.request().query('SELECT * FROM ProductosGI');
    res.json(result.recordset);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

// Agregar un producto
app.post('/productos', async (req, res) => {
  const { nombre, codigo, cantidad, precio, categoria } = req.body;

  try {
    await pool.request()
      .input('nombre', sql.VarChar, nombre)
      .input('codigo', sql.VarChar, codigo)
      .input('cantidad', sql.Int, cantidad)
      .input('precio', sql.Decimal(10, 2), precio)
      .input('categoria', sql.VarChar, categoria)
      .query(`INSERT INTO ProductosGI (nombre, codigo, cantidad, precio, categoria)
              VALUES (@nombre, @codigo, @cantidad, @precio, @categoria)`);
    res.json({ message: 'Producto agregado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al agregar producto' });
  }
});


// Eliminar todos los productos
app.delete('/productos', async (req, res) => {
  try {
    await pool.request().query('DELETE FROM ProductosGI');
    res.json({ message: 'Productos eliminados' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar productos' });
  }
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
