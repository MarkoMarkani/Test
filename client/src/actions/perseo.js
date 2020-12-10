import axios from 'axios';
import { GET_ALL_RULES, ADD_FIRST_RULE, ADD_SECOND_RULE, ADD_THIRD_RULE, ADD_FOURTH_RULE, PERSEO_ERROR } from './types';
import { setAlert } from './alert';

//We will put dynamic data instead of the server address
const api = axios.create({
    baseURL: 'api/perseo',
    headers: {
      'Content-Type': 'application/json'
    },
    resolveWithFullResponse: true
  });

  // Get all the rules stored in Perseo
export const getAllRules = () => async (dispatch) => {
    try {
      const res = await api.get('/getAllRules');
        dispatch({
        type: GET_ALL_RULES,
        payload: res.data,
      });
    } catch (err) {
      dispatch({
        type: PERSEO_ERROR
      });
      console.error(err);
    }
  };

  export const addFirstRule = (formData) => async (dispatch) => {
    try {
      const res = await api.post('/addFirstRule',formData);
        dispatch({
        type: ADD_FIRST_RULE,
        payload: res.data,
      });
      dispatch(setAlert('Rule has been added successfully', 'success'));
      console.log('addFirstRule action has been triggered successfully!');
    } catch (err) {
      dispatch({
        type: PERSEO_ERROR
      });
      dispatch(setAlert(err.message, 'danger'));
      console.error(err);
    }
  };

  export const addSecondRule = (formData) => async (dispatch) => {
    try {
      const res = await api.post('/addSecondRule',formData);
        dispatch({
        type: ADD_SECOND_RULE,
        payload: res.data,
      });
      dispatch(setAlert('Rule has been added successfully', 'success'));
      console.log('addSecondRule action has been triggered successfully!');
    } catch (err) {
      dispatch({
        type: PERSEO_ERROR
      });
      dispatch(setAlert(err.message, 'danger'));
      console.error(err);
    }
  };

  export const addThirdRule = (formData) => async (dispatch) => {
    try {
      const res = await api.post('/addThirdRule',formData);
        dispatch({
        type: ADD_THIRD_RULE,
        payload: res.data,
      });
      dispatch(setAlert('Rule has been added successfully', 'success'));
      console.log('addThirdRule action has been triggered successfully!');
    } catch (err) {
      dispatch({
        type: PERSEO_ERROR
      });
      dispatch(setAlert(err.message, 'danger'));
      console.error(err);
    }
  };

  export const addFourthRule = (formData) => async (dispatch) => {
    try {
      const res = await api.post('/addFourthRule',formData);
        dispatch({
        type: ADD_FOURTH_RULE,
        payload: res.data,
      });
      dispatch(setAlert('Rule has been added successfully', 'success'));
      console.log('addFourthRule action has been triggered successfully!');
    } catch (err) {
      dispatch({
        type: PERSEO_ERROR
      });
      dispatch(setAlert(err.message, 'danger'));
      console.error(err);
    }
  };