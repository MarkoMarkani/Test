require('dotenv').config();
module.exports = {
    port: process.env.PORT,
    serverIp: process.env.SERVERIP,
    kafkaIp: process.env.KAFKAIP,
    orionPort: process.env.ORIONPORT
  };