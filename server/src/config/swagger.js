export const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AI Student Management System API',
      version: '1.0.0',
      description: 'Complete REST API for the AI-Powered Student Management System',
    },
    servers: [
      { url: 'http://localhost:5000/api', description: 'Development server' },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'accessToken',
        },
      },
    },
    security: [{ cookieAuth: [] }],
  },
  apis: ['./src/routes/*.js', './src/models/*.js'],
};
