// Node imports
let express = require('express');
let app = express(); 
let cors = require('cors');
let fs = require('fs');
let options = {
    key: fs.readFileSync('openvidukey.pem'),
    cert: fs.readFileSync('openviducert.pem')
};
let session = require('express-session');
let https = require('https');

// Server configuration
app.use(session({
    saveUninitialized: true,
    resave: false,
    secret: 'MY_SECRET'
}));
app.use(express.static(__dirname + '/public')); // Set the static files location
app.use(cors());
app.use(express.json());
//separated folders which we use
app.use('/api/openvidu', require('./openvidu/openvidu'));
let kafka321 = require('./kafka/321');
kafka321();
let streaming = require('./streaming/streaming');
streaming();

let PORT = process.env.PORT || 5000;
let server = https.createServer(options,app).listen(PORT, function () {
    console.log('App running at 5000');
});

// app.listen(PORT, () => console.log(`Server started on port ${PORT}`));






