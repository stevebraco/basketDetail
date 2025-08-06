import {
  USER_FETCH_REQUEST,
  USER_FETCH_SUCCESS,
  USER_FETCH_FAILURE,
  UserState,
  UserActionTypes,
} from "../types/userTypes";

const initialState: UserState = {
  loading: false,
  data: null,
  error: null,
};

export const userReducer = (
  state = initialState,
  action: UserActionTypes
): UserState => {
  switch (action.type) {
    case USER_FETCH_REQUEST:
      return { ...state, loading: true };
    case USER_FETCH_SUCCESS:
      return { loading: false, data: action.payload, error: null };
    case USER_FETCH_FAILURE:
      return { loading: false, data: null, error: action.payload };
    default:
      return state;
  }
};
