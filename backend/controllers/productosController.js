//Importo los objetos del archivo db.js para poder hacer la conexion a sql
const { poolConnect, sql, pool } = require('../db');


//FUNCION OBTENER TODOS LOS PRODUCTOS (GET))
async function getAll(req, res) {
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

//FUNCION AGREGAR PRODUCTO (POST)
async function addProduct(req, res) {
  try {
    //espera a que se termine la conexion a la bd
    await poolConnect;
    //extrae los datos enviados en el POST
    const { nombre, precio, cantidad, categoria } = req.body;
    //crea la consulta sql en la que agrega los datos a una fila en la tabla
    const result = await pool.request()
      .input('nombre', sql.VarChar, nombre)
      .input('precio', sql.Decimal(10, 2), precio)
      .input('cantidad', sql.Int, cantidad)
      .input('categoria', sql.VarChar, categoria)
      .query(`
        INSERT INTO ProductosGI (nombre, precio, cantidad, categoria)
        VALUES (@nombre, @precio, @cantidad, @categoria)
      `);
    //cuando termina manda este mensaje
    res.status(201).json({ mensaje: 'Producto agregado correctamente' });
  } catch (err) {
    //si hay error pasa esto
    console.error('Error al agregar producto:', err);
    res.status(500).json({ error: 'Error al agregar producto' });
  }
}

//FUNCION ELIMINAR TODOS LOS PRODUCTOS (DELETE)
async function deleteAll(req, res) {
  try {
    await pool.request().query('DELETE FROM ProductosGI');
    res.json({ message: 'Productos eliminados' });
  } catch (err) {
    console.error('Error al obtener productos:', err);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
}

//FUNCION ELIMINAR PRODUCTO POR ID (DELETE)
async function deleteById(req, res) {
  const codigo = parseInt(req.params.codigo);
  if (isNaN(codigo)) {
    return res.status(400).json({ error: 'Código inválido' });
  }

  try {
    await poolConnect;

    const request = pool.request();
    const result = await request
      .input('codigo', sql.Int, codigo)
      .query('DELETE FROM ProductosGI WHERE codigo = @codigo');

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
}

//FUNCION OBTENER PRODUCTO POR ID (GET)
async function getById(req, res) {
  const codigo = parseInt(req.params.codigo);
  if (isNaN(codigo)) {
    return res.status(400).json({ error: 'Código inválido' });
  }

  try {
    await poolConnect; // Espera a que la conexión se establezca

    const request = pool.request();
    const result = await request
      .input('codigo', sql.Int, codigo)
      .query('SELECT * FROM ProductosGI WHERE codigo = @codigo');

    const producto = result.recordset[0];
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(producto);
  } catch (error) {
    console.error('Error al obtener producto:', error);
    res.status(500).json({ error: 'Error al obtener el producto' });
  }
}


//Funcion para editar un producto (PUT)
async function updateProduct(req, res) {
  const codigo = parseInt(req.params.codigo);
  if (isNaN(codigo)) {
    return res.status(400).json({ error: 'Código inválido' });
  }

  try {
    await poolConnect;

    const { nombre, precio, cantidad, categoria } = req.body;
    const request = pool.request();
    const result = await request
      .input('nombre', sql.VarChar, nombre)
      .input('precio', sql.Decimal(10, 2), precio)
      .input('cantidad', sql.Int, cantidad)
      .input('categoria', sql.VarChar, categoria)
      .query(`
        UPDATE ProductosGI
        SET nombre = @nombre, precio = @precio, cantidad = @cantidad, categoria = @categoria
        WHERE codigo = ${codigo}
      `);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json({ message: 'Producto actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
}

// Exporto las funciones para que puedan ser utilizadas en otros archivos
module.exports = { getAll, addProduct, getById, deleteById , deleteAll , updateProduct };

