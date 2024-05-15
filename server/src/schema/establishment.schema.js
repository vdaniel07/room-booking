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
  tags: ['establishment'],
  description: 'List all establishments.',
  response: {
    200: {type: 'array', items: {$ref: 'establishmentSchema#'}},
    404: {$ref: 'messageResponseSchema#'},
    500: {$ref: 'messageResponseSchema#'},
  },
};

// GET '/:id'
const getSchema = {
  params: {$ref: 'parameterIdSchema'},
  tags: ['establishment'],
  description: 'Get a single establishment)',
  response: {
    200: {$ref: 'establishmentSchema#'},
    404: {$ref: 'messageResponseSchema#'},
    500: {$ref: 'messageResponseSchema#'},
  },
};

// DELETE '/:id'
const deleteSchema = {
  params: {$ref: 'parameterIdSchema'},
  tags: ['establishment'],
  description: 'Removes an specific establishment from the collection',
  response: {
    201: {$ref: 'mongoReturnSchema#'},
    404: {$ref: 'messageResponseSchema#'},
    500: {$ref: 'messageResponseSchema#'},
  },
};

// POST '/'
const createSchema = {
  tags: ['establishment'],
  description: 'Creates a new establishment',
  body: {
    type: 'object',
    required: ['name'],
    properties: {
      name: {type: 'string'},
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
  tags: ['establishment'],
  description: 'Updates an establishment',
  params: {$ref: 'parameterIdSchema#'},
  body: {
    type: 'object',
    required: ['name'],
    properties: {
      name: {type: 'string'},
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
