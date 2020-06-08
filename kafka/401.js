var kafka = require('kafka-node');
var ffmpeg = require('fluent-ffmpeg');
var rp = require("request-promise");
const {
    v4: uuidv4
} = require('uuid');
//KAFKA METHODS

var Producer = kafka.Producer,
    //client = new kafka.KafkaClient(),
    client = new kafka.KafkaClient({
        kafkaHost: "217.172.12.192:9092"
        //kafkaHost: "35.178.85.208:9094"

    }),
    producer = new Producer(client);

var Consumer = kafka.Consumer,
    consumer = new Consumer(
        client,
        [{
            topic: 'TOP401_IOT_PROPAGATE_EVENT', //PROMENITI U 401
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
    console.log(message);
});

consumer.on('error', function (err) {
    console.log('Error:', err);
});

consumer.on('offsetOutOfRange', function (err) {
    // console.log('offsetOutOfRange:', err); will come back
});


//WE don't need this for now, but we will need it sometime when we create a new topic

// var topicsToCreate = [{
//     topic: 'TOP401_IOT_PROPAGATE_EVENT',
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



function sendRtmptoRtspKafka(StreamPath) {
    let appServerAddress = process.argv[2].split(":")[0];
    //console.log("ASA "+appServerAddress)
   // console.log("This is stream path " + StreamPath);
    let deviceIdName;
    let fullMessage2;
    let fullStringMessage2;
    if (StreamPath == "/app/live" || StreamPath == "/app/silvio") {
        deviceIdName = "cam-3";
    } else if (StreamPath == "/app/cam-kostas") {
        deviceIdName = "cam-kostas";
    } else {
        deviceIdName = "default";
    }
    let fullBodyMessage = {

        deviceId: deviceIdName,

        sessionId: ``,

        streamUrl: `rtmp://${appServerAddress}:8002` + StreamPath,

        htmlUrl: ``,

        platform: ``

    };
    fullMessage2 = {
        "header": {
            "topicName": "TOP401_IOT_PROPAGATE_EVENT",
            "topicVer1": 1,
            "topicVer2": 0,
            "msgId": "IOT-000001",
            "sender": "IOT",
            "sentUtc": "2020-01-27T14:05:00Z",
            "status": "Test",
            "msgType": "Update",
            "source": "VMS",
            "scope": "Restricted",
            "caseId": "0"
        },
        "body": fullBodyMessage
    };
    console.log("Full message " + JSON.stringify(fullMessage2));
    fullStringMessage2 = JSON.stringify(fullMessage2);
    payloads = [{
        topic: "TOP401_IOT_PROPAGATE_EVENT",
        messages: fullStringMessage2,
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
}



//FFMPEG METHODS 
function ffmpegConversionToMp4() {
    
    ffmpeg('rtmp://127.0.0.1:8002/app/live', {
            timeout: 432000
        })
        .videoCodec('libx264')
        //.audioBitrate('128k')
        // .videoBitrate("500")
        .on('start', function (commandLine) {
            recordingName=commandLine.split(" ")[6].split("/")[6];
            console.log(recordingName);
            console.log("Start has been triggered " + commandLine);
            sendRtmptoRtspKafka(recordingName);//promenicemo
        })
        .on("progress", function (progress) {
            console.log('1.Frames: ' + progress.frames);
            console.log('2.Current Fps: ' + progress.currentFps);
            console.log('3.Current kbps: ' + progress.currentKbps);
            console.log('4.Target size: ' + progress.targetSize);
            console.log('5.Percent: ' + progress.percent);
            console.log('6.Timemark: ' + progress.timemark + ' sec');
        })
        .on('codecData', function (data) {
            console.log('On codec data');
            
        })
        .on('end', function () {
            console.log('file has ended converting succesfully');
        })
        .on('error', function (err) {
            console.log('an error happened: ' + err.message);
        })
        .save(`C:/Users/marko.petrovic/Desktop/Svasta/VideoFajlovi/${uuidv4()}.mp4`);
}



//THIS WAS ONE OF PREVIOUS OPTIONS
// app.post('/api-sendRtspKafka', function (req, res) { 
//     let reqBody;
//     let fullMessage1;
//     let fullStringMessage1;
//     console.log(req.body);
//     reqBody = {
//         deviceId: req.body.deviceId,
//         deviceType: "IP camera",
//         streamUrl: req.body.streamUrl
//     };
//     fullMessage1 = {
//         "header": {
//             "topicName": "TOP401_IOT_PROPAGATE_EVENT",
//             "topicVer1": 1,
//             "topicVer2": 0,
//             "msgId": "IOT-000001",
//             "sender": "IOT",
//             "sentUtc": "2020-01-27T14:05:00Z",
//             "status": "Test",
//             "msgType": "Update",
//             "source": "VMS",
//             "scope": "Restricted",
//             "caseId": "0"
//         },
//         "body": reqBody
//     };
//     console.log("Full message " + JSON.stringify(fullMessage1));
//     fullStringMessage1 = JSON.stringify(fullMessage1);
//     payloads = [{
//         topic: "TOP401_IOT_PROPAGATE_EVENT", //TREBALO BI PROMENITI u TOP401_IOT_PROPAGATE_EVENT
//         messages: fullStringMessage1,
//         partition: 0,
//         timestamp: Date.now()
//     }];
//     producer.send(payloads, function (err, data) {
//         if (err) {
//             console.log(err);
//         }
//         console.log("Kafka data " + JSON.stringify(data)); //will come back
//         console.log("Done");
//     });

//     res.status(200).send("Message to Kafka sent");
// });



// THIS WAS ONE OF PREVIOUS OPTIONS
// function ffmpegConversion() {
//     var two = ffmpeg('rtmp://127.0.0.1:8002/app/live', {
//             timeout: 432000
//         })
//         .videoCodec('libx264')
//         .format("rtsp")
//         .fps(10)
//         .size('50%')
//         .keepDAR()
//         //.audioBitrate('128k')
//         // .videoBitrate("500")
//         .on('start', function (commandLine) {
//             console.log("Start has been triggered " + commandLine);
//         })
//         .on("progress", function (progress) {
//             console.log('1.Frames: ' + progress.frames);
//             console.log('2.Current Fps: ' + progress.currentFps);
//             console.log('3.Current kbps: ' + progress.currentKbps);
//             console.log('4.Target size: ' + progress.targetSize);
//             console.log('5.Percent: ' + progress.percent);
//             console.log('6.Timemark: ' + progress.timemark + ' sec');
//         })
//         .on('codecData', function (data) {
//             console.log('On codec data');
//             sendRtmptoRtspKafka();
//         })
//         .on('end', function () {
//             console.log('file has ended converting succesfully');
//         })
//         .on('error', function (err) {
//             console.log('an error happened: ' + err.message);
//         })
//         .save('rtsp://127.0.0.1:8554/mystream');
// }



module.exports = {
    ffmpegConversionToMp4,
    sendRtmptoRtspKafka
};