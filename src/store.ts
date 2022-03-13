import { createStore } from "redux";
import reducers from "./reducers";

import { persistStore, persistReducer } from "redux-persist";
import AsyncStorage from '@react-native-async-storage/async-storage';

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
};

const persistedReducer = persistReducer(persistConfig, reducers);
export const store = createStore(persistedReducer);
export const persistor = persistStore(store);
// export default () => {

//   return { store, persistor }
// }

// const store = createStore(reducers);
// export default store
