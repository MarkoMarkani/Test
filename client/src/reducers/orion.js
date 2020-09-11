import { GET_ALL_ENTITIES,GET_321_ENTITIES,GET_301_ENTITIES,GET_CAMERA_ENTITIES } from '../actions/types';

const initialState = {
  entities: [],
  loading: true,
  error: {},
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case GET_ALL_ENTITIES:
      return {
        ...state,
        entities: payload,
        loading: false,
      };
    case GET_321_ENTITIES:
      return {
        ...state,
        entities: payload,
        loading: false,
      };
    case GET_301_ENTITIES:
      return {
        ...state,
        entities: payload,
        loading: false,
      };
    case GET_CAMERA_ENTITIES:
      return {
        ...state,
        entities: payload,
        loading: false,
      };
    default:
      return state;
  }
}
