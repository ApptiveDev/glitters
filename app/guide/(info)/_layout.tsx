import { router, Slot } from 'expo-router';
import { View } from 'react-native';

import CaretLeftIcon from '@/assets/icons/CaretLeft.svg';
import { Spacing } from '@/components/common/Spacing';
import colors from '@/types/colors';

export const InfoLayout = () => {
  const handleBackPress = () => {
    router.back();
  };
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}
    >
      <CaretLeftIcon onPress={handleBackPress} />
      <Spacing height={20} />
      <Slot />
    </View>
  );
};

export default InfoLayout;
