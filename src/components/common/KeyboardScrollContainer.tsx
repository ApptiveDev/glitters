import { ReactNode } from 'react';
import { View, ViewStyle } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

interface Props {
  children: ReactNode;
  contentStyle?: ViewStyle;
  scrollStyle?: ViewStyle;
  viewStyle?: ViewStyle;
}

export const KeyboardScrollContainer = ({ children, contentStyle, scrollStyle, viewStyle }: Props) => {
  return (
    <KeyboardAwareScrollView
      style={[{ flex: 1 }, scrollStyle]}
      contentContainerStyle={[
        {
          flexGrow: 1,
          justifyContent: 'space-between',
          alignItems: 'center',
        },
        contentStyle,
      ]}
      keyboardShouldPersistTaps="handled"
      extraScrollHeight={20}
      enableOnAndroid
      enableResetScrollToCoords={false}
      scrollEnabled
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      bounces={false}
    >
      <View
        style={{
          width: '100%',
          justifyContent: 'flex-start',
          alignItems: 'center',
          paddingHorizontal: 28,
          paddingTop: 48,
          ...viewStyle,
        }}
      >
        {children}
      </View>
    </KeyboardAwareScrollView>
  );
};

export default KeyboardScrollContainer;
