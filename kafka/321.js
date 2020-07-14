const express = require('express');
var kafka = require('kafka-node');
var rp = require("request-promise");
let config = require(`../config/config`);
const serverIp = config.serverIp;
const {
    v4: uuidv4
} = require('uuid');
const router = express.Router();
var Producer = kafka.Producer,
    //client = new kafka.KafkaClient(),
    client = new kafka.KafkaClient({
        kafkaHost: "217.172.12.192:9092" //modify
        //kafkaHost: "35.178.85.208:9094" //this will be modified

    }),   
    producer = new Producer(client);

var Consumer = kafka.Consumer,
    consumer = new Consumer(
        client,
        [{
            topic: 'TOP321_FACE_RECO_DONE', //PROMENITI U 401
            offset: 0
        }],
        [{
                autoCommit: false
            },
            kafkaOptions = {
                fromOffset: 'latest'
            }
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
        .replace(/\\/g, "")
        .replace("\"{\"boxes", "{\"boxes")
        .replace("\"}\"", "\"") //we have changed this
        .replace("\"body\":{", "")
        .replace("detected\"}", "detected\"")
        .replace("\"attachment\":[{", "")
        .replace("}]", "")
        .replace("\"results\":{", "")
        .replace("scores\": [", "scores\": ")
        .replace("], \"class", ", \"class")
        .replace("class_names\": [", "class_names\":  ")
        .replace("], \"classes_id", " , \"classes_id");


    //  .replace("ref_id\": [","ref_id\": ") 
    //  .replace("],\"description",", \"description");

    //const modifiedObject = JSON.parse(modifiedString);
    //console.log("MODIFIED STRING MESSAGE " + modifiedString);
    // console.log("Type is " + typeof modifiedString);
    modifiedObject = JSON.parse(modifiedString);
    modifiedObject.id = "urn:ngsi-ld:TOP321_FACE_RECO_DONE:" + uuidv4();
    modifiedObject.type = "TOP321_FACE_RECO_DONE";
    modifiedObject.TimeInstant = new Date();
    deviceId = modifiedObject.deviceId;
    //console.log(`Entity stored in Orion is ${JSON.stringify(modifiedObject)}`); //We will comment this for now
    const options1 = {
        method: "GET",
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Fiware-Service": "a4blue",
            "Fiware-ServicePath": "/a4blueevents"
        },
        uri: `http://${serverIp}:1026/v2/entities/urn:ngsi-ld:IP_Camera:${deviceId}?type=IP_Camera&options=keyValues`, //modify
        // uri: "https://webhook.site/448a7385-762f-448c-884e-8410b12b8725", 
        resolveWithFullResponse: true
    };

    const options2 = {
        method: "POST",
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
            "Fiware-Service": "a4blue",
            "Fiware-ServicePath": "/a4blueevents"
        },
        uri: `http://${serverIp}:1026/v2/entities?options=keyValues`, //modify
        // uri: "https://webhook.site/730596d0-ed07-4f32-b20c-084592ac120c", 
        resolveWithFullResponse: true,
        json: true,
        body: modifiedObject
    };

    //}
    //console.log(`MESSAGE RESULTS ${ JSON.stringify(modifiedObject.scores)}`)
    if (modifiedObject.count === undefined) {
        rp(options1)
            .then(res => {
                //console.log(res.body);
                bodyObject = JSON.parse(res.body);
                modifiedObject.camLatitude = bodyObject.camLatitude;
                modifiedObject.camLongitude = bodyObject.camLongitude;
                return rp(options2);
            })
            .then(res => {
                console.log(`Entity has been stored successfully after receiving mesage from Kafka and modyfing it, status code is ${res.statusCode}`);
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
            .catch(err => {
                console.log(`On Message : Error is ${err}`);
            });
    } else {
        console.log("Object has already been stored in Orion");
    }
    //will come back
});

consumer.on('error', function (err) {
    console.log('Error:', err);
});

consumer.on('offsetOutOfRange', function (err) {
    // console.log('offsetOutOfRange:', err); will come back
});



