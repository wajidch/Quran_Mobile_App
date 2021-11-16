import { Appbar} from 'react-native-paper';
import React from 'react';
import { INavigation } from '../interfaces/navigationInterface';
function CustomNavigationBar({ navigation, back }:INavigation) {
    return (
      <Appbar.Header>
        {back ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
        <Appbar.Content title="Hafiz Speech Recognition Platform" />
      </Appbar.Header>
    );
  }

export default CustomNavigationBar;