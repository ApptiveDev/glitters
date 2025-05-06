import { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Props {
  children: ReactNode;
  isKeyboardVisible?: boolean;
  style?: ViewStyle;
}

export const BottomButtonContainer = ({ children, isKeyboardVisible = false, style }: Props) => {
  const insets = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      style={{
        position: 'absolute',
        width: '100%',
        bottom: 0,
      }}
    >
      <View
        style={[
          {
            paddingBottom: insets.bottom + 24,
            paddingHorizontal: isKeyboardVisible ? 0 : 28,
          },
          style,
        ]}
      >
        {children}
      </View>
    </KeyboardAvoidingView>
  );
};

export default BottomButtonContainer;