//WE don't need this for now, but we will need it sometime when we create a new topic

// var topicsToCreate = [{
//     topic: 'TOP321_FACE_RECO_DONE',
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
    console.log("Sending 321 test..");
    const message = {
        // "id": "urn:ngsi-ld:TOP321_FACE_RECO_DONE:007", 
        // "type": "TOP321_FACE_RECO_DONE", 
        "header": {
            "topicName": "TOP321_FACE_RECO_DONE",
            "topicVer1": 1,
            "topicVer2": 0,
            "msgId": "dummy_id_00001",
            "sender": "FR",
            "sentUtc": "2020-04-30 13:55:45.028748",
            "status": "Test",
            "msgType": "Update",
            "source": "VMS",
            "scope": "Restricted",
            "caseId": "44092dec-ebbb-44b5-b42b-6872f28c590d"
        },
        "body": {
            "attachment": [{
                "mimeType": "video/mp4",
                "attachDesc": "New face detection results",
                "objectStoreId": "5eaad8e0a73040a68e7bb894",
                "results": "{\"boxes\": [[0.3163111209869385, 0.3704342544078827, 0.4800548553466797, 0.4447254240512848]], \"scores\": [0.697463390827179], \"class_names\": [\"Ronaldo\"], \"classes_id\": [8], \"timestamp_processing\": \"2020-04-30 13:55:44.237511\", \"ref_id\": [\"5e9af1237823974d0f3f0bee\"], \"suspect_description\": [\"The suspect has been charged with multiple crimes\"], \"processed_id\": \"5eaad8e0a73040a68e7bb881\", \"frame_number\": \"\", \"deviceId\": \"cam-1\"}"
            }],
            //                "camLatitude": "20.000021", added by me
            //              "camLongitude": "40.000001", added by me
            "description": "A face was detected"
        }
    };

    const stringMessage = JSON.stringify(message);
    //console.log(stringMessage);
    const modifiedString = stringMessage
        .replace(/\\/g, "")
        .replace("\"{\"boxes", "{\"boxes")
        .replace("\"}\"", "\"") //we have changed this
        .replace("\"body\":{", "")
        .replace("detected\"}", "detected\"")
        .replace("\"attachment\":[{", "")
        .replace("}]", "")
        .replace("\"results\":{", "")
        .replace("scores\": [", "scores\": ")
        .replace("], \"class", ", \"class")
        .replace("class_names\": [", "class_names\":  ")
        .replace("], \"classes_id", " , \"classes_id");
    //  .replace("ref_id\": [","ref_id\": ") 
    //  .replace("],\"description",", \"description");

    const modifiedObject = JSON.parse(modifiedString);
    //console.log("STRING MESSAGE   " + modifiedString);


    payloads = [{
        topic: "TOP321_FACE_RECO_DONE", //BILO JE 401
        messages: stringMessage,
        partition: 0,
        timestamp: Date.now()
    }];
    producer.send(payloads, function (err, data) {
        if (err) {
            console.log(err);
        }
        console.log("Kafka 321 Test data " + JSON.stringify(data));
    });
    //OPTIONS WE ARE NOT CURRENTLY USING
    const options = {
        method: "POST",
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json"
        },
        //uri: "http://localhost:1026/v2/entities?options=keyValues", //this is a valid one  //modify
        uri: "https://webhook.site/730596d0-ed07-4f32-b20c-084592ac120c",
        resolveWithFullResponse: true,
        json: true,
        body: modifiedObject
    };
    //}
    //console.log(`MESSAGE RESULTS ${ JSON.stringify(modifiedObject.scores)}`);
    // rp(options)
    //     .then(res => console.log("Successfully stored " + JSON.stringify(res)))
    //     .catch(err => console.log("Error occured" + err));
}


kafka321Test();


