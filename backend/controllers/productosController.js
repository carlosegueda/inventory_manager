//Importo los objetos del archivo db.js para poder hacer la conexion a sql
const { poolConnect, sql, pool } = require('../db');


//FUNCION OBTENERPRODUCTOS (GET)
async function obtenerProductos(req, res) {
  try {
    //espera a que termine la conexion a la bd
    await poolConnect;
    //ejecuta una consulta sql que (SELECT * FROM ProductosGI)
    const result = await pool.request().query('SELECT * FROM ProductosGI');
    //devuelve esa consulta como json al cliente
    res.json(result.recordset);
  } catch (err) {
    //si hay error pasa esto
    console.error('Error al obtener productos:', err);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
}

//FUNCION AGREGARPRODUCTO (POST)
async function agregarProducto(req, res) {
  try {
    //espera a que se termine la conexion a la bd
    await poolConnect;
    //extrae los datos enviados en el POST
    const { nombre, codigo, precio, cantidad, categoria } = req.body;
    //crea la consulta sql en la que agrega los datos a una fila en la tabla
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
    //cuando termina manda este mensaje
    res.status(201).json({ mensaje: 'Producto agregado correctamente' });
  } catch (err) {
    //si hay error pasa esto
    console.error('Error al agregar producto:', err);
    res.status(500).json({ error: 'Error al agregar producto' });
  }
}


async function eliminarProductos(req, res) {
  try {
    await pool.request().query('DELETE FROM ProductosGI');
    res.json({ message: 'Productos eliminados' });
  } catch (err) {
    console.error('Error al obtener productos:', err);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
}



module.exports = { obtenerProductos, agregarProducto, eliminarProductos };
