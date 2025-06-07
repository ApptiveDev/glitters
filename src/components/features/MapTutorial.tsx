import { router } from 'expo-router';
import { Image, View } from 'react-native';

import ExitIcon from '@/assets/icons/simple_exit_white.svg';
import MapTutorialImage from '@/assets/images/tutorial.png';
import { useLayout } from '@/contexts/LayoutContext';
import { setTutorialSeen } from '@/utils/asyncStorage';

export const MapTutorial = () => {
  const { insetTop } = useLayout();
  
  const handleExit = async () => {
    try {
      await setTutorialSeen();
      router.replace('/');
    } catch (error) {
      console.error('튜토리얼 상태 저장 실패:', error);
    }
  };

  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
        backgroundColor: 'rgba(68, 69, 72, 0.2)',
      }}
    >
      <Image
        source={MapTutorialImage}
        style={{
          flex: 1,
          width: '100%',
          height: '100%',
          resizeMode: 'cover',
        }}
      />
      <ExitIcon
        style={{
          position: 'absolute',
          top: insetTop + 20,
          left: 28,
          zIndex: 1001,
        }}
        width={32}
        height={32}
        onPress={handleExit}
      />
    </View>
  );
};

export default MapTutorial;
