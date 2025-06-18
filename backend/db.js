const sql = require('mssql');

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

sql.connect(config).then(() => {
  console.log('Conectado a SQL Server');
}).catch(err => {
  console.error('Error conectando a SQL Server:', err);
});