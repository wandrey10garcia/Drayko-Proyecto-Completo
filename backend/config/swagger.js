const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Drayko',
      version: '1.0.0',
      description: 'API REST para la gestion de usuarios y stickers NFC de Drayko',
      contact: {
        name: 'Wilson Andrey Piragua Garcia',
        email: 'admin@drayko.app'
      }
    },
    servers: [
      {
        url: 'http://192.168.1.77:3000',
        description: 'Servidor local'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer', description: 'ID auto-generado' },
            email: { type: 'string', format: 'email', description: 'Email del usuario' },
            name: { type: 'string', description: 'Nombre del usuario' },
            lastname: { type: 'string', description: 'Apellido del usuario' },
            role: { type: 'string', enum: ['admin', 'user'], description: 'Rol del usuario' }
          },
          example: {
            email: 'alex@drayko.app',
            name: 'Alex',
            lastname: 'Rivera',
            role: 'user'
          }
        },
        Login: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string' }
          },
          example: {
            email: 'alex@drayko.app',
            password: 'Admin1234'
          }
        },
        Sticker: {
          type: 'object',
          properties: {
            id: { type: 'integer', description: 'ID auto-generado' },
            user_id: { type: 'integer', description: 'ID del propietario del sticker' },
            name: { type: 'string', description: 'Nombre visible del sticker' },
            content_type: { type: 'string', enum: ['text', 'url', 'contact', 'wifi'], description: 'Tipo de contenido (RF-09/RF-12)' },
            content: { type: 'string', description: 'Dato grabado en el sticker' },
            category: { type: 'string', enum: ['hogar', 'personal', 'negocio', 'evento'] },
            nfc_uid: { type: 'string', description: 'UID fisico del tag NFC una vez escrito (RF-15)' },
            status: { type: 'string', enum: ['active', 'inactive'] }
          },
          example: {
            name: 'Wi-Fi de casa',
            content_type: 'wifi',
            content: '{"ssid":"Drayko_Home_5G","password":"super-secreta-123"}',
            category: 'hogar'
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' }
          }
        }
      }
    }
  },
  apis: ['./routes/*.js'] // Ruta de los archivos de rutas con anotaciones JSDoc
};

module.exports = swaggerJsdoc(options);
