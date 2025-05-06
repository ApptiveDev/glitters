import { Image, Modal, Text, View } from 'react-native';

import BlueBackground from '@/assets/images/blue_background.png';
import colors from '@/types/colors';

const Loading = () => {
  return (
    <Modal style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Image
        source={BlueBackground}
        resizeMode="cover"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '100%',
        }}
      />
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 24 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: colors.text.white }}>어쩌면 반짝이가 당신의 글을</Text>
        <Text style={{ fontSize: 20, color: colors.text.white, fontWeight: 'bold' }}>기다리고 있을지 몰라요.</Text>
      </View>
    </Modal>
  );
};

export default Loading;
