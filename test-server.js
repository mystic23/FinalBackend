// test-server.js
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hola desde Node\n');
});

const PORT = 5050;

server.listen(PORT, () => {
  console.log('Servidor de prueba en puerto', PORT);
});
