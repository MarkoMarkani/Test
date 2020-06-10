const express = require('express');
const router = express.Router();
var rp = require("request-promise");
var {
    promisify
} = require('util');
var cors = require('cors');
var getIP = promisify(require('external-ip')());
var btoa = require('btoa');
/* CONFIGURATION */
var OpenVidu = require('openvidu-node-client').OpenVidu;
var Session = require('openvidu-node-client').Session;
var OpenViduRole = require('openvidu-node-client').OpenViduRole;
var sessionId;
var fullUrl;
var gStreamPath;
var gStreamId;
// Environment variable: URL where our OpenVidu server is listening
//var OPENVIDU_URL = process.argv[2];
// Environment variable: secret shared with our OpenVidu server
//var OPENVIDU_SECRET = process.argv[3];

// Entrypoint to OpenVidu Node Client SDK
//var OV = new OpenVidu(OPENVIDU_URL, OPENVIDU_SECRET);

var properties = {
    recordingMode: "ALWAYS", //RecordingMode.ALWAYS, // RecordingMode.ALWAYS for automatic recording
    defaultOutputMode: "INDIVIDUAL" //Recording.OutputMode.INDIVIDUAL
};
// Collection to pair session names with OpenVidu Session objects
var mapSessionObject = {};
// Collection to pair session names with tokens
var mapSessionObjectToken = {};
//console.log("ARGV "+process.argv);

//let appServerAddress = process.argv[2].split(":")[0];
//console.log("ASA " + appServerAddress);
//console.log(`OV URL ${OPENVIDU_URL}`)


// Check launch arguments: must receive openvidu-server URL and the secret
// if (process.argv.length != 4) {
//     console.log("Usage: node " + __filename + " OPENVIDU_URL OPENVIDU_SECRET");
//     process.exit(-1);
// }
// For demo purposes we ignore self-signed certificate
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";


// Mock database
var users = [{
        userId: "marko",
        user: "publisher1",
        pass: "pass",
        ip: "::ffff:87.116.181.210", //MODIFY
        role: OpenViduRole.PUBLISHER
    },
    {
        userId: "silvio",
        user: "publisher4",
        pass: "pass",
        ip: "::ffff:93.62.63.197",
        role: OpenViduRole.PUBLISHER
    },
    {
        user: "subscriber1",
        pass: "pass",
        role: OpenViduRole.SUBSCRIBER
    }
];

//MODIFY

function sendFetchedSession() {
    var options = {

        url: `https://${OPENVIDU_URL}/api/sessions/${sessionId}`,

        method: "GET",

        resolveWithFullResponse: true,

        headers: {
            "Access-Control-Allow-Origin": "*",
            "Authorization": "Basic " + btoa("OPENVIDUAPP:MY_SECRET")
        }

    };

    getIP()
        .then((ip) => {
            console.log("This is external ip " + ip);
            fullUrl = `https://${ip}:${server.address().port}/`;
            console.log(fullUrl);
            return rp(options);
        })
        .then(response => {
            bodyObject = JSON.parse(response.body);
            console.log("Body object original " + response.body);

            //  Making new object!!!   and send bodyObject1

            var bodyObject1 = {
                deviceId: roomId,
                deviceType: "Body worn camera", //UBACITI
                sessionId: `${bodyObject.sessionId}`,

                // streamPath: `public/recordings/${bodyObject.sessionId}`,
                streamUrl: `${fullUrl}${bodyObject.connections.content[0].publishers[0].streamId}`,
                //           localStreamUrl: `https://localhost:5000/${bodyObject.connections.content[0].publishers[0].streamId}`,
                htmlUrl: `${fullUrl}#${bodyObject.sessionId}`,
                // connectionId: bodyObject.connections.content[0].connectionId,
                // createdAt: bodyObject.connections.content[0].createdAt,
                // location: bodyObject.connections.content[0].location,
                platform: bodyObject.connections.content[0].platform
                // token: bodyObject.connections.content[0].token,

            };
            // console.log(Object.keys(bodyObject.connections.content[0]));
            bodyString = JSON.stringify(bodyObject1);
            gStreamPath = bodyObject1.streamUrl;
            gStreamId = `${bodyObject.connections.content[0].publishers[0].streamId}`;
            console.log("GLOBALNI PATH DO STREAMA   " + gStreamPath);
            console.log("GLOBALNI ID STREAMA   " + gStreamId);
            console.log("Body string for kafka  : " + bodyString);
            console.log("Body object  : " + bodyObject1);
            var fullMessage = {
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
                "body": bodyObject1
            };
            console.log("Full message " + JSON.stringify(fullMessage));
            var fullStringMessage = JSON.stringify(fullMessage);
            payloads = [{
                topic: "TOP401_IOT_PROPAGATE_EVENT", //TREBALO BI PROMENITI u TOP401_IOT_PROPAGATE_EVENT
                messages: fullStringMessage,
                partition: 0,
                timestamp: Date.now()
            }];
            producer.send(payloads, function (err, data) {
                if (err) {
                    console.log(err);
                }
                console.log("Kafka data " + JSON.stringify(data)); //will come back
                console.log("Done");
            });

            // return postFiware(bodyObject1);
        })
        .then((value => {
            // console.log("postfiware executed, status code " + value.statusCode);
        }))
        .catch(error => {
            console.log("Error has been catched  " + error);
        });

}



