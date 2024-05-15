/*
* Schemas used for Validation and Validation and Serialization of our routes/endpoints
*
* These are used to:
*  - Validate incoming requests (URL params, body, headers, query string)
*  - Automatically serialize the response objects
*  - Also, Swagger uses these schemas to generate the documentation!
*
* See More: https://www.fastify.io/docs/latest/Reference/Validation-and-Serialization/
*/

// GET '/'
const getAllSchema = {
  tags: ['room'],
  description: 'List all rooms.',
  response: {
    200: {type: 'array', items: {$ref: 'roomSchema#'}},
    404: {$ref: 'messageResponseSchema#'},
    500: {$ref: 'messageResponseSchema#'},
  },
};

// GET '/:id'
const getSchema = {
  params: {$ref: 'parameterIdSchema'},
  tags: ['room'],
  description: 'Get a single room)',
  response: {
    200: {$ref: 'roomSchema#'},
    404: {$ref: 'messageResponseSchema#'},
    500: {$ref: 'messageResponseSchema#'},
  },
};

// DELETE '/:id'
const deleteSchema = {
  params: {$ref: 'parameterIdSchema'},
  tags: ['room'],
  description: 'Removes an specific room from the collection',
  response: {
    201: {$ref: 'mongoReturnSchema#'},
    404: {$ref: 'messageResponseSchema#'},
    500: {$ref: 'messageResponseSchema#'},
  },
};

// POST '/'
const createSchema = {
  tags: ['room'],
  description: 'Creates a new room',
  body: {
    type: 'object',
    required: ['name', 'establishmentId'],
    properties: {
      name: {type: 'string'},
      establishmentId: {type: 'string'},
    },
  },
  response: {
    201: {$ref: 'mongoReturnSchema#'},
    404: {$ref: 'messageResponseSchema#'},
    500: {$ref: 'messageResponseSchema#'},
  },
};

// PUT: '/:id'
const updateSchema = {
  tags: ['room'],
  description: 'Updates a room',
  params: {$ref: 'parameterIdSchema#'},
  body: {
    type: 'object',
    required: ['name', 'establishmentId'],
    properties: {
      name: {type: 'string'},
      establishmentId: {type: 'string'},
    },
  },
  response: {
    200: {$ref: 'mongoReturnSchema#'},
    404: {$ref: 'messageResponseSchema#'},
    500: {$ref: 'messageResponseSchema#'},
  },
};

module.exports = {
  getAllSchema,
  getSchema,
  deleteSchema,
  createSchema,
  updateSchema,
};
