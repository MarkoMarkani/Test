import { GET_ALL_RULES, ADD_FIRST_RULE, ADD_SECOND_RULE, ADD_THIRD_RULE, ADD_FOURTH_RULE, PERSEO_ERROR } from '../actions/types';

const initialState = {
  rules: [],
  loading: true,
  error: {},
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case GET_ALL_RULES:
      return {
        ...state,
        rules: payload,
        loading: false,
      };
    case ADD_FIRST_RULE:
    case ADD_SECOND_RULE:
    case ADD_THIRD_RULE:
    case ADD_FOURTH_RULE:

      return {
        ...state,
        rules: [payload, ...state.rules],
        loading: false,
      };
    case PERSEO_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };
    default:
      return state;
  }
}
