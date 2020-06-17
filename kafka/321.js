    const express = require('express');
    var kafka = require('kafka-node');
    var rp = require("request-promise");
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
        // console.log("THIS IS LOGGED MESSAGE "+JSON.stringify(message));
        // console.log("TYPE IS " + typeof message);


        stringMessage = message.value;
        //console.log("STRING MESSAGE " + stringMessage);  
        modifiedString = stringMessage
            .replace(/\\/g, "")
            .replace("\"{\"boxes", "{\"boxes")
            .replace("cam-1\"}\"", "cam-1\"}")
            .replace("\"body\":{", "")
            .replace("detected\"}", "detected\"")
            .replace("\"attachment\":[{", "")
            .replace("}]", "")
            .replace("\"results\":{", "")
            .replace("cam-1\"}", "cam-1\"")
            .replace("scores\": [", "scores\": ")
            .replace("], \"class", ", \"class")
            .replace("class_names\": [", "class_names\":  ")
            .replace("], \"classes_id", " , \"classes_id")
            .replace("\"{\"id", "{\"id")
            .replace("detected\"}\"", "detected\"}")
            .trim();


        //  .replace("ref_id\": [","ref_id\": ") 
        //  .replace("],\"description",", \"description");

        //const modifiedObject = JSON.parse(modifiedString);
        //console.log("MODIFIED STRING MESSAGE " + modifiedString);
        // console.log("Type is " + typeof modifiedString);
        modifiedObject = JSON.parse(modifiedString);
        modifiedObject.id = "urn:ngsi-ld:TOP321_FACE_RECO_DONE:" + uuidv4();
        modifiedObject.type = "TOP321_FACE_RECO_DONE";
        modifiedObject.TimeInstant = new Date();
        console.log(`Entity stored in Orion is ${JSON.stringify(modifiedObject)}`);
        const options = {
            method: "POST",
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json",
                "Fiware-Service": "a4blue",
                "Fiware-ServicePath": "/a4blueevents"
            },
            uri: "http://localhost:1026/v2/entities?options=keyValues", //modify
            // uri: "https://webhook.site/730596d0-ed07-4f32-b20c-084592ac120c", 
            resolveWithFullResponse: true,
            json: true,
            body: modifiedObject
        };

        //}
        //console.log(`MESSAGE RESULTS ${ JSON.stringify(modifiedObject.scores)}`)

        rp(options)
            .then(res => {
                console.log(`Entity has been stored successfully`);
                let id = res.headers.location.split("/")[3].split("?")[0];
                return id;
            })
            .then((id) => {
                console.log(id);
                const optionsFiwareGetById = {
                    method: "GET",
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Fiware-Service": "a4blue",
                        "Fiware-ServicePath": "/a4blueevents"
                    },
                    uri: `http://localhost:1026/v2/entities/${id}?options=keyValues`, //modify
                    // uri: "https://webhook.site/730596d0-ed07-4f32-b20c-084592ac120c", 
                    resolveWithFullResponse: true
                };
                const optionsWebhookGetById = {
                    method: "GET",
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Fiware-Service": "a4blue",
                        "Fiware-ServicePath": "/a4blueevents"
                    },
                    uri: `http://localhost:1026/v2/entities/${id}/raw`, //modify
                    // uri: "https://webhook.site/730596d0-ed07-4f32-b20c-084592ac120c", 
                    resolveWithFullResponse: true
                };
                return rp(optionsFiwareGetById);
            })
            .then((res) => {
                console.log(`This is response body ${res.body}`);
            })
            .catch(err => {
                console.log(`Error is ${err}`);
            });

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
                "description": "A face was detected"
            }
        };

        const stringMessage = JSON.stringify(message);
        //console.log(stringMessage)
        const modifiedString = stringMessage
            .replace(/\\/g, "")
            .replace("\"{\"boxes", "{\"boxes")
            .replace("cam-1\"}\"", "cam-1\"}")
            .replace("\"body\":{", "")
            .replace("detected\"}", "detected\"")
            .replace("\"attachment\":[{", "")
            .replace("}]", "")
            .replace("\"results\":{", "")
            .replace("cam-1\"}", "cam-1\"")
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
            console.log("Kafka data " + JSON.stringify(data));
            console.log("Kafka Done");
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


    //kafka321Test();


    router.post('/',async (req, res) => {
            try {
                // console.log("Here is request: " + JSON.stringify(req.body) + " " + typeof req.body);
                console.log("Perseo has been executed");

                res.json(req.body);
            } catch (err) {
                console.error(err.message);
                console.log(err);
                res.status(500).send('Server Error');
            }
        }
    );
    

    module.exports = router;