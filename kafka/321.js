module.exports = function () {

    var kafka = require('kafka-node');
    var rp = require("request-promise");
    const {
        v4: uuidv4
    } = require('uuid');

    var Producer = kafka.Producer,
        //client = new kafka.KafkaClient(),
        client = new kafka.KafkaClient({
            kafkaHost: "217.172.12.192:9092"
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
            uri: "http://localhost:1026/v2/entities?options=keyValues",
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




    function fiwareTest() {
        const message = {
            "id": "urn:ngsi-ld:TOP301_OBJECT_DETECT_DONE:035",
            "type": "TOP301_OBJECT_DETECT_DONE",
            "header": {
                "topicName": "TOP301_OBJECT_DETECT_DONE",
                "topicVer1": 1,
                "topicVer2": 0,
                "msgId": "dummy_id_00001",
                "sender": "OD",
                "sentUtc": "2020-05-04 10:16:59.775156",
                "status": "Test",
                "msgType": "Update",
                "source": "VMS",
                "scope": "Restricted",
                "caseId": "44092dec-ebbb-44b5-b42b-6872f28c590d"
            },
            "body": {
                "attachment": [{
                    "mimeType": "video/mp4",
                    "attachDesc": "New object detection results",
                    "objectStoreId": "5eafeb9ba73040a68ef8af99",
                    "results": "{\"boxes\": [[0.48596954345703125, 0.3511067032814026, 0.6109967827796936, 0.5391626358032227]], \"scores\": [0.4335201382637024], \"class_names\": [\"weapon\"], \"classes_id\": [408], \"timestamp_processing\": \"2020-05-04 10:16:58.812454\", \"ref_id\": \"\", \"processed_id\": \"5eafeb9ba73040a68ef8af86\", \"frame_number\": \"\", \"deviceId\": \"cam-2\"}"
                }],
                "description": "An Object was detected"
            }
        };

        const stringMessage = JSON.stringify(message);
        const modifiedString = stringMessage.replace(/\\/g, "")
            .replace("\"{\"boxes", "{\"boxes")
            .replace("cam-2\"}\"", "cam-2\"}")
            .replace("\"body\":{", "")
            .replace("detected\"}", "detected\"")
            .replace("\"attachment\":[{", "")
            .replace("}]", "")
            .replace("\"results\":{", "")
            .replace("cam-2\"}", "cam-2\"")
            .replace("scores\": [", "scores\": ")
            .replace("], \"class", ", \"class");


        const modifiedObject = JSON.parse(modifiedString);
        //console.log("STRING MESSAGE   " + modifiedString); 


        const options = {

            method: "POST",
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json"
            },
            uri: "http://localhost:1026/v2/entities?options=keyValues",
            resolveWithFullResponse: true,
            json: true,
            body: modifiedObject
        }
        //}
        //console.log(`MESSAGE RESULTS ${ JSON.stringify(modifiedObject.scores)}`)
        rp(options)
            .then(res => console.log())
            .catch(err => console.log());
    }
    //fiwareTest();






    function fiwareTest1() {
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
            .replace("], \"classes_id", " , \"classes_id")
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
            //uri: "http://localhost:1026/v2/entities?options=keyValues", //this is a valid one
            uri: "https://webhook.site/730596d0-ed07-4f32-b20c-084592ac120c",
            resolveWithFullResponse: true,
            json: true,
            body: modifiedObject
        }
        //}
        console.log(`MESSAGE RESULTS ${ JSON.stringify(modifiedObject.scores)}`);
        // rp(options)
        //     .then(res => console.log("Successfully stored " + JSON.stringify(res)))
        //     .catch(err => console.log("Error occured" + err));
    }


    // commented for now, we di not want new kafka messages
    fiwareTest1();       


    
    // example without the keyValues   
    // function fiwareTest2() {
    //     const message = {
    //         // "id": "urn:ngsi-ld:TOP321_FACE_RECO_DONE:007", 
    //         // "type": "TOP321_FACE_RECO_DONE",

    //             "type": "TOP321_FACE_RECO_DONE",
    //             "id": "16",
    //             "scores": {
    //               "value": 0.987463390827179
    //             },
    //             "TimeInstant": {
    //               "value": "2020-06-05T08:55:05Z",
    //               "type": "DateTime"
    //             },
    //             "class_names": {
    //               "value": "Ronaldo"

    //           },
    //           "age":"12" 

    //     }

    //     const stringMessage = JSON.stringify(message);
    //     //console.log(stringMessage)


    //     const modifiedObject = JSON.parse(stringMessage);
    //     //console.log("STRING MESSAGE   " + modifiedString);


    //     payloads = [{
    //         topic: "TOP321_FACE_RECO_DONE",//BILO JE 401
    //         messages: stringMessage,
    //         partition: 0,
    //         timestamp: Date.now()
    //     }];
    //     producer.send(payloads, function (err, data) {
    //         if (err) {
    //             console.log(err);
    //         }
    //         console.log("Kafka data " + JSON.stringify(data));
    //         console.log("Kafka Done");
    //     });
    //     //OPTIONS WE ARE NOT CURRENTLY USING
    //     const options = {
    //         method: "POST",
    //         headers: { 
    //             "Access-Control-Allow-Origin": "*",
    //             "Content-Type": "application/json",
    //             "Fiware-Service": "a4blue", 
    //             "Fiware-ServicePath": "/a4blueevents"     
    //         },
    //         uri: "http://localhost:1026/v2/entities",          
    //         // uri: "https://webhook.site/730596d0-ed07-4f32-b20c-084592ac120c", 
    //         resolveWithFullResponse: true,
    //         json: true,
    //         body: message
    //     };
    //     //}



    //     console.log(`MESSAGE RESULTS ${ JSON.stringify(modifiedObject.scores)}`);
    //     rp(options)
    //         .then(res => console.log("Successfully stored "))
    //         .catch(err => console.log("Error occured" + err));
    // }

    // fiwareTest2();





    // TEST WITH WEBHOOK SITE

    // var options = {
    //     method: 'POST',
    //     uri: 'https://webhook.site/730596d0-ed07-4f32-b20c-084592ac120c',
    //     body: {
    //         some: 'payload'
    //     },
    //     json: true // Automatically stringifies the body to JSON
    // };

    // rp(options)
    //     .then(function (parsedBody) {
    //         // POST succeeded...
    //     })
    //     .catch(function (err) {
    //         // POST failed...
    //     });


    // let message23={"id":"urn:ngsi-ld:TOP321_FACE_RECO_DONE:008","type":"TOP321_FACE_RECO_DONE","header":{"topicName":"TOP321_FACE_RECO_DONE","topicVer1":1,"topicVer2":0,"msgId":"dummy_id_00001","sender":"FR","sentUtc":"2020-04-30 13:55:45.028748","status":"Test","msgType":"Update","source":"VMS","scope":"Restricted","caseId":"44092dec-ebbb-44b5-b42b-6872f28c590d"},"mimeType":"video/mp4","attachDesc":"New face detection results","objectStoreId":"5eaad8e0a73040a68e7bb894","boxes": [[0.3163111209869385, 0.3704342544078827, 0.4800548553466797, 0.4447254240512848]], "scores": 0.887463390827179, "class_names":  "Xi Jinping" , "classes_id": [8], "timestamp_processing": "2020-04-30 13:55:44.237511", "ref_id": ["5e9af1237823974d0f3f0bee"], "suspect_description": ["The suspect has been charged with multiple crimes"], "processed_id": "5eaad8e0a73040a68e7bb881", "frame_number": "", "deviceId": "cam-1","description":"A face was detected"}
    // console.log( message23)
    // const messageObject2=JSON.stringify(message23);
    // // console.log(messageObject2);
    // var options = {
    //     method: 'POST',
    //     //uri: 'https://webhook.site/730596d0-ed07-4f32-b20c-084592ac120c',
    //     uri: 'http://localhost:1026/v2/entities?options=keyValues',
    //     body: {
    //         message23
    //     },
    //     json: true // Automatically stringifies the body to JSON
    // }; 
    // rp(options)
    //     .then(function (parsedBody) {
    //         // POST succeeded...
    //     })
    //     .catch(function (err) {
    //         // POST failed...
    //     });


    // function sendRtmptoRtspKafka(StreamPath) {
    //     let appServerAddress = process.argv[2].split(":")[0];
    //     //console.log("ASA "+appServerAddress)
    //     console.log(StreamPath)
    //     let deviceIdName;
    //     let fullMessage2;
    //     let fullStringMessage2;
    //     if(StreamPath=="/app/live" || StreamPath=="/app/silvio"){deviceIdName="cam-3";}
    //     else {deviceIdName="cam-kostas";} 
    //     let fullBodyMessage = {
    //         deviceId: deviceIdName,
}