router.post('/perseoRule1', async (req, res) => {
    let id = req.body.id;
    //console.log(id);
    let count;
    let modifiedKafkaMessage;
    
    const optionsFiwareGetById = {
        method: "GET",
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Fiware-Service": "a4blue",
            "Fiware-ServicePath": "/a4blueevents"
        },
        uri: `http://${serverIp}:1026/v2/entities/${id}?options=keyValues`, //modify
        // uri: "https://webhook.site/730596d0-ed07-4f32-b20c-084592ac120c", 
        resolveWithFullResponse: true
    };
    try {
        console.log("Perseo rule #1 has been executed");
        let fiwareResponse = await rp(optionsFiwareGetById);
        //This would print out the whole circular object
        //console.log(fiwareResponse);
        fiwareResponseBody = JSON.parse(fiwareResponse.body);
        fiwareResponseBody.count = req.body.count;
        count = fiwareResponseBody.count;

        switch (count) {     
            case "2":
                fiwareResponseBody.description = `Rule#1 Alert! Face has been recognized with possibility of 80%, last seen on ${fiwareResponseBody.deviceId}`;
                break;
            case "3":
                fiwareResponseBody.description = `Rule#1 Alert! Face has been recognized with possibility of 82%, last seen on ${fiwareResponseBody.deviceId}`;
                break;
            case "4":
                fiwareResponseBody.description = `Rule#1 Alert! Face has been recognized with possibility of 84%, last seen on ${fiwareResponseBody.deviceId}`;
                break;
            case "5":
                fiwareResponseBody.description = `Rule#1 Alert! Face has been recognized with possibility of 86%, last seen on ${fiwareResponseBody.deviceId}`;
                break;
            case "6":
                fiwareResponseBody.description = `Rule#1 Alert! Face has been recognized with possibility of 88%, last seen on ${fiwareResponseBody.deviceId}`;
                break;
            case "7":
                fiwareResponseBody.description = `Rule#1 Alert! Face has been recognized with possibility of 90%, last seen on ${fiwareResponseBody.deviceId}`;
                break;
            default:
                fiwareResponseBody.description = `Rule#1 Alert! Face has been recognized with possibility of 100%, last seen on ${fiwareResponseBody.deviceId}`;
        }

        modifiedKafkaMessage = JSON.stringify(fiwareResponseBody);
        //console.log(modifiedKafkaMessage);
        // console.log("Here is request: " + JSON.stringify(req.body) + " " + typeof req.body);
        payloads = [{
            topic: "TOP321_FACE_RECO_DONE",
            messages: modifiedKafkaMessage,
            partition: 0,
            timestamp: Date.now()
        }];
        producer.send(payloads, function (err, data) {
            if (err) {
                console.log(err);
            }
            console.log("Kafka data Rule#1 " + JSON.stringify(data));
        });

        res.json(req.body);
    } catch (err) {
        console.error(err.message);
        // console.log(err);
        res.status(500).send('Server Error');
    }
});


