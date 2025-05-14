import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, SafeAreaView, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import { reportMarker } from '@/api/markers';
import CaretLeftIcon from '@/assets/icons/caret_left.svg';
import { CommonButton } from '@/components/common/Button';
import { Spacing } from '@/components/common/Spacing';
import TextArea from '@/components/common/TextArea';
import colors from '@/types/colors';

export const Report = () => {
  const [text, setText] = useState('');
  const { postId, chatroomId, reportType } = useLocalSearchParams() as {
    postId?: string;
    reportType: 'POST_REPORT' | 'CHATROOM_REPORT';
    chatroomId?: string;
  };
  const handleBackPress = () => {
    router.back();
  };

  const handleReportPress = async () => {
    try {
      console.log(postId, reportType);
      await reportMarker({
        postId: postId ? Number(postId) : undefined,
        chatroomId: chatroomId ? Number(chatroomId) : undefined,
        reason: text,
        reportType,
      });
      Alert.alert('신고가 완료되었습니다.', '24시간 이내에 담당자가 처리할 예정입니다.');
      router.back();
    } catch (error) {
      console.error('Error reporting marker:', error);
    }
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView>
        <View style={{ justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%' }}>
            <CaretLeftIcon width={24} height={24} onPress={handleBackPress} />
          </View>
          <Text style={{ fontSize: 16, color: colors.text.white }}>게시글 신고하기</Text>
          <Spacing height={24} />
          <TextArea
            value={text}
            maxLength={255}
            numberOfLines={4}
            multiline
            height={240}
            onChangeText={setText}
            placeholder="신고하는 이유를 작성해주세요 (255자 이내)"
            isError={text.length < 2 || text.length > 255}
            errorMessage="신고하는 이유를 작성해주세요."
            backgroundColor={colors.backgroundLight}
          />
          <Spacing height={40} />
          <CommonButton
            title="신고하기"
            onPress={handleReportPress}
            variant={text.length >= 2 && text.length <= 255 ? 'blue' : 'blueDisable'}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Report;
