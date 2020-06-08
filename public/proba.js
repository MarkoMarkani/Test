{
    "description": "Notify Perseo when typeEvent changes",
    "subject": {
        "entities": [{
            "idPattern": ".*",
            "type": "sensor"
        }],
        "condition": {
            "attrs": [
                "typeEvent"
            ]
        }
    },
    "notification": {
        "http": {
            "url": "http://perseo:9090/notices"
        },
        "attrs": [
            "typeEvent",
            "id",
            "id_accumulator"
        ]
    },
    "expires": "2040-06-30T14:00:00.00Z"
}


{
    "name":"changeInAcumulator",
    "text":"select \"changeInAcumulator\" as ruleName, ev.id_accumulator? as id_accumulator, ev.typeEvent? as typeEvent from pattern [every ev=iotEvent(type=\"sensor\")]",
    "action":{
       "type":"update",
       "parameters":{
           "id":"${id_accumulator}",
           "type":"accumulator",
           "attributes": [
                 {
                 "name":"action",
                 "value":"${typeEvent}"
                 }
           ]
       }
    }
 }


 {
    "description": "Notify Perseo when accumulator changes",
    "subject": {
      "entities": [
        {
          "idPattern": ".*",
          "type": "accumulator"
        }
      ],
      "condition": {
        "attrs": [
          "action"
        ]
      }
    },
    "notification": {
      "http": {
        "url": "http://perseo:9090/notices"
      },
      "attrs": [
        "id",
        "free",
        "used",
        "action"
      ]
    },
    "expires": "2040-06-30T14:00:00.00Z"
  }



  {
    "name":"updateAcumulator",
    "text":"select \"updateAcumulator\" as ruleName, ev.id? as id, case cast(cast(ev.action?,String),float) when 1 then cast(cast(ev.free?,String),float)-1 else cast(cast(ev.free?,String),float)+1 end as free, case cast(cast(ev.action?,String),float) when 1 then cast(cast(ev.used?,String),float)+1 else cast(cast(ev.used?,String),float)-1 end as used from pattern [every ev=iotEvent(type=\"accumulator\")]",
    "action":{
       "type":"update",
       "parameters":{
           "id":"${id}",
           "type":"accumulator",
           "attributes": [
                 {
                 "name":"free",
                 "value":"${free}"
                 },
                 {
                 "name":"used",
                 "value":"${used}"
                 } 
           ]
       }
    }
 }