router.post('/perseoRule2', async (req, res) => {
    let id = req.body.id;
    //console.log(id);
    //console.log(req.body);
    let count;
    let modifiedKafkaMessage;
    
    const optionsFiwareGetById = {
        method: "GET",
        headers: {
            "Access-Control-Allow-Origin": "*", 
            "Fiware-Service": "a4blue",
            "Fiware-ServicePath": "/a4blueevents"
        },
        uri: `http://${serverIp}:1026/v2/entities/${id}?options=keyValues&limit=1000`, //modify
        // uri: "https://webhook.site/730596d0-ed07-4f32-b20c-084592ac120c", 
        resolveWithFullResponse: true
    };
    try {
        console.log("Perseo rule #2 has been executed");
        let fiwareResponse = await rp(optionsFiwareGetById);
        //This would print out the whole circular object
        // console.log(fiwareResponse);
        fiwareResponseBody = JSON.parse(fiwareResponse.body);
        //I will check this, added undefined instead od camLat and camLon
        fiwareResponseBody.count = req.body.count;
        fiwareResponseBody.camLatitude = undefined;
        fiwareResponseBody.camLongitude = undefined; 
        count = fiwareResponseBody.count;

        switch (count) {
            case "2":
                fiwareResponseBody.description = "Rule#2 Alert! Face has been recognized with possibility of 80%";
                break;  
            case "3":
                fiwareResponseBody.description = "Rule#2 Alert! Face has been recognized with possibility of 82%";
                break;
            case "4":
                fiwareResponseBody.description = "Rule#2 Alert! Face has been recognized with possibility of 84%";
                break;
            case "5":
                fiwareResponseBody.description = "Rule#2 Alert! Face has been recognized with possibility of 86%";
                break;
            case "6":
                fiwareResponseBody.description = "Rule#2 Alert! Face has been recognized with possibility of 88%";
                break;
            case "7":
                fiwareResponseBody.description = "Rule#2 Alert! Face has been recognized with possibility of 90%";
                break;
            default:
                fiwareResponseBody.description = "Rule#2 Alert! Face has been recognized with possibility of 100%";
        }

        modifiedKafkaMessage = JSON.stringify(fiwareResponseBody); 
       // console.log(modifiedKafkaMessage);
        // console.log("Here is request: " + JSON.stringify(req.body) + " " + typeof req.body);
        payloads = [{
            topic: "TOP321_FACE_RECO_DONE",
            messages: modifiedKafkaMessage,
            partition: 0,
            timestamp: Date.now()
        }];
        producer.send(payloads, function (err, data) {
            if (err) {
                console.log(err);
            }
            console.log("Kafka data Rule#2 " + JSON.stringify(data));
        });

        res.json(req.body);
    } catch (err) {
        console.error(err.message);
        //  console.log(err);
        res.status(500).send('Server Error');
    }
});


