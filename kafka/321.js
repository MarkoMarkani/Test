const express = require('express');
var kafka = require('kafka-node');
var rp = require('request-promise');
let config = require(`../config/config`);
const serverIp = config.serverIp;
const awsIp = config.awsIp;
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
var Producer = kafka.Producer,
  client = new kafka.KafkaClient({
    // kafkaHost: "217.172.12.192:9092"
    kafkaHost: `${awsIp}:9092`,
  }),
  producer = new Producer(client);

var Consumer = kafka.Consumer,
  consumer = new Consumer(
    client,
    [
      {
        topic: 'TOP321_FACE_RECO_EVENT',
        offset: 0,
      },
    ],
    [
      {
        autoCommit: false,
      },
      (kafkaOptions = {
        fromOffset: 'latest',
      }),
    ]
  );
     
producer.on('error', function (err) {
  console.log(`Producer is in error state, error is ${err}`);
});

consumer.on('message', function (message) {
  let id;
  let modifiedString;
  let stringMessage;
  let modifiedObject;
  let deviceId;
  // console.log("THIS IS LOGGED MESSAGE "+JSON.stringify(message));
  // console.log("TYPE IS " + typeof message);

  stringMessage = message.value;
  //  console.log("STRING MESSAGE IN ONMESSAGE" + stringMessage); //  We will comment this for now
  modifiedString = stringMessage
    .replace(/\\/g, '')
    .replace('"{"boxes', '{"boxes')
    .replace('"}"', '"') //we have changed this
    .replace('"body":{', '')
    .replace('detected"}', 'detected"')
    .replace('"attachment":[{', '')
    .replace('}]', '')
    .replace('"results":{', '')
    .replace('scores": [', 'scores": ')
    .replace('], "class', ', "class')
    .replace('class_names": [', 'class_names":  ')
    .replace('], "classes_id', ' , "classes_id');

  //  .replace("ref_id\": [","ref_id\": ")
  //  .replace("],\"description",", \"description");

  //const modifiedObject = JSON.parse(modifiedString);
  //console.log("MODIFIED STRING MESSAGE " + modifiedString);
  // console.log("Type is " + typeof modifiedString);
  modifiedObject = JSON.parse(modifiedString);
  modifiedObject.TimeInstant = new Date();
  deviceId = modifiedObject.deviceId;
  console.log(`Entity stored in Orion is ${JSON.stringify(modifiedObject)}`); //We will comment this for now
  const options1 = {
    method: 'GET',
    headers: {
      'Access-Control-Allow-Origin': '*',
      // 'Fiware-Service': 'a4blue',
      // 'Fiware-ServicePath': '/a4blueevents'
    },
    uri: `http://${serverIp}:1026/v2/entities/urn:ngsi-ld:IP_Camera:${deviceId}?type=IP_Camera&options=keyValues`, //modify
    // uri: "https://webhook.site/448a7385-762f-448c-884e-8410b12b8725",
    resolveWithFullResponse: true,
  };

  const options2 = {
    method: 'POST', 
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
      'Fiware-Service': 'a4blue',
      'Fiware-ServicePath': '/a4blueevents',
    },
    uri: `http://${serverIp}:1026/v2/entities?options=keyValues`, //modify
    // uri: "https://webhook.site/730596d0-ed07-4f32-b20c-084592ac120c",
    resolveWithFullResponse: true,
    json: true,
    body: modifiedObject,
  };

  //}
  //console.log(`MESSAGE RESULTS ${ JSON.stringify(modifiedObject.scores)}`)
  if (modifiedObject.count === undefined) {
    rp(options1)
      .then((res) => {
        //console.log(res.body);
        bodyObject = JSON.parse(res.body);
        modifiedObject.id = 'urn:ngsi-ld:TOP321_FACE_RECO_EVENT:' + uuidv4();
        modifiedObject.type = 'TOP321_FACE_RECO_EVENT';    
        modifiedObject.camLatitude = bodyObject.camLatitude;
        modifiedObject.camLongitude = bodyObject.camLongitude;
        return rp(options2);
      })
      .then((res) => {
        console.log(
          `Entity has been stored successfully after receiving mesage from Kafka and modifying it, status code is ${res.statusCode}`
        );
      })
      .catch((err) => {
        console.log(`On Message first : Error is ${err}`);
      });
  } else {
    console.log('Object has already been stored in Orion');
    modifiedObject.id = modifiedObject.id + modifiedObject.ruleName + 'count' + modifiedObject.count;
    modifiedObject.type = modifiedObject.type + '_RULES';
    console.log(
      `ELSE Entity stored in Orion is ${JSON.stringify(modifiedObject)}`
    );

    rp(options1)
      .then((res) => {
        //console.log(res.body);
        bodyObject = JSON.parse(res.body);
        modifiedObject.camLatitude = bodyObject.camLatitude;
        modifiedObject.camLongitude = bodyObject.camLongitude;
        return rp(options2);
      })
      .then((res) => {
        console.log(
          `Entity has been stored successfully after processing by CEP, status code is ${res.statusCode}`
        );
      })
      .catch((err) => {
        console.log(`On Message second : Error is ${err}`);
      });
  }
});

