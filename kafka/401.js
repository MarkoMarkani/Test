var kafka = require('kafka-node');
var ffmpeg = require('fluent-ffmpeg');
let config=require(`../config/config`);
const serverIp=config.serverIp;  
const awsIp=config.awsIp;
const {
    v4: uuidv4
} = require('uuid');
var Producer = kafka.Producer,
    client = new kafka.KafkaClient({
//        kafkaHost: "217.172.12.192:9092" //modify
        kafkaHost: `${awsIp}:9092` //this will be modified

    }),
    producer = new Producer(client);

var Consumer = kafka.Consumer,
    consumer = new Consumer(
        client,
        [{
            topic: 'TOP401_IOT_PROPAGATE_EVENT', 
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



function sendRtmptoRtspKafka(StreamPath, recordingName,streamStatus) {
    //let appServerAddress = process.argv[2].split(":")[0];
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

        streamStatus: streamStatus ? "ENDED" : "STARTED",

        streamUrl: `rtmp://${serverIp}:8002` + StreamPath, //this will be dynamic

        recordingPath: recordingName ? `${process.cwd()}/recordings/` + recordingName : "Not available yet", //this will be dynamic modify 

        platform: `Body worn camera`

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



function ffmpegConversionToMp4(StreamPath,streamStatus) {
let recordingName;
    ffmpeg(`rtmp://${serverIp}:8002${StreamPath}`, { //217.172.12.192 //this will be dynamic modify
            timeout: 432000
        })
        .videoCodec('libx264')
        //.audioBitrate('128k')
        // .videoBitrate("500")
        .on('start', function (commandLine) {
           // recordingName = commandLine.split(" ")[6].split("/")[6];
      //      recordingName = commandLine.split(" ")[6].split("/" || "\\")[6]; //   for Linux
        recordingName=commandLine.split(" ")[6].split("/")[7]        
        console.log("This is recording name "+recordingName);
            console.log("Start has been triggered " + commandLine);
            sendRtmptoRtspKafka(StreamPath, null,streamStatus); //promenicemo
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
            streamStatus=true;
            sendRtmptoRtspKafka(StreamPath, recordingName,streamStatus);
        })
        .on('error', function (err) {
            console.log('an error happened: ' + err.message);
        })
        .save(`${process.cwd()}/recordings/${uuidv4()}.mp4`); ///home/ubuntu/iot/test08/Test/recordings //this will be dynamic modify
}


module.exports = {
    ffmpegConversionToMp4,
    sendRtmptoRtspKafka
};
