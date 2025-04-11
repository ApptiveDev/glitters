import { StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';

import colors from '@/types/colors';

interface ButtonProps {
  title: string;
  onPress: () => void;
  style?: object;
  variant?: 'primary' | 'disable';
  isKeyboardVisible?: boolean;
}

const baseStyle: ViewStyle = {
  width: '100%',
  height: 48,
  alignItems: 'center',
  justifyContent: 'center',
};

const buttonStyles = StyleSheet.create({
  primary: {
    ...baseStyle,
    backgroundColor: colors.yellow.dark,
  },
  disable: {
    ...baseStyle,
    backgroundColor: colors.gray.light,
  },
});

const testStyles = StyleSheet.create({
  primary: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.background,
  },
  disable: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.text.gray,
  },
});

export const CommonButton = ({ title, onPress, style = {}, variant = 'primary', isKeyboardVisible }: ButtonProps) => {
  return (
    <TouchableOpacity
      style={[buttonStyles[variant], isKeyboardVisible ? { borderRadius: 0 } : { borderRadius: 12 }, style]}
      onPress={onPress}
    >
      <Text style={testStyles[variant]}>{title}</Text>
    </TouchableOpacity>
  );
};

export default CommonButton;
