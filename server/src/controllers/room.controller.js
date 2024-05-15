const {createSchema, deleteSchema, getAllSchema, getSchema, updateSchema} = require('../schema/room.schema');

module.exports = async function (app) {
  const roomsDB = await app.mongo.db.collection('rooms');
  const establishmentsDB = await app.mongo.db.collection('establishments');
  const patientsDB = await app.mongo.db.collection('patients');

  // List all rooms
  app.get(
    '/',
    {
      schema: getAllSchema,
    },
    async (request, reply) => {
      const roomsWithDetails = await roomsDB.aggregate([
        {$lookup:
          {
            from: 'establishments',
            localField: 'establishmentId',
            foreignField: '_id',
            as: 'establishmentDetails',
          },
        },
        {$lookup:
          {
            from: 'patients',
            localField: 'patientId',
            foreignField: '_id',
            as: 'patientDetails',
          },
        },
        {$addFields:
          {
            establishmentName: {$arrayElemAt: ['$establishmentDetails.name', 0]},
            patientName: {$concat: [{$arrayElemAt: ['$patientDetails.firstname', 0]}, ' ', {$arrayElemAt: ['$patientDetails.lastname', 0]}]},
          },
        },
      ]).toArray();
      if (roomsWithDetails.length <= 0) {
        return reply.status(404).send({message: 'No rooms found'});
      }

      // App.log.debug(roomsWithDetails, 'roomsWithDetails: ');
      // Const rooms = await roomsDB.find().toArray();
      await reply.status(200).send(roomsWithDetails);
    },
  );

  // Get one room
  app.get(
    '/:id',
    {
      schema: getSchema,
    },
    async (request, reply) => {
      const {id} = request.params;
      const ObjectId = app.mongo.ObjectId;
      const room = await roomsDB.findOne({_id: new ObjectId(id)});
      if (!room) {
        return reply.status(404).send({message: 'Room not found'});
      }

      await reply.status(200).send(room);
    },
  );

  // Deleteing a room
  app.delete(
    '/:id',
    {
      schema: deleteSchema,
    },
    async (request, reply) => {
      const {id} = request.params;
      const {establishmentId, patientId} = request.body;
      const ObjectId = app.mongo.ObjectId;
      const result = await roomsDB.deleteOne({_id: new ObjectId(id)});
      // Delete room to correponding establishment
      await establishmentsDB.updateOne(
        {_id: new ObjectId(establishmentId)},
        {$pull: {roomsId: new ObjectId(id)}},
      );
      // Delete roomId in the patient corresponding document
      await patientsDB.updateOne(
        {_id: new ObjectId(patientId)},
        {$unset: {roomId: null}},
      );
      await reply.status(201).send(result);
    },
  );

  // Create a new room
  app.post(
    '/',
    {
      schema: createSchema,
    },
    async (request, reply) => {
      const {name, establishmentId} = request.body;
      const ObjectId = app.mongo.ObjectId;
      const room = await roomsDB.findOne({name, establishmentId: new ObjectId(establishmentId)});
      if (room) {
        await reply.status(500).send({message: 'Room name already exist !!!'});
      } else {
        const result = await roomsDB.insertOne({...request.body, establishmentId: new ObjectId(establishmentId)});
        // Add room to correponding establishment
        await establishmentsDB.updateOne(
          {_id: new ObjectId(establishmentId)},
          {$push: {roomsId: new ObjectId(result.insertedId)}},
        );
        await reply.status(201).send(result);
      }
    },
  );

  // Update an existing room
  app.put(
    '/:id',
    {
      schema: updateSchema,
    },
    async (request, reply) => {
      const {id} = request.params;
      const {establishmentId} = request.body;
      const ObjectId = app.mongo.ObjectId;
      const room = await roomsDB.replaceOne(
        {_id: new ObjectId(id)},
        {...request.body, establishmentId: new ObjectId(establishmentId)},
      );
      await reply.status(200).send(room);
    },
  );
};
