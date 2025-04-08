import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  disableStyle?: object;
  style?: object;
  fontSize?: number;
}

export const CommonButton = ({
  title,
  onPress,
  disabled = false,
  style = {},
  disableStyle = {},
  fontSize = 16,
}: ButtonProps) => {
  const dynamicStyles = StyleSheet.create({
    buttonText: {
      fontSize,
    },
  });
  return (
    <TouchableOpacity style={[style, disabled && disableStyle]} onPress={onPress} disabled={disabled}>
      <Text style={dynamicStyles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

export default CommonButton;
