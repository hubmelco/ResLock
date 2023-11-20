import * as React from 'react';
import { Switch } from 'react-native-paper';
import colors from '../static/colors';
import { ToggleProps } from '../types';

const Toggle = ({onPress}: ToggleProps) => {
  const [isSwitchOn, setIsSwitchOn] = React.useState(false);

  const onToggleSwitch = () => {
    setIsSwitchOn(!isSwitchOn);
    onPress(!isSwitchOn);
  }

  return (
    <Switch value={isSwitchOn} onValueChange={onToggleSwitch} color={colors.LIGHT_BLUE}/>
  );

};

export default Toggle;