consumer.on('error', function (err) {
  console.log('Error:', err);
});

consumer.on('offsetOutOfRange', function (err) {
  // console.log('offsetOutOfRange:', err); will come back
});

//WE don't need this for now, but we will need it sometime when we create a new topic

// var topicsToCreate = [{
//     topic: 'TOP321_FACE_RECO_EVENT',
//     partitions: 1,
//     replicationFactor: 1
// }];

// client.createTopics(topicsToCreate, (error, result) => {
//     if (error) {
//         console.log(error);
//     }
//     console.log(result);
//     // result is an array of any errors if a given topic could not be created
// });

function kafka321Test() {
  console.log('Sending 321 test..');
  const message = {
    // "id": "urn:ngsi-ld:TOP321_FACE_RECO_EVENT:007",
    // "type": "TOP321_FACE_RECO_EVENT",
    header: {
      topicName: 'TOP321_FACE_RECO_EVENT',
      topicVer1: 1,
      topicVer2: 0,
      msgId: 'dummy_id_00001',
      sender: 'FR',
      sentUtc: '2020-04-30 13:55:45.028748',
      status: 'Test',
      msgType: 'Update',
      source: 'VMS',
      scope: 'Restricted',
      caseId: '44092dec-ebbb-44b5-b42b-6872f28c590d',
    },
    body: {
      attachment: [ 
        {
          mimeType: 'video/mp4',
          attachDesc: 'New face detection results',
          objectStoreId: '5eaad8e0a73040a68e7bb894',
          results:
            '{"boxes": [[0.3163111209869385, 0.3704342544078827, 0.4800548553466797, 0.4447254240512848]], "scores": [0.907463390827179], "class_names": ["Falcao"], "classes_id": [8], "timestamp_processing": "2020-04-30 13:55:44.237511", "ref_id": ["5e9af1237823974d0f3f0bee"], "suspect_description": ["The suspect has been charged with multiple crimes"], "processed_id": "5eaad8e0a73040a68e7bb881", "frame_number": "", "deviceId": "cam-1"}',
        },       
      ],  
      description: 'A face was detected',
    },
  };
   
  const stringMessage = JSON.stringify(message);
  //console.log(stringMessage);
  const modifiedString = stringMessage
    .replace(/\\/g, '')
    .replace('"{"boxes', '{"boxes')
    .replace('"}"', '"') //we have changed this
    .replace('"body":{', '')
    .replace('detected"}', 'detected"')
    .replace('"attachment":[{', '')
    .replace('}]', '')
    .replace('"results":{', '')
    .replace('scores": [', 'scores": ')
    .replace('], "class', ', "class')
    .replace('class_names": [', 'class_names":  ')
    .replace('], "classes_id', ' , "classes_id');
  //  .replace("ref_id\": [","ref_id\": ")
  //  .replace("],\"description",", \"description");

  const modifiedObject = JSON.parse(modifiedString);
  //console.log("STRING MESSAGE   " + modifiedString);

  payloads = [ 
    {
      topic: 'TOP321_FACE_RECO_EVENT', //BILO JE 401
      messages: stringMessage,
      partition: 0,
      timestamp: Date.now(),
    },
  ];
  producer.send(payloads, function (err, data) {
    if (err) {
      console.log(err);
    }
    console.log('Kafka 321 Test data ' + JSON.stringify(data));
  });

  //options we are not currently using
  // const options = {
  //     method: "POST",
  //     headers: {
  //         "Access-Control-Allow-Origin": "*",
  //         "Content-Type": "application/json"
  //     },
  //     //uri: "http://localhost:1026/v2/entities?options=keyValues", //this is a valid one  //modify
  //     uri: "https://webhook.site/730596d0-ed07-4f32-b20c-084592ac120c",
  //     resolveWithFullResponse: true,
  //     json: true,
  //     body: modifiedObject
  // };

  //}
  //console.log(`MESSAGE RESULTS ${ JSON.stringify(modifiedObject.scores)}`);
  // rp(options)
  //     .then(res => console.log("Successfully stored " + JSON.stringify(res)))
  //     .catch(err => console.log("Error occured" + err));
}

