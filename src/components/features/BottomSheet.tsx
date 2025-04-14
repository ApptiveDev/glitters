import { useEffect, useState } from 'react';
import { Keyboard, Pressable, useWindowDimensions } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { useKeyboardVisible } from '@/hooks/useKeyboardVisible';
import colors from '@/types/colors';

interface CustomBottomSheetProps {
  children: React.ReactNode;
  isVisible: boolean;
  onClose?: () => void;
  height?: number;
  isKeyboardVisible?: boolean;
}

const CustomBottomSheet = ({
  children,
  isVisible,
  onClose,
  height = 200,
  isKeyboardVisible = false,
}: CustomBottomSheetProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const screenHeight = useWindowDimensions().height;
  const top = useSharedValue(screenHeight);
  const { keyboardHeight } = useKeyboardVisible();
  const padding = isKeyboardVisible ? keyboardHeight - 224 : 0;

  useEffect(() => {
    if (isVisible) {
      setIsMounted(true);
      top.value = withTiming(screenHeight - (height + 70) - padding, {
        duration: 300,
      });
    } else {
      top.value = withTiming(screenHeight, {
        duration: 500,
      });
      const timeout = setTimeout(() => {
        setIsMounted(false);
      }, 500);
      return () => clearTimeout(timeout);
    }
    return undefined;
  }, [height, isVisible, padding, screenHeight, top]);

  const animatedStyle = useAnimatedStyle(() => ({
    top: top.value,
  }));

  if (!isMounted) return null;

  const onPress = () => {
    if (isKeyboardVisible) {
      Keyboard.dismiss();
    } else {
      onClose?.();
    }
  };

  return (
    <>
      <Pressable
        onPress={onPress}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 99,
        }}
      />
      <Animated.View
        style={[
          {
            position: 'absolute',
            left: 0,
            right: 0,
            height: isKeyboardVisible ? screenHeight - keyboardHeight : height,
            backgroundColor: colors.background,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            borderTopWidth: 24,
            borderTopColor: colors.background,
            zIndex: 100,
            paddingHorizontal: 24,
            paddingBottom: isKeyboardVisible ? padding : 24,
          },
          animatedStyle,
        ]}
      >
        {children}
      </Animated.View>
    </>
  );
};

export default CustomBottomSheet;
