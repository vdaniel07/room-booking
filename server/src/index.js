const process = require('node:process');
const fastify = require('fastify');
const fastifyEnv = require('@fastify/env');
const fastifyMongo = require('@fastify/mongodb');
const cors = require('@fastify/cors');
const fastifySwagger = require('@fastify/swagger');
const fastifySwaggerUi = require('@fastify/swagger-ui');
const envOpts = require('./config/env.js');
const logOpts = require('./config/log.js');
const swaggerOpts = require('./config/swagger.js');
const helloworldRoutes = require('./controllers/helloworld.controller.js');
const establishmentRoutes = require('./controllers/establishment.controller.js');
const roomRoutes = require('./controllers/room.controller.js');
const patientRoutes = require('./controllers/patient.controller.js');
const {messageSchema, parameterIdSchema, mongoReturnSchema} = require('./schema/common.schema');
const {establishmentSchema, roomSchema, patientSchema} = require('./schema/models.schema');

const start = async () => {
  const app = fastify({...logOpts});

  // Now we setup our app, plugins and such
  await app.register(fastifyEnv, envOpts);
  await app.register(fastifyMongo, {
    forceClose: true,
    url: app.config.DATABASE_URL,
    database: 'hoppen',
  });
  await app.register(cors, {
    // Options
  });

  // Test database
  const collections = await app.mongo.db.listCollections().toArray();
  app.log.debug(collections.map(data => data.name), 'collections availables: ');

  // Json Schemas
  app.addSchema(parameterIdSchema);
  app.addSchema(mongoReturnSchema);
  app.addSchema(messageSchema);
  app.addSchema(establishmentSchema);
  app.addSchema(roomSchema);
  app.addSchema(patientSchema);

  // Swagger Docs
  if (app.config.ENABLE_SWAGGER) {
    await app.register(fastifySwagger, swaggerOpts);
    await app.register(fastifySwaggerUi, {
      routePrefix: '/docs',
    });
  }

  // API Endpoint routes
  app.register(helloworldRoutes);
  app.register(establishmentRoutes, {prefix: '/establishment'});
  app.register(roomRoutes, {prefix: '/room'});
  app.register(patientRoutes, {prefix: '/patient'});

  try {
    await app.listen({port: app.config.PORT});
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};

start();

