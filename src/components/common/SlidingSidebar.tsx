import { useEffect, useRef } from 'react';
import { Animated, Dimensions, Modal, Pressable } from 'react-native';

import { useLayout } from '@/contexts/LayoutContext';
import colors from '@/types/colors';

interface SlidingSidebarProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  width?: number;
}

const SCREEN_WIDTH = Dimensions.get('window').width;

export const SlidingSidebar = ({ visible, onClose, children, width = SCREEN_WIDTH * 0.7 }: SlidingSidebarProps) => {
  const translateX = useRef(new Animated.Value(width)).current;
  const { insetBottom } = useLayout();

  useEffect(() => {
    if (!visible) {
      translateX.setValue(width);
    }
  }, [translateX, visible, width]);

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: visible ? 0 : width,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [translateX, visible, width]);

  return (
    <Modal visible={visible} animationType="none" transparent>
      <Pressable onPress={onClose} style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' }} />
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          paddingBottom: insetBottom,
          right: 0,
          width,
          backgroundColor: colors.backgroundmypage,
          transform: [{ translateX }],
          elevation: 5,
          shadowColor: '#000',
          shadowOffset: { width: 2, height: 0 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
          borderTopLeftRadius: 24,
          borderBottomLeftRadius: 24,
        }}
      >
        {children}
      </Animated.View>
    </Modal>
  );
};

export default SlidingSidebar;
