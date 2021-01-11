import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";

const Dankmemes = () => {
  const [chartData, setChartData] = useState({});
  const [employeeSalary, setEmployeeSalary] = useState([]);
  const [employeeAge, setEmployeeAge] = useState([]);

  const chart = () => {
    let empSal = [];
    let empAge = [];
    axios
      .get("http://dummy.restapiexample.com/api/v1/employees")
      .then(res => {
        console.log(res);
        for (const dataObj of res.data.data) {
          empSal.push(parseInt(dataObj.employee_salary));
          empAge.push(parseInt(dataObj.employee_age));
        }
        //labels ovo dole horizontalno
        //data empSalary, vertikalno
        //posle preko useEffect-a poziva celu chart funkciju, a mi ne moramo deo sa useEffect-om, zato sto vec koristimo redux state
        //u chart-u se nalazi  setChartData, posle samo koristimo chartData da prikazemo to
        //useStete kod setEmployeeAge, setEmployeeSalary je nebitan, ne koristimo ga
        setChartData({
          labels: empAge,
          datasets: [
            {
              label: "level of thiccness",
              data: empSal,
              backgroundColor: ["rgba(75, 192, 192, 0.6)"],
              borderWidth: 4
            }
          ]
        });
      })
      .catch(err => {
        console.log(err);
      });
    console.log(empSal, empAge);
  };

  useEffect(() => {
    chart();
  }, []);
  return (
    <div className="App">
      <h1>Dankmemes</h1>
      <div>
        <Line
          data={chartData}
          options={{
            responsive: true,
            title: { text: "THICCNESS SCALE", display: true },
            scales: {
              yAxes: [
                {
                  ticks: {
                    autoSkip: true,
                    maxTicksLimit: 10,
                    beginAtZero: true
                  },
                  gridLines: {
                    display: false
                  }
                }
              ],
              xAxes: [
                {
                  gridLines: {
                    display: false
                  }
                }
              ]
            }
          }}
        />
      </div>
    </div>
  );
};

{ id: '5fb7ab5416a9050006a97aab',
    name: 'Perseo321FaceRuleUpdateSecondWithTime',
    text:'select "Perseo321FaceRuleUpdateSecondWithTime" as ruleName, *, ev.id? as id, ev.class_names? as class_names,  ev.scores? as scores, ev.deviceId? as deviceId, ev.camLatitude? as camLatitude, ev.camLongitude? as camLongitude, count(*) as count from pattern [every ev=iotEvent(cast(cast(camLatitude?,string),float) between 52.359318 and 52.380280, cast(cast(camLongitude?,string),float) between 4.877461 and 4.929934, cast(cast(scores?,string),float) between 0.81 and 0.99, cast(class_names?,string) like "Suspect2" and type="TOP321_FACE_RECO_DONE")].win:time(1 day) as timePeriod group by ev.class_names? having count(ev.class_names?) > 1',
    action:
      { type: 'post',
        template: '{ ${id},${camLatitude}}',
       parameters: [Object] },
     subservice: '/a4blueevents',
    service: 'a4blue',
     id: 'urn:ngsi-ld:PERSEO_RULES_LIST:undefined',
     type: 'PERSEO_RULES_LIST' }



let message={
  "header": {
    "topicName": "TOP321_FACE_RECO_DONE",
    "topicVer1": 1,
    "topicVer2": 0,
    "msgId": "dummy_id_00001",
    "sender": "FR",
    "sentUtc": "2020-12-07 11:20:07.027843",
    "status": "Test",
    "msgType": "Update",
    "source": "VMS",
    "scope": "Restricted",
    "caseId": "0"
  },
  "body": {
    "attachment": [
      {
        "mimeType": "video/mp4",
        "attachDesc": "New face detection results",
        "objectStoreId": "5fce0fe648bfa87b5183958f",
        "results": "{\"boxes\": [[0.6298507452011108, 0.7700653076171875, 0.7733434438705444, 0.9527148008346558]], \"scores\": [0.8909050226211548], \"class_names\": [\"Suspect 1\"], \"classes_id\": [11], \"timestamp_processing\": \"2020-12-07 11:20:05.570788\", \"ref_id\": [\"5f84381cbf5f11c52d871955\"], \"description\": [\"Person of interest: Suspect 1\"], \"processed_id\": \"5fce0fe648bfa87b5183957e\", \"frame_number\": \"\", \"deviceId\": \"cam-11\"}"
      }
    ],
    "description": "A face was detected"
  }
}









export default Dankmemes;