function postFiware(bodyObject1) {
    return new Promise((resolve, reject) => {
        console.log("IN postfiware bodyobject " + JSON.stringify(bodyObject1));
        var options = {
            method: "POST",
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Authorization": "Basic " + btoa("OPENVIDUAPP:MY_SECRET"),
                "options": "keyValues"
            },
            uri: "http://localhost:1026/v2/entities?options=keyValues", //217.172.12.192
            resolveWithFullResponse: true,
            json: true,
            body: {
                id: bodyObject1.connectionId,
                type: "Stream",
                sessionId: bodyObject1.sessionId,
                createdAt: bodyObject1.createdAt,
                location: bodyObject1.location,
                platform: bodyObject1.platform
            }
        };

        rp(options)
            .then((response) => {
                // console.log("RESPONSE IZ FIWAREA " + JSON.stringify(response.body));
                console.log("before resolving postFiware");
                console.log(response.statusCode);
                return resolve(response);
            })
            .catch(error => {
                console.log(error.statusCode);
                return reject(error);
            });

    });
}





router.post('/api-sessions/sendSessionFromFront', function (req, res) {

    // Retrieve params from POST body
    sessionId = req.body.sessionId;
    roomId = req.body.roomId;
    console.log("Evo nam ga originalni session id  " + sessionId);
    console.log("Evo nam ga originalni room id  " + roomId);
    res.status(200).send({
        sessionId: sessionId,
        message: "Evo odgovora iz backend-a sa session id-jem"
    });
    // sendFetchedSession();
});

router.get('/api-sessions/sendFetchedSession', function (req, res) {

    // Retrieve params from POST body

    res.status(200).send(
        sendFetchedSession()
    );


});


// Login
router.post('/api-login/login', function (req, res) {
    console.log("REQ BODY " + JSON.stringify(req.body));
    // Retrieve params from POST body
    var user = req.body.user;
    var pass = req.body.pass;
    var userId = req.body.userId;
    var gUserId = userId;
    var ip = req.body.ip;
    var role;
    console.log("{Logging in with  username, password ,ip}={" + user + " ," + pass + " ," + ip + "}");

    if (verifySubscriber(ip)) { // Correct user-pass
        role = OpenViduRole.SUBSCRIBER;
        // Validate session and return OK 
        // Value stored in req.session allows us to identify the user in future requests
        console.log(user + " has logged in" + pass + " , " + role);
        req.session.loggedUser = user;
        // role=req.session.loggedUser.role;
        res.status(200).send({
            user: user,
            message: "You have logged in successfully",
            role: role,
            pass: pass
        });
        // res.send();
    } else {
        //THIS IS REPLACED 
        // Wrong user-pass
        // Invalidate session and return error
        // console.log("'" + user + "' invalid credentials");
        // req.session.destroy();
        // res.status(401).send('User/Pass incorrect');  
        if (verifyPublisher(userId)) {
            res.status(200).send({
                user: user,
                message: "You are streaming successfully",
                userId: userId,
                ip: undefined
            });
            console.log(`this is role  ${role}`);
            console.log("this is logged ip " + ip);
        } else {
            res.status(400).send({
                message: "You are not authorized to publish"
            });
        }
    }
});

//Logout

// router.post('/api-login/logout', function (req, res) {
//     console.log("'" + req.session.loggedUser + "' has logged out");
//     req.session.destroy();
//     res.status(200).send();
// });  

