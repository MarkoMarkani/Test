import axios from 'axios';
import { GET_ALL_ENTITIES, ORION_ERROR } from './types';

const api = axios.create({
  baseURL: 'http://217.172.12.192:1026/v2/entities',
  headers: {
    'Content-Type': 'application/json',
    'Fiware-Service': 'a4blue',
    'Fiware-ServicePath': '/a4blueevents',
  },
  resolveWithFullResponse: true
});

// Get Entities
export const getAllEntities = () => async (dispatch) => {
  try {
    const res = await api.get('?options=keyValues&limit=1000');

    dispatch({
      type: GET_ALL_ENTITIES,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: ORION_ERROR
    });
  }
};
