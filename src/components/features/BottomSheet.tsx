import { useEffect, useState } from 'react';
import { Keyboard, Pressable } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

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
  const { insetBottom, safeHeight, entireHeight } = useLayout();
  const top = useSharedValue(safeHeight);
  const { keyboardHeight } = useKeyboardVisible();
  const padding = isKeyboardVisible ? keyboardHeight - height : 0;

  useEffect(() => {
    if (isVisible) {
      setIsMounted(true);
      // 전체 높이 - content 높이 - padding - 96 ( 120에서 borderRadius 24 제외)
      top.value = withTiming(entireHeight - height - 40 - 96, {
        duration: 300,
      });
    } else {
      top.value = withTiming(entireHeight, {
        duration: 300,
      });
      const timeout = setTimeout(() => {
        setIsMounted(false);
      }, 300);
      return () => clearTimeout(timeout);
    }
    return undefined;
  }, [entireHeight, height, insetBottom, isVisible, padding, top]);

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
