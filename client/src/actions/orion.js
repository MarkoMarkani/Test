import axios from 'axios';
import { GET_PROCESSED_321_ENTITIES, ORION_ERROR,GET_321_ENTITIES,GET_301_ENTITIES,GET_CAMERA_ENTITIES,GET_321_ENTITIES_BY_DEVICEID } from './types';


const api = axios.create({
  baseURL: 'http://217.172.12.192:1026/v2/entities',
  headers: {
    'Content-Type': 'application/json',
    // 'Fiware-Service': 'a4blue',
    // 'Fiware-ServicePath': '/a4blueevents',
  },
  resolveWithFullResponse: true
});

const apiFiware = axios.create({
  baseURL: 'http://217.172.12.192:1026/v2/entities',
  headers: {
    'Content-Type': 'application/json',
    'Fiware-Service': 'a4blue',
    'Fiware-ServicePath': '/a4blueevents',
  },
  resolveWithFullResponse: true
});

// Get Entities processed by Fiware
export const getProcessed321Entities = () => async (dispatch) => {
  try {
    const res = await apiFiware.get('?options=keyValues&limit=1000&type=TOP321_FACE_RECO_EVENT_RULES');

    dispatch({
      type: GET_PROCESSED_321_ENTITIES,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: ORION_ERROR
    });
    console.log(err);
  }
};

//get Processed Entitied by Device Id
export const get321EntitiesByDeviceId = (id) => async (dispatch) => {
  try {
    const res = await apiFiware.get(`?type=TOP321_FACE_RECO_EVENT&options=keyValues&limit=1000`);

    dispatch({
      type: GET_321_ENTITIES_BY_DEVICEID,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: ORION_ERROR
    });
    console.log(err);
  }
};

// Get Face Reco Entities
export const get321Entities = () => async (dispatch) => {
  try {
    const res = await apiFiware.get('?options=keyValues&limit=1000&type=TOP321_FACE_RECO_EVENT');

    dispatch({
      type: GET_321_ENTITIES,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: ORION_ERROR
    });
    console.log(err);
  }
};

// Get Object Detect Entities
export const get301Entities = () => async (dispatch) => {
  try {
    const res = await apiFiware.get('?options=keyValues&limit=1000&type=TOP301_OBJECT_DETECT_EVENT');

    dispatch({
      type: GET_301_ENTITIES,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: ORION_ERROR
    });
    console.log(err);
  }
};

// Get All camera Entities
export const getCameraEntities = () => async (dispatch) => {
  try {
    const res = await api.get('?options=keyValues&limit=1000&type=IP_Camera');

    dispatch({
      type: GET_CAMERA_ENTITIES,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: ORION_ERROR
    });
    console.log(err);
  }
};