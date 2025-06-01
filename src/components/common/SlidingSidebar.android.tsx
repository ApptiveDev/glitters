import { useEffect, useRef } from 'react';
import { Animated, Dimensions, Modal, Pressable, View } from 'react-native';

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
  const { insetBottom } = useLayout();
  console.log("here")

  return (
    <Modal visible={visible} animationType="none" transparent>
      <Pressable onPress={onClose} style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' }} />
      <View
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          paddingBottom: insetBottom,
          right: 0,
          width,
          backgroundColor: colors.backgroundmypage,
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
      </View>
    </Modal>
  );
};

export default SlidingSidebar;
