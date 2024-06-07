import store from './app/store'
import { Provider } from 'react-redux'
import { Text } from 'react-native';
import AppBase from './AppBase';
import { MD3LightTheme as DefaultTheme, PaperProvider } from 'react-native-paper';
import LoginScreen from './screens/auth_screens/LoginScreen';
import { NavigationContainer } from '@react-navigation/native';

export default function App() {
  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: '#54C7EC',
      secondary: 'yellow',
    },
  };

  return (
    <PaperProvider theme={theme}>
      <Provider store={store}>
        <NavigationContainer>
          <AppBase />
        </NavigationContainer>
      </Provider>
    </PaperProvider >
  );
}