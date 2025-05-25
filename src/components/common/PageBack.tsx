import { router } from 'expo-router';
import React from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';

import CaretLeftIcon from '@/assets/icons/caret_left.svg';
import colors from '@/types/colors';

interface PageBackProps {
  text?: string;
}

export const PageBack = ({ text }: PageBackProps) => {
  const handleBackPress = () => {
    Alert.alert('이전 화면으로 돌아가시겠습니까?', '지금 작성중인 내용이 지워질 수 있어요', [
      {
        text: '아니요',
        style: 'cancel',
      },
      {
        text: '네',
        onPress: () => {
          router.back();
        },
      },
    ]);
  };
  return (
    <View
      style={{
        width: '100%',
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingHorizontal: 24,
      }}
    >
      <TouchableOpacity style={{ flexDirection: 'row', gap: 4, alignItems: 'center' }} onPress={handleBackPress}>
        <CaretLeftIcon />
        {text && (
          <Text
            style={{
              fontSize: 10,
              color: colors.text.lightblue,
            }}
          >
            {text}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default PageBack;
