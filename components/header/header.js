import React from 'react';
import { Appbar } from 'react-native-paper';

const Header = ({ title, noBack }) => (
  <Appbar.Header>
    {!noBack && <Appbar.BackAction onPress={() => {}} />}
    <Appbar.Content title={title} />
  </Appbar.Header>
);

export default Header;
