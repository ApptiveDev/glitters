import { useEffect } from 'react';
import { LayoutAnimation, StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';

import colors from '@/types/colors';

interface ButtonProps {
  title: string;
  onPress: () => void;
  style?: object;
  variant?: 'primary' | 'disable' | 'maps' | 'view';
  isKeyboardVisible?: boolean;
  fontSize?: number;
  buttonIcon?: React.ReactNode;
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
    flexShrink: 1,
    backgroundColor: colors.background,
    borderRadius: 36,
    paddingVertical: 8,
    paddingLeft: 12,
    paddingRight: 16,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    minHeight: 35,
  },
  view: {
    ...baseStyle,
    backgroundColor: '#4A5789',
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
    textAlign: 'center',
    borderWidth: 0,
  },
  view: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.text.white,
  },
});

export const CommonButton = ({
  title,
  onPress,
  style = {},
  variant = 'primary',
  isKeyboardVisible,
  fontSize = 12,
  buttonIcon = null,
}: ButtonProps) => {
  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, [title]);

  return (
    <TouchableOpacity
      style={[isKeyboardVisible ? { borderRadius: 0 } : { borderRadius: 12 }, buttonStyles[variant], style]}
      onPress={onPress}
      disabled={variant === 'disable'}
    >
      {buttonIcon}
      <Text style={[testStyles[variant], { fontSize }]}>{title}</Text>
    </TouchableOpacity>
  );
};

export default CommonButton;
