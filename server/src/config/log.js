const options = {
  logger: {
    level: 'debug',
    transport: {
      target: 'pino-pretty',
      options: {
        ignore: 'pid,hostname',
      },
    },
  },
};

module.exports = options;
