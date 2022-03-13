import 'react-native-gesture-handler';
import * as React from 'react';
import {AppRegistry} from 'react-native';
import {DefaultTheme, Provider as PaperProvider} from 'react-native-paper';
import {name as appName} from './app.json';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {store, persistor} from './src/store';
import App from './App';
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'green',
    accent: 'yellow',
  },
};
export default function Main() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <PaperProvider theme={theme}>
          <App />
        </PaperProvider>
      </PersistGate>
    </Provider>
  );
}

AppRegistry.registerComponent(appName, () => Main);
