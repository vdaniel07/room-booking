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
  tags: ['patient'],
  description: 'List all patients.',
  response: {
    200: {type: 'array', items: {$ref: 'patientSchema#'}},
    404: {$ref: 'messageResponseSchema#'},
    500: {$ref: 'messageResponseSchema#'},
  },
};

// GET '/:id'
const getSchema = {
  params: {$ref: 'parameterIdSchema'},
  tags: ['patient'],
  description: 'Get a single patient)',
  response: {
    200: {$ref: 'patientSchema#'},
    404: {$ref: 'messageResponseSchema#'},
    500: {$ref: 'messageResponseSchema#'},
  },
};

// DELETE '/:id'
const deleteSchema = {
  params: {$ref: 'parameterIdSchema'},
  tags: ['patient'],
  description: 'Removes an specific patient from the collection',
  response: {
    201: {$ref: 'mongoReturnSchema#'},
    404: {$ref: 'messageResponseSchema#'},
    500: {$ref: 'messageResponseSchema#'},
  },
};

// POST '/'
const createSchema = {
  tags: ['patient'],
  description: 'Creates a new patient',
  body: {
    type: 'object',
    required: ['firstname', 'roomId'],
    properties: {
      firstname: {type: 'string'},
      roomId: {type: 'string'},
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
  tags: ['patient'],
  description: 'Updates a patient',
  params: {$ref: 'parameterIdSchema#'},
  body: {
    type: 'object',
    required: ['firstname', 'roomId'],
    properties: {
      firstname: {type: 'string'},
      roomId: {type: 'string'},
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