router.post('/perseoRule1', async (req, res) => {
  let id = req.body.id;
  let count;
  let modifiedKafkaMessage;

  const optionsGetAll321Entities = {
    method: 'GET',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Fiware-Service': 'a4blue',
      'Fiware-ServicePath': '/a4blueevents',
    },
    uri: `http://${serverIp}:1026/v2/entities?type=TOP321_FACE_RECO_EVENT&options=keyValues&limit=1000`, //modify

    resolveWithFullResponse: true,
  };

  const optionsFiwareGetById = {
    method: 'GET',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Fiware-Service': 'a4blue',
      'Fiware-ServicePath': '/a4blueevents',
    },
    uri: `http://${serverIp}:1026/v2/entities/${id}?options=keyValues`, //modify
    // uri: "https://webhook.site/730596d0-ed07-4f32-b20c-084592ac120c",
    resolveWithFullResponse: true,
  };
  try {
   //console.log(req.body); 
    console.log('Perseo rule #1 has been executed');
    let fiwareResponse2 = await rp(optionsFiwareGetById);
    const {
      id,
      type,
      TimeInstant,
      attachDesc,
      class_names,
      classes_id,
      description,
      deviceId,
      timestamp_processing,
      scores,
      suspect_description,
    } = JSON.parse(fiwareResponse2.body);
    let fiwareResponseBody = {
      id,
      type,
      TimeInstant,
      attachDesc,
      class_names,
      classes_id,
      description,
      deviceId,
      timestamp_processing,
      scores,
      suspect_description,
    };
    fiwareResponseBody.count = req.body.count;
    fiwareResponseBody.ruleName = 'rule1';
    count = fiwareResponseBody.count;

    switch (count) {
      case '2':
        fiwareResponseBody.description = `Rule#1 Alert! Face has been recognized with possibility of 80%, last seen on ${fiwareResponseBody.deviceId}`;
        break;
      case '3':
        fiwareResponseBody.description = `Rule#1 Alert! Face has been recognized with possibility of 82%, last seen on ${fiwareResponseBody.deviceId}`;
        break;
      case '4':
        fiwareResponseBody.description = `Rule#1 Alert! Face has been recognized with possibility of 84%, last seen on ${fiwareResponseBody.deviceId}`;
        break;
      case '5':
        fiwareResponseBody.description = `Rule#1 Alert! Face has been recognized with possibility of 86%, last seen on ${fiwareResponseBody.deviceId}`;
        break;
      case '6':
        fiwareResponseBody.description = `Rule#1 Alert! Face has been recognized with possibility of 88%, last seen on ${fiwareResponseBody.deviceId}`;
        break;
      case '7':
        fiwareResponseBody.description = `Rule#1 Alert! Face has been recognized with possibility of 90%, last seen on ${fiwareResponseBody.deviceId}`;
        break;
      default:
        fiwareResponseBody.description = `Rule#1 Alert! Face has been recognized with possibility of 99%, last seen on ${fiwareResponseBody.deviceId}`;
    }

    modifiedKafkaMessage = JSON.stringify(fiwareResponseBody);
    //console.log("TO BE SENT " + modifiedKafkaMessage);
    payloads = [
      {
        topic: 'TOP321_FACE_RECO_EVENT',
        messages: modifiedKafkaMessage,
        partition: 0,
        timestamp: Date.now(),
      },
    ];
    producer.send(payloads, function (err, data) {
      if (err) {
        console.log(err);
      }
      console.log('Kafka data Rule#1 ' + JSON.stringify(data));
    });

    res.json(req.body);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.post('/perseoRule2', async (req, res) => {
  let dateNow = new Date();
  let dateMinus1Day = new Date(dateNow.setHours(dateNow.getHours() - 24));
  let id = req.body.id;
  let count;
  let modifiedKafkaMessage;

  const optionsGetAll321Entities = {
    method: 'GET',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Fiware-Service': 'a4blue',
      'Fiware-ServicePath': '/a4blueevents',
    },
    uri: `http://${serverIp}:1026/v2/entities?type=TOP321_FACE_RECO_EVENT&options=keyValues&limit=1000`, //modify

    resolveWithFullResponse: true,
  };

  try {
    console.log('Perseo rule #2 has been executed');

    let fiwareResponse1 = await rp(optionsGetAll321Entities);
    let allEntities = JSON.parse(fiwareResponse1.body);

    let latestEntity = allEntities
      .filter((entity) => entity.id === req.body.id)
      .map((entity) => entity)[0];

    let allEntitiesInLast1Day = allEntities.filter(
      (entity) =>
        new Date(entity.TimeInstant) > dateMinus1Day &&
        entity.camLatitude > req.body.minLatitude &&
        entity.camLatitude < req.body.maxLatitude &&
        entity.camLongitude > req.body.minLongitude &&
        entity.camLongitude < req.body.maxLongitude &&
        entity.scores > req.body.minScores &&
        entity.scores < req.body.maxScores &&
        req.body.class_names.includes(entity.class_names.toString())
    );
    let MsgIdsInLast1Day = allEntitiesInLast1Day.map(
      (entities) => entities.header.msgId
    );
    let timeInstant1Day = allEntitiesInLast1Day.map(
      (entity) => entity.TimeInstant
    );
    let deviceIdsLast1Day = allEntitiesInLast1Day.map(
      (entity) => entity.deviceId
    );
    let recognitionsLast1Day = allEntitiesInLast1Day.map((entity) => [
      entity.deviceId,
      entity.TimeInstant,
      entity.class_names,
    ]);

    let fiwareResponseBodyMsgId = latestEntity.header.msgId;
    const {
      id,
      type,
      TimeInstant,
      attachDesc,
      class_names,
      classes_id,
      description,
      deviceId,
      timestamp_processing,
      scores,
      suspect_description,
    } = latestEntity;
    let fiwareResponseBody = {
      id,
      type,
      TimeInstant,
      attachDesc,
      class_names,
      classes_id,
      description,
      deviceId,
      timestamp_processing,
      scores,
      suspect_description,
    };
    fiwareResponseBody.msgId = fiwareResponseBodyMsgId;
    fiwareResponseBody.count = req.body.count;
    fiwareResponseBody.camLatitude = undefined;
    fiwareResponseBody.camLongitude = undefined;

    fiwareResponseBody.description = `Rule#2 Alert! Face has been spotted more than one time within last 24 hours`; //, at locations ${filterDeviceIds}
    fiwareResponseBody.deviceId = deviceIdsLast1Day;
    fiwareResponseBody.timestamp_processing = timeInstant1Day;
    fiwareResponseBody.recognitions = recognitionsLast1Day;
    fiwareResponseBody.msgs = MsgIdsInLast1Day;
    fiwareResponseBody.ruleName = 'rule2';

    modifiedKafkaMessage = JSON.stringify(fiwareResponseBody);
    if (fiwareResponseBody.timestamp_processing.length > 1) {
      console.log('TO BE SENT AFTER PROCESSING ' + modifiedKafkaMessage);
    } else {
      console.log('Count is less than 2');
    }
    payloads = [
      {
        topic: 'TOP321_FACE_RECO_EVENT',
        messages: modifiedKafkaMessage,
        partition: 0,
        timestamp: Date.now(),
      },
    ];
    producer.send(payloads, function (err, data) {
      if (err) {
        console.log(err);
      }
      console.log('Kafka data Rule#2 ' + JSON.stringify(data));
    });

    res.json(req.body);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  } 
});