router.post('/perseoRule3', async (req, res) => {
    let allEntities;
    let allTimeInstants;
    let dateNow = new Date();
    let dateMinus1Hour = new Date(dateNow.setHours(dateNow.getHours() - 1));
    let dateMinus3Hours = new Date(dateNow.setHours(dateNow.getHours() - 3));
    let dateMinus6Hours = new Date(dateNow.setHours(dateNow.getHours() - 6));
    let filter1Hour;
    let filter3Hours;
    let filter6Hours;
    let filterCamLatitudes;
    let filterCamLongitudes;
    let modifiedKafkaMessage;
    let allDeviceIds;
    let filterDeviceIds;
    let id = req.body.id;
    //console.log(id);
    //console.log(req.body);

    const optionsGetAll321Entities = {
        method: "GET",
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Fiware-Service": "a4blue",
            "Fiware-ServicePath": "/a4blueevents"
        },
        uri: `http://${serverIp}:1026/v2/entities?type=TOP321_FACE_RECO_DONE&options=keyValues&limit=1000`, //modify
        // uri: "https://webhook.site/448a7385-762f-448c-884e-8410b12b8725", 
        resolveWithFullResponse: true
    };

    const optionsFiwareGetById = {
        method: "GET",
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Fiware-Service": "a4blue",
            "Fiware-ServicePath": "/a4blueevents"
        },
        uri: `http://${serverIp}:1026/v2/entities/${id}?type=TOP321_FACE_RECO_DONE&options=keyValues&limit=1000`, //modify
        // uri: "https://webhook.site/730596d0-ed07-4f32-b20c-084592ac120c", 
        resolveWithFullResponse: true
    };



    try {
        console.log("Perseo rule #3 has been executed");

        let fiwareResponse1 = await rp(optionsGetAll321Entities);
        allEntities = JSON.parse(fiwareResponse1.body);

        allTimeInstants = allEntities.map(entity => entity.TimeInstant);
        allCamLatitudes = allEntities.map(entity => entity.camLatitude);
        allCamLongitudes = allEntities.map(entity => entity.camLongitude);
        allDeviceIds = allEntities.map(entity => entity.deviceId);

        // console.log(allTimeInstants);
        formattedTimeInstant = allTimeInstants.map(oneTimeInstant => new Date(oneTimeInstant));
        filter1Hour = allTimeInstants.filter(timeInstant => new Date(timeInstant) > dateMinus1Hour); //and position
        filter3Hours = allTimeInstants.filter(timeInstant => new Date(timeInstant) > dateMinus3Hours); //and position
        filter6Hours = allTimeInstants.filter(timeInstant => new Date(timeInstant) > dateMinus6Hours); //and position && new Date(timeInstant) < dateMinus1Hour
        filterCamLatitudes = allCamLatitudes.filter(camLatitude => camLatitude > req.body.minLatitude && camLatitude < req.body.maxLatitude);
        filterCamLongitudes = allCamLongitudes.filter(camLongitude => camLongitude > req.body.minLongitude && camLongitude < req.body.maxLongitude);
        //filterDeviceIds=allDeviceIds.filter(deviceId => camLongitude > req.body.minLongitude && camLongitude < req.body.maxLongitude);
        filterDeviceIds = [...new Set(allDeviceIds)]
        //console.log(filterDeviceIds)
        // console.log(filter1Hour.length);
        // console.log(filter3Hours.length);
        // console.log(filter6Hours.length);

        let fiwareResponse2 = await rp(optionsFiwareGetById);
        fiwareResponseBody = JSON.parse(fiwareResponse2.body);
        fiwareResponseBody.count = req.body.count;
        fiwareResponseBody.camLatitude = undefined;
        fiwareResponseBody.camLongitude = undefined;
        // count = fiwareResponseBody.count;
        if (filter1Hour.length > 3 && filterCamLatitudes && filterCamLongitudes && filterDeviceIds) {
            fiwareResponseBody.description = `Rule#3 Alert! Face has been spotted more than three times within last hour, time spotted: ${filter1Hour}`;//, at locations ${filterDeviceIds}
        } else if (filter3Hours.length > 6 && filterCamLatitudes && filterCamLongitudes && filterDeviceIds ) {
            fiwareResponseBody.description = `Rule#3 Alert! Face has been spotted more than six times since last three hours, time spotted: ${filter3Hours}`;
        } else if (filter6Hours.length > 9 && filterCamLatitudes && filterCamLongitudes && filterDeviceIds ) {
            fiwareResponseBody.description = `Rule#3 Alert! Face has been spotted more than nine times since last six hours, time spotted: ${filter6Hours}`;
        }


        modifiedKafkaMessage = JSON.stringify(fiwareResponseBody);
        //console.log(filter1Hour.length);
        //console.log("TO BE SENT AFTER PROCESSING " + modifiedKafkaMessage);
        // console.log("Here is request: " + JSON.stringify(req.body) + " " + typeof req.body);
        payloads = [{
            topic: "TOP321_FACE_RECO_DONE",
            messages: modifiedKafkaMessage,
            partition: 0,
            timestamp: Date.now()
        }];
        producer.send(payloads, function (err, data) {
            if (err) {
                console.log(err);
            }
            console.log("Kafka data Rule#3 " + JSON.stringify(data));
        });

        res.json(req.body);
    } catch (err) {
        console.error(err.message);
        //  console.log(err);
        res.status(500).send('Server Error');
    }
});


// automatically adds a new camera entity to Orion

router.post('/addNewCamera', async (req, res) => {
    console.log(req.body);
    try {
        let id = req.body.id;
        console.log(`Post request from CC to add an new camera has been sent with an id of ${id}`);
        const options = {
            method: "POST",
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json",
                "Fiware-Service": "a4blue",
                "Fiware-ServicePath": "/a4blueevents"
            },
            uri: `http://${serverIp}:1026/v2/entities?type=IP_Camera&options=keyValues`, //modify
            // uri: "https://webhook.site/730596d0-ed07-4f32-b20c-084592ac120c", 
            json: true,
            body: req.body,
            resolveWithFullResponse: true
        };
        let response = await rp(options);
        if (res.statusCode === 201) {
            console.log(`New camera has been added to Orion with status code ${response.statusCode}`);
        } else if (res.statusCode === 422) {
            console.log(`Camera with that id already exists in Orion, status code ${response.statusCode}`);
        }
        console.log(`Status code is ${response.statusCode}`);
        res.json();

    } catch (err) {
        console.error(err.message);
        // console.log(err);
        //  res.status(500).send('Server Error');
    }
});

//not using this for now

