const {createSchema, deleteSchema, getAllSchema, getSchema, updateSchema} = require('../schema/patient.schema');

module.exports = async function (app) {
  const patientsDB = await app.mongo.db.collection('patients');
  const roomsDB = await app.mongo.db.collection('rooms');

  // List all patients
  app.get(
    '/',
    {
      schema: getAllSchema,
    },
    async (request, reply) => {
      const patientsWithDetails = await patientsDB.aggregate([
        {$lookup:
          {
            from: 'rooms',
            localField: 'roomId',
            foreignField: '_id',
            as: 'roomDetails',
          },
        },
        {$addFields:
          {
            roomName: {$arrayElemAt: ['$roomDetails.name', 0]},
          },
        },
      ]).toArray();
      if (patientsWithDetails.length <= 0) {
        return reply.status(404).send({message: 'No patients found'});
      }

      // Const patients = await patientsDB.find().toArray();
      await reply.status(200).send(patientsWithDetails);
    },
  );

  // Get one patient
  app.get(
    '/:id',
    {
      schema: getSchema,
    },
    async (request, reply) => {
      const {id} = request.params;
      const ObjectId = app.mongo.ObjectId;
      const patient = await patientsDB.findOne({_id: new ObjectId(id)});
      if (!patient) {
        return reply.status(404).send({message: 'Patient not found'});
      }

      await reply.status(200).send(patient);
    },
  );

  // Deleteing a patient
  app.delete(
    '/:id',
    {
      schema: deleteSchema,
    },
    async (request, reply) => {
      const {id} = request.params;
      const {roomId} = request.body;
      const ObjectId = app.mongo.ObjectId;
      const result = await patientsDB.deleteOne({_id: new ObjectId(id)});
      // Delete patient to correponding room
      await roomsDB.updateOne(
        {_id: new ObjectId(roomId)},
        {$unset: {patientId: null}},
      );
      await reply.status(201).send(result);
    },
  );

  // Create a new patient
  app.post(
    '/',
    {
      schema: createSchema,
    },
    async (request, reply) => {
      const {firstname, lastname, roomId} = request.body;
      const ObjectId = app.mongo.ObjectId;
      const patient = await patientsDB.findOne({firstname, lastname, roomId: new ObjectId(roomId)});
      if (patient) {
        await reply.status(500).send({message: 'Patient name already exist !!!'});
      } else {
        const result = await patientsDB.insertOne({...request.body, roomId: new ObjectId(roomId)});
        // Add patient to correponding room
        await roomsDB.updateOne(
          {_id: new ObjectId(roomId)},
          {$set: {patientId: new ObjectId(result.insertedId)}},
        );
        await reply.status(201).send(result);
      }
    },
  );

  // Update an existing patient
  app.put(
    '/:id',
    {
      schema: updateSchema,
    },
    async (request, reply) => {
      const {id} = request.params;
      const {roomId} = request.body;
      const ObjectId = app.mongo.ObjectId;
      const oldPatient = await patientsDB.findOne({_id: new ObjectId(id)});
      const newPatient = await patientsDB.replaceOne(
        {_id: new ObjectId(id)},
        {...request.body, roomId: new ObjectId(roomId)},
      );
      // Modify patient room
      if (roomId !== oldPatient.roomId) {
      // Delete patient to correponding room
        await roomsDB.updateOne({_id: new ObjectId(oldPatient.roomId)}, {$unset: {patientId: null}});
        // Add patient to correponding room
        await roomsDB.updateOne({_id: new ObjectId(roomId)}, {$set: {patientId: new ObjectId(id)}});
      }

      await reply.status(200).send(newPatient);
    },
  );
};