//kafka321Test();
  
router.post('/perseoRule3', async (req, res) => {
  let dateNow = new Date();
  let dateMinus1Hour = new Date(dateNow.setHours(dateNow.getHours() - 1));
  let dateMinus3Hours = new Date(dateNow.setHours(dateNow.getHours() - 3));
  let dateMinus6Hours = new Date(dateNow.setHours(dateNow.getHours() - 6));
  // console.log(req.body.class_names_group[0]);
  const optionsGetAll321Entities = {
    method: 'GET',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Fiware-Service': 'a4blue',
      'Fiware-ServicePath': '/a4blueevents',
    },
    uri: `http://${serverIp}:1026/v2/entities?type=TOP321_FACE_RECO_EVENT&options=keyValues&limit=1000`, //modify

    resolveWithFullResponse: true,
  };

  try {
    console.log('Perseo rule #3 has been executed');

    let fiwareResponse1 = await rp(optionsGetAll321Entities);
    let allEntities = JSON.parse(fiwareResponse1.body);
    //console.log(allEntities);
    let classNames = Object.values(req.body.class_names_group);
    //console.log(classNames);
    let latestEntity = allEntities
      .filter((entity) => entity.id === req.body.id)
      .map((entity) => entity)[0];
    console.log(latestEntity);

    let allEntitiesInLast1Hour = allEntities.filter(
      (entity) =>
        new Date(entity.TimeInstant) > dateMinus1Hour &&
        entity.camLatitude > req.body.minLatitude &&
        entity.camLatitude < req.body.maxLatitude &&
        entity.camLongitude > req.body.minLongitude &&
        entity.camLongitude < req.body.maxLongitude &&
        classNames.includes(entity.class_names.toString())
    );
    let allEntitiesInLast3Hours = allEntities.filter(
      (entity) =>
        new Date(entity.TimeInstant) > dateMinus3Hours &&
        entity.camLatitude > req.body.minLatitude &&
        entity.camLatitude < req.body.maxLatitude &&
        entity.camLongitude > req.body.minLongitude &&
        entity.camLongitude < req.body.maxLongitude &&
        classNames.includes(entity.class_names.toString())
    );
    let allEntitiesInLast6Hours = allEntities.filter(
      (entity) =>
        new Date(entity.TimeInstant) > dateMinus6Hours &&
        entity.camLatitude > req.body.minLatitude &&
        entity.camLatitude < req.body.maxLatitude &&
        entity.camLongitude > req.body.minLongitude &&
        entity.camLongitude < req.body.maxLongitude &&
        classNames.includes(entity.class_names.toString())
    );

    let MsgIdsInLast1Hour = allEntitiesInLast1Hour.map(
      (entities) => entities.header.msgId
    );
    let MsgIdsInLast3Hours = allEntitiesInLast3Hours.map(
      (entities) => entities.header.msgId
    );
    let MsgIdsInLast6Hours = allEntitiesInLast6Hours.map(
      (entities) => entities.header.msgId
    );

    let timeInstant1Hour = allEntitiesInLast1Hour.map(
      (entities) => entities.TimeInstant
    ); //and position
    let timeInstant3Hours = allEntitiesInLast3Hours.map(
      (entities) => entities.TimeInstant
    ); //and position
    let timeInstant6Hours = allEntitiesInLast6Hours.map(
      (entities) => entities.TimeInstant
    );

    let deviceIdsLast1Hour = allEntitiesInLast1Hour.map(
      (entity) => entity.deviceId
    );
    let deviceIdsLast3Hours = allEntitiesInLast3Hours.map(
      (entity) => entity.deviceId
    );
    let deviceIdsLast6Hours = allEntitiesInLast6Hours.map(
      (entity) => entity.deviceId
    );

    let classNames1Hour = allEntitiesInLast1Hour.map(
      (entities) => entities.class_names
    );
    let classNames3Hours = allEntitiesInLast3Hours.map(
      (entities) => entities.class_names
    );
    let classNames6Hours = allEntitiesInLast6Hours.map(
      (entities) => entities.class_names
    );

    let recognitionsLast1Hour = allEntitiesInLast1Hour.map((entity) => [
      entity.deviceId,
      entity.TimeInstant,
      entity.class_names,
    ]);
    let recognitionsLast3Hours = allEntitiesInLast3Hours.map((entity) => [
      entity.deviceId,
      entity.TimeInstant,
      entity.class_names,
    ]);
    let recognitionsLast6Hours = allEntitiesInLast6Hours.map((entity) => [
      entity.deviceId,
      entity.TimeInstant,
      entity.class_names,
    ]);

    let fiwareResponseBodyMsgId = latestEntity.header.msgId;
    const {
      id,
      type,
      TimeInstant,
      attachDesc,
      class_names,
      classes_id,
      description,
      deviceId,
      timestamp_processing,
      scores,
      suspect_description,
    } = latestEntity;
    let fiwareResponseBody = {
      id,
      type,
      TimeInstant,
      attachDesc,
      class_names,
      classes_id,
      description,
      deviceId,
      timestamp_processing,
      scores,
      suspect_description,
    };
    fiwareResponseBody.msgId = fiwareResponseBodyMsgId;
    fiwareResponseBody.count = req.body.count;
    fiwareResponseBody.camLatitude = undefined;
    fiwareResponseBody.camLongitude = undefined;
    fiwareResponseBody.ruleName = 'rule3';
    console.log(allEntitiesInLast1Hour.length);
    if (allEntitiesInLast1Hour.length > 3) {
      fiwareResponseBody.description = `Rule#3 Alert! Face has been spotted more than three times within last hour`; //, at locations ${filterDeviceIds}
      fiwareResponseBody.deviceId = deviceIdsLast1Hour;
      fiwareResponseBody.timestamp_processing = timeInstant1Hour;
      fiwareResponseBody.recognitions = recognitionsLast1Hour;
      fiwareResponseBody.msgs = MsgIdsInLast1Hour;
    } else if (allEntitiesInLast3Hours.length > 6) {
      fiwareResponseBody.description = `Rule#3 Alert! Face has been spotted more than six times since last three hours`;
      fiwareResponseBody.deviceId = deviceIdsLast3Hours;
      fiwareResponseBody.timestamp_processing = timeInstant3Hours;
      fiwareResponseBody.recognitions = recognitionsLast3Hours;
      fiwareResponseBody.msgs = MsgIdsInLast3Hours;
    } else if (allEntitiesInLast6Hours.length > 9) {
      fiwareResponseBody.description = `Rule#3 Alert! Face has been spotted more than nine times since last six hours`;
      fiwareResponseBody.deviceId = deviceIdsLast6Hours;
      fiwareResponseBody.timestamp_processing = timeInstant6Hours;
      fiwareResponseBody.recognitions = recognitionsLast6Hours;
      fiwareResponseBody.msgs = MsgIdsInLast6Hours;
    } else {
      console.log('Not fullfilled');
    }

    let modifiedKafkaMessage = JSON.stringify(fiwareResponseBody);
    console.log('TO BE SENT AFTER PROCESSING ' + modifiedKafkaMessage);

    payloads = [
      {
        topic: 'TOP321_FACE_RECO_EVENT',
        messages: modifiedKafkaMessage,
        partition: 0,
        timestamp: Date.now(),
      },
    ];
    producer.send(payloads, function (err, data) {
      if (err) {
        console.log(err);
      }
      console.log('Kafka data Rule#3 ' + JSON.stringify(data));
    });

    res.json(req.body);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//this rule adds object reco too, it is in testing
router.post('/perseoRule4', async (req, res) => {
  let dateNow = new Date();
  let dateMinus1Hour = new Date(dateNow.setHours(dateNow.getHours() - 1));
  let dateMinus3Hours = new Date(dateNow.setHours(dateNow.getHours() - 3));
  let dateMinus6Hours = new Date(dateNow.setHours(dateNow.getHours() - 6));
  // console.log(req.body.class_names_group[0]);
  const optionsGetAll321FaceEntities = {
    method: 'GET',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Fiware-Service': 'a4blue',
      'Fiware-ServicePath': '/a4blueevents',
    },
    uri: `http://${serverIp}:1026/v2/entities?type=TOP321_FACE_RECO_EVENT&options=keyValues&limit=1000`, //modify

    resolveWithFullResponse: true,
  };

  const optionsGetAll321ObjectEntities = {
    method: 'GET',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Fiware-Service': 'a4blue',
      'Fiware-ServicePath': '/a4blueevents',
    },
    uri: `http://${serverIp}:1026/v2/entities?type=TOP301_OBJECT_DETECT_EVENT&options=keyValues&limit=1000`, //modify

    resolveWithFullResponse: true,
  };

  try {
    console.log('Perseo rule #4 has been executed');

    let fiwareResponse1 = await rp(optionsGetAll321FaceEntities);
    let fiwareResponse2 = await rp(optionsGetAll321ObjectEntities);
    let allEntities = JSON.parse(fiwareResponse1.body);
    let allObjectEntities = JSON.parse(fiwareResponse2.body);
    //we are extracting all object entitie in previous hour and filtering them
    let allObjectEntitiesInLast1Hour = allObjectEntities.filter(
      (entity) =>
        new Date(entity.timestamp_processing) > dateMinus1Hour &&
        entity.camLatitude >= req.body.minLatitude &&
        entity.camLatitude <= req.body.maxLatitude &&
        entity.camLongitude >= req.body.minLongitude &&
        entity.camLongitude <= req.body.maxLongitude
    );
    //console.log(allEntities);
    let latestEntity = allEntities
      .filter((entity) => entity.id === req.body.id)
      .map((entity) => entity)[0];
      //console.log(latestEntity);

    // let latestObjectEntity=allObjectEntities.filter(entity=>entity.id===req.body.id).map(entity=>entity)[0];
    // console.log(latestObjectEntity);

    //related to Face entities
    let allEntitiesInLast1Hour = allEntities.filter(
      (entity) =>
        new Date(entity.TimeInstant) > dateMinus1Hour &&
        entity.camLatitude > req.body.minLatitude &&
        entity.camLatitude < req.body.maxLatitude &&
        entity.camLongitude > req.body.minLongitude &&
        entity.camLongitude < req.body.maxLongitude &&
        entity.class_names === req.body.class_names
    );
    let allEntitiesInLast3Hours = allEntities.filter(
      (entity) =>
        new Date(entity.TimeInstant) > dateMinus3Hours &&
        entity.camLatitude > req.body.minLatitude &&
        entity.camLatitude < req.body.maxLatitude &&
        entity.camLongitude > req.body.minLongitude &&
        entity.camLongitude < req.body.maxLongitude &&
        entity.class_names === req.body.class_names
    );
    let allEntitiesInLast6Hours = allEntities.filter(
      (entity) =>
        new Date(entity.TimeInstant) > dateMinus6Hours &&
        entity.camLatitude > req.body.minLatitude &&
        entity.camLatitude < req.body.maxLatitude &&
        entity.camLongitude > req.body.minLongitude &&
        entity.camLongitude < req.body.maxLongitude &&
        entity.class_names === req.body.class_names
    );

    let MsgIdsInLast1Hour = allEntitiesInLast1Hour.map(
      (entities) => entities.header.msgId
    );
    let MsgIdsInLast3Hours = allEntitiesInLast3Hours.map(
      (entities) => entities.header.msgId
    );
    let MsgIdsInLast6Hours = allEntitiesInLast6Hours.map(
      (entities) => entities.header.msgId
    );

    let timeInstant1Hour = allEntitiesInLast1Hour.map(
      (entities) => entities.TimeInstant
    ); //and position
    let timeInstant3Hours = allEntitiesInLast3Hours.map(
      (entities) => entities.TimeInstant
    ); //and position
    let timeInstant6Hours = allEntitiesInLast6Hours.map(
      (entities) => entities.TimeInstant
    );

    let deviceIdsLast1Hour = allEntitiesInLast1Hour.map(
      (entity) => entity.deviceId
    );
    let deviceIdsLast3Hours = allEntitiesInLast3Hours.map(
      (entity) => entity.deviceId
    );
    let deviceIdsLast6Hours = allEntitiesInLast6Hours.map(
      (entity) => entity.deviceId
    );

    let recognitionsLast1Hour = allEntitiesInLast1Hour.map((entity) => [
      entity.deviceId,
      entity.TimeInstant,
      entity.class_names,
    ]);
    let recognitionsLast3Hours = allEntitiesInLast3Hours.map((entity) => [
      entity.deviceId,
      entity.TimeInstant,
      entity.class_names,
    ]);
    let recognitionsLast6Hours = allEntitiesInLast6Hours.map((entity) => [
      entity.deviceId,
      entity.TimeInstant,
      entity.class_names,
    ]);

    let fiwareResponseBodyMsgId = latestEntity.header.msgId;
    const {
      id,
      type,
      TimeInstant,
      attachDesc,
      class_names,
      classes_id,
      description,
      deviceId,
      timestamp_processing,
      scores,
      suspect_description,
    } = latestEntity;
    let fiwareResponseBody = {
      id,
      type,
      TimeInstant,
      attachDesc,
      class_names,
      classes_id,
      description,
      deviceId,
      timestamp_processing,
      scores,
      suspect_description,
    };
    fiwareResponseBody.msgId = fiwareResponseBodyMsgId;
    fiwareResponseBody.count = req.body.count;
    fiwareResponseBody.camLatitude = undefined;
    fiwareResponseBody.camLongitude = undefined;
    fiwareResponseBody.ruleName = 'rule4';
    //console.log(allEntitiesInLast1Hour.length);
    //here we will add another condition, related to Data Object Detection
    if (allEntitiesInLast1Hour.length > 3 && allObjectEntitiesInLast1Hour) {
      fiwareResponseBody.description = `Rule#4 Alert! Face has been spotted in last  1 hour and backpack has been abandoned`; //, at locations ${filterDeviceIds}
      fiwareResponseBody.deviceId = deviceIdsLast1Hour;
      fiwareResponseBody.timestamp_processing = timeInstant1Hour;
      fiwareResponseBody.recognitions = recognitionsLast1Hour;
      fiwareResponseBody.msgs = MsgIdsInLast1Hour;
    } else if (allEntitiesInLast3Hours.length > 6) {
      fiwareResponseBody.description = `Rule#4 Alert! Face has been spotted in last  1 hour and backpack has been abandoned`;
      fiwareResponseBody.deviceId = deviceIdsLast3Hours;
      fiwareResponseBody.timestamp_processing = timeInstant3Hours;
      fiwareResponseBody.recognitions = recognitionsLast3Hours;
      fiwareResponseBody.msgs = MsgIdsInLast3Hours;
    } else if (allEntitiesInLast6Hours.length > 9) {
      fiwareResponseBody.description = `Rule#4 Alert! Face has been spotted in last  1 hour and backpack has been abandoned`;
      fiwareResponseBody.deviceId = deviceIdsLast6Hours;
      fiwareResponseBody.timestamp_processing = timeInstant6Hours;
      fiwareResponseBody.recognitions = recognitionsLast6Hours;
      fiwareResponseBody.msgs = MsgIdsInLast6Hours;
    } else {
      console.log('Not fullfilled');
    }

    let modifiedKafkaMessage = JSON.stringify(fiwareResponseBody);
    console.log('TO BE SENT AFTER PROCESSING ' + modifiedKafkaMessage);

    payloads = [
      {
        topic: 'TOP321_FACE_RECO_EVENT',
        messages: modifiedKafkaMessage,
        partition: 0,
        timestamp: Date.now(),
      },
    ];
    producer.send(payloads, function (err, data) {
      if (err) {
        console.log(err);
      }
      console.log('Kafka data Rule#4 ' + JSON.stringify(data));
    });

    res.json(req.body);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// automatically adds a new camera entity to Orion

router.post('/addNewCamera', async (req, res) => {
  console.log(req.body);
  try {
    let id = `urn:ngsi-ld:IP_Camera:${req.body.id}`;
    console.log(
      `Post request from CC to add an new camera has been sent with an id of ${id}`
    );
    const options = {
      method: 'POST',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        // 'Fiware-Service': 'a4blue',
        // 'Fiware-ServicePath': '/a4blueevents'
      },
      uri: `http://${serverIp}:1026/v2/entities?type=IP_Camera&options=keyValues`, //modify
      // uri: "https://webhook.site/730596d0-ed07-4f32-b20c-084592ac120c",
      json: true,
      body: {
        id: id,
        type: req.body.type,
        camLatitude: req.body.camLatitude,
        camLongitude: req.body.camLongitude,
      },
      resolveWithFullResponse: true,
    };
    let response = await rp(options);
    if (res.statusCode === 201) {
      console.log(
        `New camera has been added to Orion with status code ${response.statusCode}`
      );
    } else if (res.statusCode === 422) {
      console.log(
        `Camera with that id already exists in Orion, status code ${response.statusCode}`
      );
    }
    console.log(`Status code is ${response.statusCode}`);
    res.json(response);
  } catch (err) {
    console.error(err.message);
    // console.log(err);
    //  res.status(500).send('Server Error');
  }
});

//not using this for now

async function addperseoRuleSecond() {
  const options = {
    method: 'POST',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
      'Fiware-Service': 'a4blue',
      'Fiware-ServicePath': '/a4blueevents',
    },
    //uri: `http://${serverIp}:9090/rules`, //modify
    uri: 'https://webhook.site/448a7385-762f-448c-884e-8410b12b8725',
    json: true,
    body: {
      name: 'Perseo321FaceRuleUpdateSecond',
      text:
        'select *, ev.id? as id, ev.class_names? as class_names, ev.camLatitude? as camLatitude, ev.camLongitude? as camLongitude, count(*) as count from pattern [every ev=iotEvent(cast(cast(camLatitude?,string),float) between 20.000000 and 20.000100, cast(cast(camLongitude?,string),float) between 40.000000 and 40.000100, cast(class_names?,string) like "Ronaldo" and type="TOP321_FACE_RECO_EVENT")].win:time(1 day) group by ev.class_names? having count(ev.class_names?) > 1',
      action: {
        type: 'post',
        template: '{ ${id},${positionx}}',
        parameters: {
          url: 'http://217.172.12.192:5000/api/kafka321/perseoRule2',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'Fiware-Service': 'a4blue',
            'Fiware-ServicePath': '/a4blueevents',
          },
          qs: {
            id: '${id}',
          },
          json: {
            id: '${id}',
            camLatitude: '${camLatitude}',
            camLongitude: '${camLongitude}',
            class_names: '${class_names}',
            count: '${count}',
          },
        },
      },
    },
    resolveWithFullResponse: true,
  };
  let res = await rp(options);
  if (res.statusCode === 200) {
    console.log(
      `Rule #2 has been posted to perseo with status code ${res.statusCode}`
    );
  } else {
  }
}

