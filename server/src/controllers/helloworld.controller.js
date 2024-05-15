const helloWorldService = require('../services/helloworld.service');

module.exports = async function (app) {
  app.get(
    '/helloworld',
    {
      schema: {
        response: {
          200: {
            type: 'object',
            properties: {
              hello: {type: 'string'},
            },
            required: ['hello'],
          },
        },
      },
    },
    async (request, reply) => {
      await reply.status(200).send({hello: helloWorldService.helloWorld()});
    },
  );
};
