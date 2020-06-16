// Node imports
let express = require('express');
let app = express(); 
const axios = require('axios');
let cors = require('cors');
let fs = require('fs');
let options = {
    key: fs.readFileSync('openvidukey.pem'),
    cert: fs.readFileSync('openviducert.pem')
};
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
// let server = app.listen(PORT, function () {      
//   logger.info(`App running on port ${PORT}`);
//   console.log(`App running on port ${PORT}`);
// });
let server = https.createServer(options,app).listen(PORT, function () {      
    logger.info(`App running on port ${PORT}`);
    console.log(`App running on port ${PORT}`);
});

   
  
app.post(     
    '/api/perseo321',      
    async (req, res) => {                 
      try {   
         // console.log("Here is request: " + JSON.stringify(req.body) + " " + typeof req.body);
          console.log("PERSEO HAS BEEN EXECUTED");
   
        res.json(req.body);
      } catch (err) {
        console.error(err.message);
        console.log(err);  
        res.status(500).send('Server Error');           
      }
    }   
  ); 

  