//addperseoRuleSecond();

//not using this for now
async function getOrionEntityCamera() {
  const options = {
    method: 'GET',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
      'Fiware-Service': 'a4blue',
      'Fiware-ServicePath': '/a4blueevents',
    },
    uri: `http://${serverIp}:1026/v2/entities?type=IP_Camera&options=keyValues`, //modify
    // uri: "https://webhook.site/448a7385-762f-448c-884e-8410b12b8725",
    resolveWithFullResponse: true,
  };

  let res = await rp(options);
  if (res.statusCode === 200) {
    console.log(
      `Orion Camera Entity has fetched with status code ${res.statusCode}`
    );
  }
}

//not using this for now

async function getAllFaceEntities() {
  let allEntities;
  let allTimeInstants;
  let formattedTimeInstant;
  let dateNow = new Date();
  let dateMinus1Hour = new Date(dateNow.setHours(dateNow.getHours() - 1));
  let dateMinus6Hours = new Date(dateNow.setHours(dateNow.getHours() - 6));
  let filter1Hour;
  let filter6Hours;
  //dateNow.setMinutes( dateNow.getMinutes() - 20 );
  //console.log(someDate);
  //console.log(dateNow);
  //if(someDate<dateNow){console.log("It is alive");}
  const optionsGetAll321Entities = {
    method: 'GET',
    headers: {
      'Access-Control-Allow-Origin': '*',
      // "Content-Type": "application/json",
      'Fiware-Service': 'a4blue',
      'Fiware-ServicePath': '/a4blueevents',
    },
    uri: `http://${serverIp}:1026/v2/entities?type=TOP321_FACE_RECO_EVENT&options=keyValues`, //modify
    // uri: "https://webhook.site/448a7385-762f-448c-884e-8410b12b8725",
    resolveWithFullResponse: true,
  };

  try {
    let res = await rp(optionsGetAll321Entities);
    // if (res.statusCode === 200) { console.log(`Orion Camera Entity has fetched with status code ${res.statusCode}`);
    allEntities = JSON.parse(res.body);
    //console.log(allEntities.TimeInstant);
    allTimeInstants = allEntities.map(
      (entity) => entity.TimeInstant + entity.camLongitude
    );
    //}
    console.log(allTimeInstants);
    formattedTimeInstant = allTimeInstants.map(
      (oneTimeInstant) => new Date(oneTimeInstant)
    );
    filter1Hour = allTimeInstants.filter(
      (timeInstant) => new Date(timeInstant) > dateMinus1Hour
    ); //and position
    filter6Hours = allTimeInstants.filter(
      (timeInstant) =>
        new Date(timeInstant) > dateMinus6Hours &&
        new Date(timeInstant) < dateMinus1Hour
    ); //and position
    //console.log(filter1Hour.length);
    //console.log(filter6Hours.length);
    //console.log(formattedTimeInstant);
    //console.log(dateMinus1Hour);
    // if (formattedTimeInstant > dateMinus1Hour) {
    //     console.log("evo nas");
    // }
  } catch (err) {
    console.log(err.message);
  }
}

module.exports = router;
