//importo express que permite crear rutas para el node.js
const express = require('express');
//importo cors para permitir conexiones con el front
const cors = require('cors');
//importo el archivo de las rutas
const productosRoutes = require('./routes/productos');

//creo la instancia del server (app) de express y define el puerto donde va escuchar (3000)
const app = express();
const port = 3000;

//Permite solicitudes a otros dominios
app.use(cors());

//permite que el servidor pueda recibir JSON en las peticiones POST y PUT
app.use(express.json());

//le dice a express que todas las rutas que terminen en /productos seran manejadas por las rutas.js
app.use('/productos', productosRoutes);

//inicia el server y muestra el mensaje de escuchando
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
