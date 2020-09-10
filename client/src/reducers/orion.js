import { GET_ALL_ENTITIES } from '../actions/types';

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
        loading: false
      };
    default:
      return state;
  }
}
