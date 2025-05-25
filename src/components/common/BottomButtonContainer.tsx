import { ReactNode } from 'react';
import { KeyboardAvoidingView, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Props {
  children: ReactNode;
  style?: ViewStyle;
}

export const BottomButtonContainer = ({ children, style }: Props) => {
  const insets = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView>
      <View
        style={[
          {
            paddingBottom: insets.bottom + 24,
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
