export const USER_FETCH_REQUEST = "USER_FETCH_REQUEST";
export const USER_FETCH_SUCCESS = "USER_FETCH_SUCCESS";
export const USER_FETCH_FAILURE = "USER_FETCH_FAILURE";

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface UserState {
  loading: boolean;
  data: User | null;
  error: string | null;
}

interface FetchUserRequestAction {
  type: typeof USER_FETCH_REQUEST;
}

interface FetchUserSuccessAction {
  type: typeof USER_FETCH_SUCCESS;
  payload: User;
}

interface FetchUserFailureAction {
  type: typeof USER_FETCH_FAILURE;
  payload: string;
}

export type UserActionTypes =
  | FetchUserRequestAction
  | FetchUserSuccessAction
  | FetchUserFailureAction;
