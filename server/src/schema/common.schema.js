/*
* Simple global schemas that are going to be used across all of our app.
*
* See More: https://www.fastify.io/docs/latest/Reference/Validation-and-Serialization/
*/

// Just a single response object including a message
const messageSchema = {
  $id: 'messageResponseSchema',
  type: 'object',
  properties: {
    message: {type: 'string'},
  },
};

// Used to validate/match URLS that include an ':id' param
const parameterIdSchema = {
  $id: 'parameterIdSchema',
  type: 'object',
  properties: {
    id: {type: 'string', pattern: '^[0-9a-fA-F]{24}$'},
  },
  required: ['id'],
};

// Mongo return for insertOne
const mongoReturnSchema = {
  $id: 'mongoReturnSchema',
  type: 'object',
  properties: {
    acknowledged: {type: 'boolean'},
    insertedId: {type: 'string', pattern: '^[0-9a-fA-F]{24}$'},
    deletedCount: {type: 'number'},
  },
  required: ['acknowledged'],
};

module.exports = {
  messageSchema,
  parameterIdSchema,
  mongoReturnSchema,
};
