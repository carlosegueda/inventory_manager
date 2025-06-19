//importo express que permite crear rutas para el node.js
const express = require('express');

//creo la instancia del enrutador propio de express, es como un mini servidor
const router = express.Router();

//Importo las funciones(controllers) { obtenerProductos, agregarProducto, eliminarProductos } que estan en el archivo de los controllers
const { obtenerProductos, agregarProducto, eliminarProductos } = require('../controllers/productosController');

//defino el metodo GET, y asigno obtenerProductos cuando se haga la peticion
router.get('/', obtenerProductos);

//defino el metodo POST, y asigno agregarProducto cuando se haga la peticion
router.post('/', agregarProducto);  

//defino el metodo DELETE, y asigno eliminarProductos cuando se haga la peticion
router.delete('/', eliminarProductos)

//exporto el enrutador para usarlo en otros archivos
module.exports = router;


    