async function addperseoRuleSecond() {
    const options = {
        method: "POST",
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
            "Fiware-Service": "a4blue",
            "Fiware-ServicePath": "/a4blueevents"
        },
        //uri: `http://${serverIp}:9090/rules`, //modify
        uri: "https://webhook.site/448a7385-762f-448c-884e-8410b12b8725",
        json: true,
        body: {
            "name": "Perseo321FaceRuleUpdateSecond",
            "text": "select *, ev.id? as id, ev.class_names? as class_names, ev.camLatitude? as camLatitude, ev.camLongitude? as camLongitude, count(*) as count from pattern [every ev=iotEvent(cast(cast(camLatitude?,string),float) between 20.000000 and 20.000100, cast(cast(camLongitude?,string),float) between 40.000000 and 40.000100, cast(class_names?,string) like \"Ronaldo\" and type=\"TOP321_FACE_RECO_DONE\")].win:time(1 day) group by ev.class_names? having count(ev.class_names?) > 1",
            "action": {
                "type": "post",
                "template": "{ ${id},${positionx}}",
                "parameters": {
                    "url": "http://217.172.12.192:5000/api/kafka321/perseoRule2",
                    "method": "POST",
                    "headers": {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                        "Fiware-Service": "a4blue",
                        "Fiware-ServicePath": "/a4blueevents"
                    },
                    "qs": {
                        "id": "${id}"
                    },
                    "json": {
                        "id": "${id}",
                        "camLatitude": "${camLatitude}",
                        "camLongitude": "${camLongitude}",
                        "class_names": "${class_names}",
                        "count": "${count}"
                    }
                }
            }
        },
        resolveWithFullResponse: true
    };
    let res = await rp(options);
    if (res.statusCode === 200) {
        console.log(`Rule #2 has been posted to perseo with status code ${res.statusCode}`);
    } else {}
}

//addperseoRuleSecond();


//not using this for now

async function addOrionEntityCamera() {
    const options = {
        method: "POST",
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
            "Fiware-Service": "a4blue",
            "Fiware-ServicePath": "/a4blueevents"
        },
        uri: `http://${serverIp}:1026/v2/entities?type=IP_Camera&options=keyValues&limit=1000`, //modify
        // uri: "https://webhook.site/448a7385-762f-448c-884e-8410b12b8725", 
        json: true,
        body: {
            "id": "urn:ngsi-ld:IP_Camera:cam-1",
            "type": "IP_Camera",
            "camLatitude": "20.000001",
            "camLongitude": "40.000001",
        },
        resolveWithFullResponse: true
    };

    let res = await rp(options);
    if (res.statusCode === 201) {
        console.log(`Orion Camera Entity has been triggered with status code ${res.statusCode}`);
    }

}

//addOrionEntityCamera();

//not using this for now
async function getOrionEntityCamera() {
    const options = {
        method: "GET",
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
            "Fiware-Service": "a4blue",
            "Fiware-ServicePath": "/a4blueevents"
        },
        uri: `http://${serverIp}:1026/v2/entities?type=IP_Camera&options=keyValues`, //modify
        // uri: "https://webhook.site/448a7385-762f-448c-884e-8410b12b8725", 
        resolveWithFullResponse: true
    };

    let res = await rp(options);
    if (res.statusCode === 200) {
        console.log(`Orion Camera Entity has fetched with status code ${res.statusCode}`);
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
        method: "GET",
        headers: {
            "Access-Control-Allow-Origin": "*",
            // "Content-Type": "application/json",
            "Fiware-Service": "a4blue",
            "Fiware-ServicePath": "/a4blueevents"
        },
        uri: `http://${serverIp}:1026/v2/entities?type=TOP321_FACE_RECO_DONE&options=keyValues`, //modify
        // uri: "https://webhook.site/448a7385-762f-448c-884e-8410b12b8725", 
        resolveWithFullResponse: true
    };

    try {
        let res = await rp(optionsGetAll321Entities);
        // if (res.statusCode === 200) { console.log(`Orion Camera Entity has fetched with status code ${res.statusCode}`);
        allEntities = JSON.parse(res.body);
        //console.log(allEntities.TimeInstant);
        allTimeInstants = allEntities.map(entity => entity.TimeInstant + entity.camLongitude);
        //}
        console.log(allTimeInstants);
        formattedTimeInstant = allTimeInstants.map(oneTimeInstant => new Date(oneTimeInstant));
        filter1Hour = allTimeInstants.filter(timeInstant => new Date(timeInstant) > dateMinus1Hour); //and position
        filter6Hours = allTimeInstants.filter(timeInstant => new Date(timeInstant) > dateMinus6Hours && new Date(timeInstant) < dateMinus1Hour); //and position
        console.log(filter1Hour.length);
        console.log(filter6Hours.length);
        //console.log(formattedTimeInstant);
        console.log(dateMinus1Hour);
        // if (formattedTimeInstant > dateMinus1Hour) {
        //     console.log("evo nas");
        // }

    } catch (err) {
        console.log(err.message);
    }
}

