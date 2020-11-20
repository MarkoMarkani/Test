const express = require('express');
const router = express.Router();
let {sendRtmpToKafka, ffmpegRtmpConversionToMp4} = require('../kafka/401');


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



//Node Media Server implementation

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
    // ffmpegRtmpConversionToMp4(StreamPath);
    sendRtmpToKafka(StreamPath);
    console.log("This is the stream path " + StreamPath);
 
});

nms.on('postPublish', (id, StreamPath, args) => {
  //  console.log('[NodeEvent on postPublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
  console.log('NodeEvent on postPublish');
});

nms.on('donePublish', (id, StreamPath, args) => {
   // console.log('[NodeEvent on donePublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
   console.log('NodeEvent on donePublish');
   streamStatus=true;
   sendRtmpToKafka(StreamPath,null,streamStatus);
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
