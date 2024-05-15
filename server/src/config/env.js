const process = require('node:process');

const schema = {
  type: 'object',
  required: ['PORT', 'ENABLE_SWAGGER'],
  properties: {
    PORT: {
      type: 'number',
      default: 3000,
    },
    HOST: {
      type: 'string',
      default: '127.0.0.1',
    },
    DATABASE_URL: {
      type: 'string',
    },
    ENABLE_SWAGGER: {
      type: 'boolean',
      default: true,
    },
  },
};

const options = {
  confKey: 'config',
  schema,
  dotenv: true,
  data: process.env,
};

module.exports = options;

