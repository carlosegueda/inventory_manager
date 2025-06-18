// controllers/productosController.js
const { poolConnect, sql, pool } = require('../db');

async function obtenerProductos(req, res) {
  try {
    await poolConnect;
    const result = await pool.request().query('SELECT * FROM ProductosGI');
    res.json(result.recordset);
  } catch (err) {
    console.error('Error al obtener productos:', err);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
}

async function agregarProducto(req, res) {
  try {
    await poolConnect;

    const { nombre, codigo, precio, cantidad, categoria } = req.body;

    const result = await pool.request()
      .input('nombre', sql.VarChar, nombre)
      .input('codigo', sql.VarChar, codigo)
      .input('precio', sql.Decimal(10, 2), precio)
      .input('cantidad', sql.Int, cantidad)
      .input('categoria', sql.VarChar, categoria)
      .query(`
        INSERT INTO ProductosGI (nombre, codigo, precio, cantidad, categoria)
        VALUES (@nombre, @codigo, @precio, @cantidad, @categoria)
      `);

    res.status(201).json({ mensaje: 'Producto agregado correctamente' });
  } catch (err) {
    console.error('Error al agregar producto:', err);
    res.status(500).json({ error: 'Error al agregar producto' });
  }
}


module.exports = { obtenerProductos, agregarProducto };
