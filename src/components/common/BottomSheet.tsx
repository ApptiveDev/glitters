import { useEffect, useState } from 'react';
import { Keyboard, Pressable } from 'react-native';
import Animated, { runOnUI, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { useLayout } from '@/contexts/LayoutContext';
import { useKeyboardVisible } from '@/hooks/useKeyboardVisible';
import colors from '@/types/colors';

interface CustomBottomSheetProps {
  children: React.ReactNode;
  isVisible: boolean;
  onClose?: () => void;
  height?: number;
  isKeyboardVisible?: boolean;
  blockOutsidePress?: boolean;
}

const CustomBottomSheet = ({
  children,
  isVisible,
  onClose,
  height = 200,
  isKeyboardVisible = false,
  blockOutsidePress = false,
}: CustomBottomSheetProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const { safeHeight, insetBottom } = useLayout();
  const { keyboardHeight } = useKeyboardVisible();

  const BOTTOM_OFFSET = 96 - insetBottom;
  const translateY = useSharedValue(safeHeight);

  useEffect(() => {
    if (isVisible) {
      setIsMounted(true);
      runOnUI(() => {
        translateY.value = withTiming(0, { duration: 300 });
      })();
    } else {
      runOnUI(() => {
        translateY.value = withTiming(safeHeight - BOTTOM_OFFSET, { duration: 300 });
      })();
      const timeout = setTimeout(() => {
        setIsMounted(false);
      }, 300);
      return () => clearTimeout(timeout);
    }
    return undefined;
  }, [isVisible, safeHeight, BOTTOM_OFFSET, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  if (!isMounted) return null;

  const onPress = () => {
    if (isKeyboardVisible) {
      Keyboard.dismiss();
      setTimeout(() => {
        onClose?.();
      }, 100); // 키보드 내리는 시간 고려
    } else {
      onClose?.();
    }
  };

  return (
    <>
      <Pressable
        onPress={blockOutsidePress ? undefined : onPress}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 99,
          backgroundColor: blockOutsidePress ? 'rgba(0, 0, 0, 0.5)' : 'transparent',
        }}
      />
      <Animated.View
        style={[
          {
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: BOTTOM_OFFSET,
            height: isKeyboardVisible ? safeHeight - keyboardHeight : height + 40,
            backgroundColor: colors.background,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            borderTopWidth: 24,
            borderTopColor: colors.background,
            zIndex: 1000,
            paddingHorizontal: 24,
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
