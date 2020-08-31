require('dotenv').config();
module.exports = {
    port: process.env.PORT,
    serverIp: process.env.SERVERIP,
    awsIp: process.env.AWSIP 
  };