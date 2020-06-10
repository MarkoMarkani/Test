// Node imports
let express = require('express');
let app = express(); 
let cors = require('cors');
let fs = require('fs');
// let options = {
//     key: fs.readFileSync('openvidukey.pem'),
//     cert: fs.readFileSync('openviducert.pem')
// };
let session = require('express-session');
let https = require('https');

app.use(session({
    saveUninitialized: true,
    resave: false,
    secret: 'MY_SECRET'
}));
app.use(express.static(__dirname + '/public')); // Set the static files location
app.use(cors());
app.use(express.json());

//Separated folders which we use
app.use('/api/openvidu', require('./openvidu/openvidu'));
let config=require(`./config/config`);
let logger = require("./config/logger");
let kafka321 = require('./kafka/321');
kafka321();
let streaming = require('./streaming/streaming');
streaming();

let PORT = config.port || 5001;
let server = https.createServer(app).listen(PORT, function () {
    logger.info(`App running on port ${PORT}`);
    console.log(`App running on port ${PORT}`);
});










