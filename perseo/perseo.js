const e = require('express');
const express = require('express');
var rp = require('request-promise');
let config = require(`../config/config`);
const serverIp = config.serverIp;
const router = express.Router();

router.get('/getAllRules', async (req, res) => {
    let perseoResponse;
    let perseoBodyResponse;
    const perseoOptions = {
      method: 'GET',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Fiware-Service': 'a4blue',
        'Fiware-ServicePath': '/a4blueevents',
      },
      uri: `http://${serverIp}:9090/rules/`,
      resolveWithFullResponse: true,
    };
  
    try {
      perseoResponse = await rp(perseoOptions);
      perseoBodyResponse = JSON.parse(perseoResponse.body);
      return res.json(perseoBodyResponse.data);
    } catch (err) {
      console.log(err);
      return res.status(400).json('Error is present in fetching all the rules'); 
    }
  });



  router.post('/addFirstRule', async (req, res) => {
    //console.log(req.body);
    const{
      ruleName,
      class_names,
      minScores,
      maxScores,
      interval,
      count
    }=req.body;

    let perseoResponse;
    let perseoBodyResponse;
    const perseoOptions = {
      method: 'POST',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        'Fiware-Service': 'a4blue',
        'Fiware-ServicePath': '/a4blueevents',
      },
      uri: `http://${serverIp}:9090/rules/`,
      resolveWithFullResponse: true,
      json: true,
      body: {
        "name": ""+ruleName+"",
        "text": "select *, ev.scores? as scores, ev.class_names? as class_names, ev.TimeInstant? as TimeInstant, count(*) as count,  avg(cast(ev.scores?,float)) as avgScores, ev.id? as id from pattern [every ev=iotEvent(cast(cast(scores?,string),float) between "+minScores+" and "+maxScores+", cast(class_names?,string) like \""+class_names+"\"  and type=\"TOP321_FACE_RECO_DONE\")].win:time("+interval+" minute) group by ev.class_names? having count(ev.class_names?) > "+count+" ",
     "action":{
          "type":"post",
          "template":"{ ${class_names},${count}}",
          "parameters":{
             "url": "http://"+serverIp+":5000/api/kafka321/perseoRule1", 
             "method": "POST",
             "headers": {
                "Content-Type":"application/json",
                "Accept":"application/json",
                "Fiware-Service":"a4blue",
                "Fiware-ServicePath":"/a4blueevents"
             },
             "qs": {
                "id": "${id}"
             },
               "json": {
                   "id": "${id}",
                   "class_names": "${class_names}",
                   "count": "${count}",
                   "avg" : "${avgScores}"
                   
                }
          }
       }
    }
    };
  
    try {
      perseoResponse = await rp(perseoOptions);
      perseoBodyResponse = perseoResponse.body;
      console.log("Rule#1 has been successfully posted to Perseo core");
      return res.json(perseoBodyResponse.data);
    } catch (err) {
      console.log(err.name + err.message);
      return res.status(400).json('Error is present in adding Rule#1'); 
    }
  }); 