// Get token (add new user to session)

router.post('/api-sessions/create-session', function (req, res) {


    var resSession = OV.createSession(properties);
    resSession.then((res) => {
        Session.getSessionId;
    });
    res.status(200).send(resSession);
});




// router.post('/api-sessions/get-token', function (req, res) {


//     // The video-call to connect
//     var roomId = req.body.roomId;
//     // Role associated to this user
//     var role;
//     if (role) {
//         role = users.find(u => (u.user === req.session.loggedUser)).role;
//     } else {
//         role = OpenViduRole.PUBLISHER;
//     }

//     // Optional data to be passed to other users when this user connects to the video-call
//     // In this case, a JSON with the value we stored in the req.session object on login
//     // var serverData = JSON.stringify({ serverData: req.session.loggedUser }); vraticemo

//     console.log("Getting a token | {roomId}={" + roomId + "}");
//     // Build tokenOptions object with the serverData and the role
//     var tokenOptions = {
//         // data: serverData,
//         role: role
//     };

//     if (mapSessionObject[roomId]) {
//         // Session already exists
//         console.log('Existing room ' + roomId);

//         // Get the existing Session from the collection
//         var mySession = mapSessionObject[roomId];
//         // console.log("Here is mySession "+util.inspect( mySession));
//         // Generate a new token asynchronously with the recently created tokenOptions
//         mySession.generateToken(tokenOptions)
//             .then(token => {

//                 // Store the new token in the collection of tokens
//                 mapSessionObjectToken[roomId].push(token);

//                 // Return the token to the client
//                 res.status(200).send({
//                     0: token
//                 });
//             })
//             .catch(error => {
//                 console.error(error);
//             });
//     } else {
//         // New session
//         console.log('New session ' + roomId);

//         // Create a new OpenVidu Session asynchronously
//         OV.createSession(properties)
//             .then(session => {
//                 // Store the new Session in the collection of Sessions
//                 mapSessionObject[roomId] = session;
//                 // Store a new empty array in the collection of tokens
//                 mapSessionObjectToken[roomId] = [];
//                 // console.log(util.inspect( session))
//                 // Generate a new token asynchronously with the recently created tokenOptions
//                 session.generateToken(tokenOptions)
//                     .then(token => {

//                         // Store the new token in the collection of tokens
//                         mapSessionObjectToken[roomId].push(token);

//                         // Return the Token to the client
//                         res.status(200).send({
//                             0: token
//                         });
//                     })
//                     .catch(error => {
//                         console.error(error);
//                     });
//             })
//             .catch(error => {
//                 console.error(error);
//             });
//     }

// });

// Remove user from session
router.post('/api-sessions/remove-user', function (req, res) {

    // Retrieve params from POST body
    var roomId = req.body.roomId;
    var token = req.body.token;
    console.log('Removing user with {roomId, token}={' + roomId + ', ' + token + '}');

    // If the session exists
    if (mapSessionObject[roomId] && mapSessionObjectToken[roomId]) {
        var tokens = mapSessionObjectToken[roomId];
        var index = tokens.indexOf(token);

        // If the token exists
        if (index !== -1) {
            // Token removed

            tokens.splice(index, 1);

            console.log(roomId + ': ' + tokens.toString());
        } else {
            var msg = 'Problems in the app server: the TOKEN wasn\'t valid';
            console.log(msg);
            res.status(500).send(msg);
        }
        if (tokens.length == 0) {
            // Last user left: session must be removed
            console.log("Room with id " + roomId + ' empty!');
            delete mapSessionObject[roomId];
        }
        res.status(200).send();
    } else {
        var msg = 'SESSION does not exist- no users there';
        console.log(msg);
        res.status(500).send(msg);
    }

});

/* REST API */



/* AUXILIARY METHODS */

function verifySubscriber(ip) {
    return (users.find(u => (u.ip === ip)));
}


function verifyPublisher(userId) {
    // return (users.find(u => (u.userId === userId) && (u.ip === ip)));
    return (users.find(u => (u.userId === userId) && (userId != undefined)));
}


router.get('/api-sessions/fetchip', function (req, res) {

    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log("Below is the ip");
    console.log(ip);
    res.send({
        ip
    });
});


router.post('/marko', function (req, res) {
    console.log(req.message);
    res.status(200).send({
        message: "marko"
    });
});

module.exports = router;