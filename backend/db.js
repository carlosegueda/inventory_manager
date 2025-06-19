//importo la conexion SQL que depende de la libreria !mssql!
const sql = require('mssql');

//creo la configuracion para acceder a SQL con las propiedades necesarias
const config = {
  user: 'carlos.osegueda',
  password: 'CO20212030669',
  server: '3.128.144.165',
  database: 'DB20212030669',
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

//creo el pool de conexion que permite conexiones multiples y eficientes, con el atribuyto de la configuracion antes creada
const pool = new sql.ConnectionPool(config);

//hago la conexion al pool, si funciona se conecta, si no da error
const poolConnect = pool.connect().then(() => {
  console.log('Conectado a SQL Server');
}).catch(err => {
  console.error('Error conectando a SQL Server:', err);
});

//exporto los objetos que necesito en otros archivos (sql =  | pool=  | poolConect= )
module.exports = { sql, pool, poolConnect };
