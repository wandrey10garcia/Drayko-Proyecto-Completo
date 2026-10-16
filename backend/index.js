const http = require('http');
const app = require('./server');
const cors = require('cors');
const port = process.env.PORT || 3000;
const host = process.env.HOST || '192.168.1.77';

// Configuracion CORS
app.use(cors({
  origin: [
    `http://${host}`,
    'http://localhost',
    'http://127.0.0.1'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Manejar preflight CORS
app.options('*', cors());
app.set('port', port);

const server = http.createServer(app);

server.listen(port, host, () => {
  console.log(`Servidor de Drayko corriendo en http://${host}:${port}`);
  console.log(`Documentacion Swagger en http://${host}:${port}/api-docs`);
});
