/*
* Some global schemas, representing our stuff from the Database.
* These will be used mostly when serializing data in our responses.
*
* See More: https://www.fastify.io/docs/latest/Reference/Validation-and-Serialization/
*/

const establishmentSchema = {
  $id: 'establishmentSchema',
  type: 'object',
  Required: ['name'],
  nullable: true,
  properties: {
    _id: {type: 'string'},
    name: {type: 'string'},
    numberOfRooms: {type: 'number'},
    roomsId: {type: 'array', items: {type: 'string', format: 'objectid'}},
    roomsDetails: {type: 'array', items: {$ref: 'roomSchema#'}},
  },
};

const roomSchema = {
  $id: 'roomSchema',
  type: 'object',
  Required: ['name', 'establishmentId'],
  properties: {
    _id: {type: 'string'},
    name: {type: 'string'},
    establishmentId: {type: 'string', format: 'objectid'},
    establishmentName: {type: 'string'},
    patientId: {type: 'string', format: 'objectid'},
    patientName: {type: 'string'},
  },
};

const patientSchema = {
  $id: 'patientSchema',
  type: 'object',
  Required: ['firstname', 'lastname', 'birthdate', 'email'],
  properties: {
    _id: {type: 'string'},
    firstname: {type: 'string'},
    lastname: {type: 'string'},
    birthdate: {type: 'string'},
    email: {type: 'string', format: 'email'},
    roomId: {type: 'string', format: 'objectid'},
    roomName: {type: 'string'},
  },
};

module.exports = {
  establishmentSchema,
  roomSchema,
  patientSchema,
};
