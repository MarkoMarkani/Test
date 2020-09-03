// Node imports
let express = require('express');
let app = express(); 
app.use(express.json());

let config=require(`./config/config`);
let logger = require("./config/logger");

app.use('/api/kafka321', require('./kafka/321'));
app.use('/api/kafka301', require('./kafka/301'));
app.use('/api/streaming', require('./streaming/streaming'));
app.use(express.static(__dirname + '/public')); // Set the static files location //modify

let PORT = config.port || 5001;
//console.log(process.env)
app.listen(PORT, function () {      
  logger.info(`App running on port ${PORT}`);
  console.log(`App running on port ${PORT}`);
});


//console.log(`${process.cwd()}\\public\\recordings\\`)

//const axios = require('axios');
//let https = require('https');
// let cors = require('cors');
// app.use(cors());
// let fs = require('fs');
// let options = {
//     key: fs.readFileSync('openvidukey.pem'),
//     cert: fs.readFileSync('openviducert.pem')
// };
// let session = require('express-session');
// app.use(session({
//       saveUninitialized: true,
//       resave: false, 
//       secret: 'MY_SECRET'
//   }));

//app.use('/api/openvidu', require('./openvidu/openvidu'));



// let server1 = https.createServer(options,app).listen(PORT, function () {      
//     logger.info(`App running on port ${PORT}`);
//     console.log(`App running on port ${PORT}`);
// });