//getAllFaceEntities();


//previous version

// router.post('/perseoRule3', async (req, res) => {
//     let id = req.body.id;
//     console.log(id);
//     console.log(req.body);
//     let count;
//     let modifiedKafkaMessage;
//     const optionsFiwareGetById = {
//         method: "GET",
//         headers: {
//             "Access-Control-Allow-Origin": "*",
//             "Fiware-Service": "a4blue",
//             "Fiware-ServicePath": "/a4blueevents"
//         },
//         uri: `http://${serverIp}:1026/v2/entities/${id}?type=TOP321_FACE_RECO_DONE&options=keyValues&limit=1000`, //modify
//         // uri: "https://webhook.site/730596d0-ed07-4f32-b20c-084592ac120c", 
//         resolveWithFullResponse: true
//     };
//     try {
//         console.log("Perseo rule #3 has been executed");
//         let fiwareResponse = await rp(optionsFiwareGetById);
//         //This would print out the whole circular object
//         // console.log(fiwareResponse);
//         fiwareResponseBody = JSON.parse(fiwareResponse.body);
//         fiwareResponseBody.count = req.body.count;
//         fiwareResponseBody.camLatitude = undefined;
//         fiwareResponseBody.camLongitude = undefined;
//         count = fiwareResponseBody.count;

//         switch (count) {
//             case "2":
//                 fiwareResponseBody.description = "Face has been recognized with possibility of 80%";
//                 break;
//             case "3":
//                 fiwareResponseBody.description = "Alert! Face has been recognized with possibility of 82%";
//                 break;
//             case "4":
//                 fiwareResponseBody.description = "Alert! Face has been recognized with possibility of 84%";
//                 break;
//             case "5":
//                 fiwareResponseBody.description = "Alert! Face has been recognized with possibility of 86%";
//                 break;
//             case "6":
//                 fiwareResponseBody.description = "Alert! Face has been recognized with possibility of 88%";
//                 break;
//             case "7":
//                 fiwareResponseBody.description = "Alert! Face has been recognized with possibility of 90%";
//                 break;
//             default:
//                 fiwareResponseBody.description = "Alert! Face has been recognized with possibility of 100%";
//         }

//         modifiedKafkaMessage = JSON.stringify(fiwareResponseBody);
//         console.log("TO BE SENT AFTER PROCESSING " + modifiedKafkaMessage);
//         // console.log("Here is request: " + JSON.stringify(req.body) + " " + typeof req.body);
//         payloads = [{
//             topic: "TOP321_FACE_RECO_DONE",
//             messages: modifiedKafkaMessage,
//             partition: 0,
//             timestamp: Date.now()
//         }];
//         producer.send(payloads, function (err, data) {
//             if (err) {
//                 console.log(err);
//             }
//             console.log("Kafka data " + JSON.stringify(data));
//             console.log("Kafka Done");
//         });

//         res.json(req.body);
//     } catch (err) {
//         console.error(err.message);
//         //  console.log(err);
//         res.status(500).send('Server Error');
//     }
// });


module.exports = router;
