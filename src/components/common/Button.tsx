import { StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';

import GlitterIcon from '@/assets/icons/glitter.svg';
import colors from '@/types/colors';

interface ButtonProps {
  title: string;
  onPress: () => void;
  style?: object;
  variant?: 'primary' | 'disable' | 'maps';
  isKeyboardVisible?: boolean;
}

const baseStyle: ViewStyle = {
  width: '100%',
  height: 48,
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'row',
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
  maps: {
    ...baseStyle,
    backgroundColor: colors.background,
    width: 130,
    height: 36,
    borderRadius: 36,
    paddingVertical: 8,
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
  maps: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.yellow.dark,
  },
});

export const CommonButton = ({ title, onPress, style = {}, variant = 'primary', isKeyboardVisible }: ButtonProps) => {
  return (
    <TouchableOpacity
      style={[isKeyboardVisible ? { borderRadius: 0 } : { borderRadius: 12 }, buttonStyles[variant], style]}
      onPress={onPress}
    >
      {variant === 'maps' && <GlitterIcon width={20} height={18} />}
      <Text style={testStyles[variant]}>{title}</Text>
    </TouchableOpacity>
  );
};

export default CommonButton;
