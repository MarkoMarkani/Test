 const express = require('express');
 const router = express.Router();
 let kafka401 = require('../kafka/401');

//  var RtspServer = require('rtsp-streaming-server').default;
//  const rtspserver = new RtspServer({
//      serverPort: 5554, 
//      clientPort: 6554,
//      rtpPortStart: 10000,
//      rtpPortCount: 10000
//  });

 const NodeMediaServer = require('node-media-server');
 const nmsConfig = {
     rtmp: {
         port: 8002,
         chunk_size: 60000,
         gop_cache: true,
         ping: 30,
         ping_timeout: 60
     },
     http: {
         port: 8081,
         allow_origin: '*'
     }

 };
 var nms = new NodeMediaServer(nmsConfig);



 //RTSP SERVER IMPLEMENTATION

//  async function rtsprun() {
//      try {
//          await rtspserver.start();
//          console.log("Rtsp server is running");
//      } catch (e) {
//          console.error(e);
//      }
//  }

 //rtsprun();


 //NODE MEDIA SERVER METHODS

 nms.run();
 
 nms.on('preConnect', (id, args) => {
     //console.log('[NodeEvent on preConnect]', `id=${id} args=${JSON.stringify(args)}`);
     console.log('NodeEvent on preConnect');
 });

 nms.on('postConnect', (id, args) => {
     //console.log('[NodeEvent on postConnect]', `id=${id} args=${JSON.stringify(args)}`);
     console.log('NodeEvent on postConnect');
 });

 nms.on('doneConnect', (id, args) => {
   //  console.log('[NodeEvent on doneConnect]', `id=${id} args=${JSON.stringify(args)}`);
   console.log('NodeEvent on doneConnect');
 });

 nms.on('prePublish', (id, StreamPath, args) => {
    // console.log('[NodeEvent on prePublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
     console.log('NodeEvent on prePublish');
     kafka401.ffmpegConversionToMp4(StreamPath);
     //kafka401.sendRtmptoRtspKafka(StreamPath);

 });

 nms.on('postPublish', (id, StreamPath, args) => {
   //  console.log('[NodeEvent on postPublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
   console.log('NodeEvent on postPublish');
 });

 nms.on('donePublish', (id, StreamPath, args) => {
    // console.log('[NodeEvent on donePublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
    console.log('NodeEvent on donePublish');
 });

 nms.on('prePlay', (id, StreamPath, args) => {
    // console.log('[NodeEvent on prePlay]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
    console.log('NodeEvent on prePlay');
 });

 nms.on('postPlay', (id, StreamPath, args) => {
  //   console.log('[NodeEvent on postPlay]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
     console.log('NodeEvent on postPlay');
 });

 nms.on('donePlay', (id, StreamPath, args) => {
   //  console.log('[NodeEvent on donePlay]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
     console.log('NodeEvent on donePlay');
    
 });


 module.exports = router;