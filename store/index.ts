import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import { thunk } from "redux-thunk";
import { userReducer } from "./reducers/userReducers";

// Combine tous les reducers
const rootReducer = combineReducers({
  user: userReducer,
});

// Pour activer les DevTools Redux (optionnel)
const composeEnhancers =
  process.env.NODE_ENV !== "production" &&
  typeof window !== "undefined" &&
  (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    : compose;

// Création du store
const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk))
);

// Types pour TypeScript
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export default store;
