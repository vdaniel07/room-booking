const swaggerConfig = {
  swagger: {
    info: {
      title: 'Room booking',
      description: 'Room booking for patients',
      version: '0.0.1',
    },
    externalDocs: {
      url: 'https://swagger.io',
      description: 'Find more info here',
    },
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
      {name: 'establishment', description: 'Establishment related end-points'},
      {name: 'room', description: 'Room related end-points'},
      {name: 'patient', description: 'Patient related end-points'},
    ],
  },
};

module.exports = swaggerConfig;
