const express = require('express');
var kafka = require('kafka-node');
var rp = require('request-promise');
let config = require(`../config/config`);
const serverIp = config.serverIp;
const orionPort = config.orionPort;
const awsIp = config.awsIp;
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
var Producer = kafka.Producer,
  client = new kafka.KafkaClient({
    kafkaHost: `${awsIp}:9092`,
  }),
  producer = new Producer(client);

var Consumer = kafka.Consumer,
  consumer = new Consumer(
    client,
    [
      {
        topic: 'TOP301_OBJECT_DETECT_DONE',
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
  console.log('Producer is in error state');
  console.log(err);
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
  //   console.log("Type is " + typeof modifiedString);
  modifiedObject = JSON.parse(modifiedString);
  modifiedObject.id = 'urn:ngsi-ld:TOP301_OBJECT_DETECT_DONE:' + uuidv4();
  modifiedObject.type = 'TOP301_OBJECT_DETECT_DONE';
  modifiedObject.TimeInstant = new Date();
  deviceId = modifiedObject.deviceId;
  //console.log(`Entity stored in Orion is ${JSON.stringify(modifiedObject)}`); //We will comment this for now
  const options1 = {
    method: 'GET',
    headers: {
      'Access-Control-Allow-Origin': '*',
      //            "Fiware-Service": "a4blue",
      //          "Fiware-ServicePath": "/a4blueevents"
    },
    uri: `http://${serverIp}:${orionPort}/v2/entities/urn:ngsi-ld:IP_Camera:${deviceId}?type=IP_Camera&options=keyValues`,
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
    uri: `http://${serverIp}:${orionPort}/v2/entities?options=keyValues`,
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
        modifiedObject.camLatitude = bodyObject.camLatitude;
        modifiedObject.camLongitude = bodyObject.camLongitude;
        return rp(options2);
      })
      .then((res) => {
        console.log(
          `Entity has been stored successfully after receiving mesage from Kafka and modifying it, status code is ${res.statusCode}`
        );
        // let id = res.headers.location.split("/")[3].split("?")[0];
        // return id;
      })
      // .then((id) => {
      //     console.log(id);
      //     const optionsFiwareGetById = {
      //         method: "GET",
      //         headers: {
      //             "Access-Control-Allow-Origin": "*",
      //             "Fiware-Service": "a4blue",
      //             "Fiware-ServicePath": "/a4blueevents"
      //         },
      //         uri: `http://${serverIp}:1026/v2/entities/${id}?options=keyValues`, //modify
      //         // uri: "https://webhook.site/730596d0-ed07-4f32-b20c-084592ac120c",
      //         resolveWithFullResponse: true
      //     };
      //     const optionsWebhookGetById = {
      //         method: "GET",
      //         headers: {
      //             "Access-Control-Allow-Origin": "*",
      //             "Fiware-Service": "a4blue",
      //             "Fiware-ServicePath": "/a4blueevents"
      //         },
      //         uri: `http://${serverIp}:1026/v2/entities/${id}/raw`, //modify
      //         // uri: "https://webhook.site/730596d0-ed07-4f32-b20c-084592ac120c",
      //         resolveWithFullResponse: true
      //     };
      //     return rp(optionsFiwareGetById);
      // })
      // .then((res) => {
      //     console.log(`This is response body ${res.body}`);
      // })
      .catch((err) => {
        console.log(`On Message : Error is ${err}`);
      });
  } else {
    console.log('Object has already been stored in Orion');
  }
});

consumer.on('error', function (err) {
  console.log('Error:', err);
});

consumer.on('offsetOutOfRange', function (err) {
  // console.log('offsetOutOfRange:', err); This will come back
});

function kafka301Test() {
  console.log('Sending 301 test..');
  const message = {
    header: {
      topicName: 'TOP301_OBJECT_DETECT_DONE',
      topicVer1: 1,
      topicVer2: 0,
      msgId: 'dummy_id_00001',
      sender: 'OD',
      sentUtc: '2020-04-21 08:56:47.927727',
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
          attachDesc: 'Nova detekcija',
          objectStoreId: '5e9eb53e7823974d0f9a5c6a',
          results:
            '{"boxes": [[0.18275953829288483, 0.022030264139175415, 0.5277820229530334, 0.3406021296977997], [0.1182575523853302, 0.7805114388465881, 0.3963867127895355, 0.9877914786338806], [0.550839364528656, 0.5327770709991455, 1.0, 0.9066135883331299], [0.047673992812633514, 0.44034722447395325, 0.35874226689338684, 0.757936954498291], [0.3318304121494293, 0.17483171820640564, 0.8596351146697998, 0.6162400245666504], [0.015076464973390102, 0.14727294445037842, 0.1612349897623062, 0.40066587924957275]], "scores": [0.37325236201286316], "class_names": ["weapon"], "classes_id": [533, 533, 533, 533, 533, 533], "timestamp_processing": "2020-04-21 08:56:29.028494", "ref_id": ["5e9af1237823974d0f3f0bee"], "processed_id": "5e9eb53e7823974d0f9a5c4f", "frame_number": "", "deviceId": "cam-2"}',
        },
      ],
      description: 'An Object was detected',
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

  //const modifiedObject = JSON.parse(modifiedString);
  //console.log("STRING MESSAGE   " + modifiedString);

  payloads = [
    {
      topic: 'TOP301_OBJECT_DETECT_DONE', //BILO JE 401
      messages: stringMessage,
      partition: 0,
      timestamp: Date.now(),
    },
  ];
  producer.send(payloads, function (err, data) {
    if (err) {
      console.log(err);
    }
    console.log('Kafka 301 Test data ' + JSON.stringify(data));
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

//kafka301Test();

module.exports = router;
