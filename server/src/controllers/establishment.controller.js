const {createSchema, deleteSchema, getAllSchema, getSchema, updateSchema} = require('../schema/establishment.schema');

module.exports = async function (app) {
  const establishmentsDB = await app.mongo.db.collection('establishments');
  const roomsDB = await app.mongo.db.collection('rooms');

  // List all establishments with number of rooms
  app.get(
    '/',
    {
      schema: getAllSchema,
    },
    async (request, reply) => {
      // Const establishments = await establishmentsDB.find().toArray();
      const establishmentWithSize = await establishmentsDB.aggregate([
        {
          $project: {
            name: 1,
            numberOfRooms: {$cond:
              [ // Use array syntax to remove XO (unicorn/no-thenable)
                {$isArray: '$roomsId'}, // If
                {$size: '$roomsId'}, // Then
                0, // Else
              ],
            },
          },
        },
      ]).toArray();
      if (establishmentWithSize.length <= 0) {
        return reply.status(404).send({message: 'No establishments found'});
      }

      await reply.status(200).send(establishmentWithSize);
    },
  );

  // Get one establishment with rooms details populated
  app.get(
    '/:id',
    {
      schema: getSchema,
    },
    async (request, reply) => {
      const {id} = request.params;
      const ObjectId = app.mongo.ObjectId;
      const establishmentWithRoomsDetails = await establishmentsDB.aggregate([
        // First get only one establishment specified
        {$match: {_id: new ObjectId(id)}},
        // Then get rooms details with lookup
        {$lookup:
          {
            from: 'rooms',
            localField: 'roomsId',
            foreignField: '_id',
            as: 'roomsDetails',
          },
        },
      ]).toArray();
      if (establishmentWithRoomsDetails.length <= 0) {
        return reply.status(404).send({message: 'Establishment not found'});
      }

      await reply.status(200).send(establishmentWithRoomsDetails[0]);
    },
  );

  // Deleteing an establishment
  app.delete(
    '/:id',
    {
      schema: deleteSchema,
    },
    async (request, reply) => {
      const {id} = request.params;
      const ObjectId = app.mongo.ObjectId;
      // First delete all rooms
      const establishment = await establishmentsDB.findOne({_id: new ObjectId(id)});

      if (establishment.roomsId) {
        await roomsDB.deleteMany({_id: {$in: establishment.roomsId}});
      }

      // Then delete establishment
      const result = await establishmentsDB.deleteOne({_id: new ObjectId(id)});
      await reply.status(201).send(result);
    },
  );

  // Create a new establishment
  app.post(
    '/',
    {
      schema: createSchema,
    },
    async (request, reply) => {
      const establishment = await establishmentsDB.findOne({name: request.body.name});
      if (establishment) {
        await reply.status(500).send({message: 'Establisment name already exist !!!'});
      } else {
        const result = await establishmentsDB.insertOne(request.body);
        await reply.status(201).send(result);
      }
    },
  );

  // Update an existing establishment
  app.put(
    '/:id',
    {
      schema: updateSchema,
    },
    async (request, reply) => {
      const {id} = request.params;
      const ObjectId = app.mongo.ObjectId;
      const establishment = await establishmentsDB.replaceOne(
        {_id: new ObjectId(id)},
        request.body,
      );
      await reply.status(200).send(establishment);
    },
  );
};