router.post('/addSecondRule', async (req, res) => {
    //console.log(req.body);
    const{
      ruleName,
      class_names,
      minScores,
      maxScores,
      minCamLatitude,
      maxCamLatitude,
      minCamLongitude,
      maxCamLongitude,
      interval,
      count
    }=req.body;

    let perseoResponse;
    let perseoBodyResponse;
    const perseoOptions = {
      method: 'POST',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        'Fiware-Service': 'a4blue',
        'Fiware-ServicePath': '/a4blueevents',
      },
      uri: `http://${serverIp}:9090/rules/`,
      resolveWithFullResponse: true,
      json: true,
      body: {
        "name": ""+ruleName+"",
        "text": "select *, ev.id? as id, ev.class_names? as class_names,  ev.scores? as scores, ev.deviceId? as deviceId, ev.camLatitude? as camLatitude, ev.camLongitude? as camLongitude, count(*) as count from pattern [every ev=iotEvent(cast(cast(camLatitude?,string),float) between "+minCamLatitude+" and "+maxCamLatitude+", cast(cast(camLongitude?,string),float) between "+minCamLongitude+" and "+maxCamLongitude+", cast(cast(scores?,string),float) between "+minScores+" and "+maxScores+", cast(class_names?,string) like \""+class_names+"\" and type=\"TOP321_FACE_RECO_DONE\")].win:time("+interval+" day) group by ev.class_names? having count(ev.class_names?) > "+count+"",
     "action":{
          "type":"post",
          "template":"{ ${id},${camLatitude}}", 
          "parameters":{
             "url": "http://"+serverIp+":5000/api/kafka321/perseoRule2",
             "method": "POST",
             "headers": {
                "Content-Type":"application/json",
                "Accept":"application/json",
                "Fiware-Service":"a4blue",
                "Fiware-ServicePath":"/a4blueevents"
             },
             "qs": {
                "id": "${id}"
             },
               "json": {
                   "id": "${id}",
                   "minLatitude":""+minCamLatitude+"",
                   "maxLatitude":""+maxCamLatitude+"",
                   "minLongitude":""+minCamLongitude+"",
                   "maxLongitude":""+maxCamLongitude+"",
                   "minScores":""+minScores+"",
                   "maxScores":""+maxScores+"",
                   "deviceId": "${deviceId}",
                   "camLatitude": "${camLatitude}",
                   "camLongitude": "${camLongitude}",
                   "class_names": "${class_names}",
                   "count": "${count}"
                }
          }
       }
    }
    };
  
    try {
      perseoResponse = await rp(perseoOptions);
      perseoBodyResponse = perseoResponse.body;
      console.log("Rule#2 has been successfully posted to Perseo core");
      return res.json(perseoBodyResponse.data);
    } catch (err) {
      console.log(err.name + err.message);
      return res.status(400).json('Error is present in adding Rule#2'); 
    }
  });

  
  router.post('/addThirdRule', async (req, res) => {
    //console.log(req.body);
    const{
      ruleName,
      class_names,
      minScores,
      maxScores,
      minCamLatitude,
      maxCamLatitude,
      minCamLongitude,
      maxCamLongitude,
      interval,
      count
    }=req.body;

    let perseoResponse;
    let perseoBodyResponse;
    const perseoOptions = {
      method: 'POST',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        'Fiware-Service': 'a4blue',
        'Fiware-ServicePath': '/a4blueevents',
      },
      uri: `http://${serverIp}:9090/rules/`, 
      resolveWithFullResponse: true,
      json: true,
      body: {
        "name": ""+ruleName+"",
        "text": "select *, ev.id? as id, ev.class_names? as class_names,  ev.scores? as scores, ev.deviceId? as deviceId, ev.camLatitude? as camLatitude, ev.camLongitude? as camLongitude, count(*) as count from pattern [every ev=iotEvent(cast(cast(camLatitude?,string),float) between "+minCamLatitude+" and "+maxCamLatitude+", cast(cast(camLongitude?,string),float) between "+minCamLongitude+" and "+maxCamLongitude+", cast(cast(scores?,string),float) between "+minScores+" and "+maxScores+", cast(class_names?,string) like \""+class_names+"\" and type=\"TOP321_FACE_RECO_DONE\")].win:time("+interval+" day) group by ev.class_names? having count(ev.class_names?) > "+count+"",
     "action":{
          "type":"post",
          "template":"{ ${id},${camLatitude}}", 
          "parameters":{
             "url": "http://"+serverIp+":5000/api/kafka321/perseoRule3",
             "method": "POST",
             "headers": {
                "Content-Type":"application/json",
                "Accept":"application/json",
                "Fiware-Service":"a4blue",
                "Fiware-ServicePath":"/a4blueevents"
             },
             "qs": {
                "id": "${id}"
             },
               "json": {
                   "id": "${id}",
                   "minLatitude":""+minCamLatitude+"",
                   "maxLatitude":""+maxCamLatitude+"",
                   "minLongitude":""+minCamLongitude+"",
                   "maxLongitude":""+maxCamLongitude+"",
                   "minScores":""+minScores+"",
                   "maxScores":""+maxScores+"",
                   "deviceId": "${deviceId}",
                   "camLatitude": "${camLatitude}",
                   "camLongitude": "${camLongitude}",
                   "class_names": "${class_names}",
                   "class_names_group": class_names.split(",").map(xn=>xn.trim()),
                   "count": "${count}"
                }
          }
       }
    }
    };
  
    try {
      perseoResponse = await rp(perseoOptions);
      perseoBodyResponse = perseoResponse.body;
      console.log("Rule#3 has been successfully posted to Perseo core");
      return res.json(perseoBodyResponse.data);
    } catch (err) {
      console.log(err.name + err.message);
      return res.status(400).json('Error is present in adding Rule#3'); 
    }
  });

  router.post('/addFourthRule', async (req, res) => {
    //console.log(req.body);
    const{
      ruleName,
      class_names,
      minScores,
      maxScores,
      minCamLatitude,
      maxCamLatitude,
      minCamLongitude,
      maxCamLongitude,
      interval,
      count
    }=req.body;

    let perseoResponse;
    let perseoBodyResponse;
    const perseoOptions = {
      method: 'POST',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        'Fiware-Service': 'a4blue',
        'Fiware-ServicePath': '/a4blueevents',
      },
      uri: `http://${serverIp}:9090/rules/`,
      resolveWithFullResponse: true,
      json: true,
      body: {
        "name": ""+ruleName+"",
        "text": "select *, ev.id? as id, ev.class_names? as class_names,  ev.scores? as scores, ev.deviceId? as deviceId, ev.camLatitude? as camLatitude, ev.camLongitude? as camLongitude, count(*) as count from pattern [every ev=iotEvent(cast(cast(camLatitude?,string),float) between "+minCamLatitude+" and "+maxCamLatitude+", cast(cast(camLongitude?,string),float) between "+minCamLongitude+" and "+maxCamLongitude+", cast(cast(scores?,string),float) between "+minScores+" and "+maxScores+", cast(class_names?,string) like \""+class_names+"\" and type=\"TOP321_FACE_RECO_DONE\")].win:time("+interval+" day) group by ev.class_names? having count(ev.class_names?) > "+count+"",
     "action":{
          "type":"post",
          "template":"{ ${id},${camLatitude}}", 
          "parameters":{
             "url": "http://"+serverIp+":5000/api/kafka321/perseoRule4",
             "method": "POST",
             "headers": {
                "Content-Type":"application/json",
                "Accept":"application/json",
                "Fiware-Service":"a4blue",
                "Fiware-ServicePath":"/a4blueevents"
             },
             "qs": {
                "id": "${id}"
             },
               "json": {
                   "id": "${id}",
                   "minLatitude":""+minCamLatitude+"",
                   "maxLatitude":""+maxCamLatitude+"",
                   "minLongitude":""+minCamLongitude+"",
                   "maxLongitude":""+maxCamLongitude+"",
                   "minScores":""+minScores+"",
                   "maxScores":""+maxScores+"",
                   "deviceId": "${deviceId}",
                   "camLatitude": "${camLatitude}",
                   "camLongitude": "${camLongitude}",
                   "class_names": "${class_names}",
                   "count": "${count}"
                }
          }
       }
    }
    };
  
    try {
      perseoResponse = await rp(perseoOptions);
      perseoBodyResponse = perseoResponse.body;
      console.log("Rule#4 has been successfully posted to Perseo core");
      return res.json(perseoBodyResponse.data);
    } catch (err) {
      console.log(err.name + err.message);
      return res.status(400).json('Error is present in adding Rule#4'); 
    }
  });


module.exports = router;