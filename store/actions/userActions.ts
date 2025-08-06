import {
  USER_FETCH_REQUEST,
  USER_FETCH_SUCCESS,
  USER_FETCH_FAILURE,
  UserActionTypes,
  User,
} from "../types/userTypes";
import { Dispatch } from "redux";

export const fetchUser = (id: string) => {
  return async (dispatch: Dispatch<UserActionTypes>) => {
    try {
      dispatch({ type: USER_FETCH_REQUEST });

      const response = await fetch(`/api/users/${id}`);
      const data: User = await response.json();

      dispatch({ type: USER_FETCH_SUCCESS, payload: data });
    } catch (error: any) {
      dispatch({ type: USER_FETCH_FAILURE, payload: error.message });
    }
  };
};
