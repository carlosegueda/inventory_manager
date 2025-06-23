//importo express que permite crear rutas para el node.js
const express = require('express');

//creo la instancia del enrutador propio de express, es como un mini servidor
const router = express.Router();

//Importo las funciones(controllers) { obtenerProductos, agregarProducto, eliminarProductos } que estan en el archivo de los controllers
const { addProduct, getAll, getById, deleteAll, deleteById , updateProduct} = require('../controllers/productosController');

//defino el metodo POST, y asigno agregarProducto cuando se haga la peticion
router.post('/', addProduct);

//defino el metodo GET, y asigno obtenerProductos cuando se haga la peticion
router.get('/', getAll);

//defino el metodo GET con un parametro codigo, y asigno obtenerProductos cuando se haga la peticion
router.get('/:codigo', getById);

//defino el metodo DELETE, y asigno eliminarProductos cuando se haga la peticion
router.delete('/', deleteAll);

//defino el metodo DELETE con un parametro codigo, y asigno eliminarProductos cuando se haga la peticion
router.delete('/:codigo', deleteById);

//defino el metodo PUT con un parametro codigo, y asigno actualizarProducto cuando se haga la peticion
router.put('/:codigo', updateProduct);

//exporto el enrutador para usarlo en otros archivos
module.exports = router;


    