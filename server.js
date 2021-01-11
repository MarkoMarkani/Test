// Node imports
const c = require('config');
let express = require('express');
let app = express(); 
app.use(express.json());
const path = require('path');
let config=require(`./config/config`);
let connectMongo = require('./config/db');
let connectOracle = require('./config/db');
let logger = require("./config/logger");

// Connect Database
//connectMongo();
//connectOracle();

//Define routes
app.use('/api/kafka321', require('./kafka/321'));
app.use('/api/kafka301', require('./kafka/301'));
app.use('/api/streaming', require('./streaming/streaming'));
app.use('/api/perseo', require('./perseo/perseo'));
//app.use('/api/auth', require('./auth/auth'));

//app.use(express.static(__dirname + '/public')); // Set the static files location //modify

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

let PORT = config.port || 5001;
//console.log(process.env)
app.listen(PORT, function () {      
  logger.info(`App running on port ${PORT}`);
  console.log(`App running on port ${PORT}`);
});








//console.log(`${process.cwd()}\\public\\recordings\\`)

//const axios = require('axios');
//let https = require('https');
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




