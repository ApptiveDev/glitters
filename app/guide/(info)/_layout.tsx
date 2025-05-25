import { router, Slot, usePathname } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import CaretLeftIcon from '@/assets/icons/caret_left.svg';
import { Spacing } from '@/components/common/Spacing';
import colors from '@/types/colors';

export const InfoLayout = () => {
  const currentPath = usePathname();
  const [prevPageName, setPrevPageName] = useState<string | null>(null);

  const handleBackPress = () => {
    router.back();
  };

  useEffect(() => {
    if (currentPath === '/guide') {
      setPrevPageName(null);
      return;
    }
    if (currentPath === '/guide/help') {
      setPrevPageName('마이페이지');
    } else if (
      currentPath === '/guide/TermsOfService' ||
      currentPath === '/guide/PrivacyPolicy' ||
      currentPath === '/guide/HelpCenter'
    ) {
      setPrevPageName('도움말');
    }
  }, [currentPath]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.backgroundmypage,
      }}
    >
      <TouchableOpacity style={{ flexDirection: 'row', gap: 4, alignItems: 'center' }} onPress={handleBackPress}>
        <CaretLeftIcon />
        <Text
          style={{
            fontSize: 10,
            color: colors.text.gray,
          }}
        >
          {prevPageName === null ? '마이페이지' : prevPageName}
        </Text>
      </TouchableOpacity>
      <Spacing height={20} />
      <Slot />
    </View>
  );
};

export default InfoLayout;
