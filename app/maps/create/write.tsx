import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Animated, Easing, KeyboardAvoidingView, Platform, SafeAreaView, Text, View } from 'react-native';
import { SvgProps } from 'react-native-svg';

import { createMarker } from '@/api/markers';
import CustomBottomSheet from '@/components/common/BottomSheet';
import { CommonButton } from '@/components/common/Button';
import { Heading } from '@/components/common/Heading';
import { KeyboardScrollContainer } from '@/components/common/KeyboardScrollContainer';
import { Spacing } from '@/components/common/Spacing';
import TextArea from '@/components/common/TextArea';
import { WritePolicyList } from '@/components/features/WritePolicyList';
import { useLayout } from '@/contexts/LayoutContext';
import { usePost } from '@/contexts/PostContext';
import { useFormFields } from '@/hooks/useFormFields';
import { useKeyboardVisible } from '@/hooks/useKeyboardVisible';
import colors from '@/types/colors';
import { threeDIcons } from '@/utils/threeDIcons';

export const Write = () => {
  const { formFields, setFieldValue } = useFormFields();
  const { post } = usePost();
  const { isKeyboardVisible } = useKeyboardVisible();
  const [bottomSheetVisible, setBottomSheetVisible] = useState(true);
  const [contentHeight, setContentHeight] = useState(300);
  const { safeHeight, insetBottom } = useLayout();

  const translateY = useRef(new Animated.Value(0)).current;

  const [randomIndex, setRandomIndex] = useState(0);

  const RandomIcon = useMemo(() => {
    const iconsArray = Object.values(threeDIcons) as React.FC<SvgProps>[];
    const index = Math.floor(Math.random() * iconsArray.length);
    setRandomIndex(index);
    return iconsArray[index];
  }, []);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(translateY, {
          toValue: -10,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [translateY]);

  const usePostMutation = () => {
    return useMutation({
      mutationFn: createMarker,
    });
  };

  const { mutateAsync } = usePostMutation();

  const handleButtonPress = async () => {
    try {
      if (!post) {
        console.error('Post is null or undefined');
        return;
      }

      await mutateAsync({
        title: formFields.title.value,
        content: formFields.content.value,
        address: post.address,
        latitude: post.latitude,
        longitude: post.longitude,
        iconIdx: randomIndex,
        markerIdx: post.markerIdx,
      });
      router.replace({
        pathname: './complete',
        params: { iconIndex: randomIndex },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
      Alert.alert('게시물 등록 실패', errorMessage);
    }
  };

  const onTitleChangeText = (text: string) => {
    setFieldValue('title', text, (val) => val.length >= 2 && val.length <= 63);
  };

  const onContentChangeText = (text: string) => {
    setFieldValue('content', text, (val) => val.length >= 2 && val.length <= 255);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background, height: safeHeight - 120 + insetBottom }}>
      <KeyboardScrollContainer paddingTop={12}>
        <Heading title="반짝이 기록하기" alignItems="center" />
        <Spacing height={16} />
        <TextArea
          numberOfLines={1}
          value={formFields.title.value}
          placeholder="제목을 입력하세요."
          onChangeText={onTitleChangeText}
          isError={!formFields.title.isValid && formFields.title.isTouched}
          errorMessage="제목은 2자 이상 63자 이하로 입력해주세요."
          maxLength={63}
          backgroundColor={colors.backgroundLight}
        />
        <Animated.View style={{ transform: [{ translateY }] }}>
          <RandomIcon width={216} height={216} />
        </Animated.View>
        <TextArea
          value={formFields.content.value}
          maxLength={255}
          numberOfLines={4}
          multiline
          height={240}
          onChangeText={onContentChangeText}
          placeholder="당신의 반짝이를 소개해주세요 (255자 이내)"
          isError={!formFields.content.isValid && formFields.content.isTouched}
          errorMessage="내용은 2자 이상 255자 이하로 입력해주세요."
          backgroundColor={colors.backgroundLight}
        />
        <Spacing height={8} />
        <Text style={{ fontSize: 10, color: colors.text.lightgray }}>
          한 번 작성된 반짝이는 수정할 수 없어요. 24시간 동안만 유지됩니다.
        </Text>
      </KeyboardScrollContainer>
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 120 - insetBottom}
        style={{
          position: 'absolute',
          width: '100%',
          bottom: Platform.OS === 'ios' ? 120 - insetBottom : 0,
          paddingHorizontal: isKeyboardVisible ? 0 : 28,
        }}
      >
        <CommonButton
          title="등록하기"
          onPress={handleButtonPress}
          variant={formFields.title.isValid && formFields.content.isValid ? 'primary' : 'disable'}
          style={{}}
          isKeyboardVisible={isKeyboardVisible}
        />
      </KeyboardAvoidingView>
      <CustomBottomSheet
        isVisible={bottomSheetVisible}
        onClose={() => setBottomSheetVisible(false)}
        height={contentHeight}
        isKeyboardVisible={false}
        blockOutsidePress
      >
        <View
          onLayout={(e) => {
            const measuredHeight = e.nativeEvent.layout.height;
            setContentHeight(measuredHeight);
          }}
          style={{ paddingVertical: 24, gap: 8 }}
        >
          <Text
            style={{
              fontSize: 24,
              fontWeight: 'bold',
              color: colors.text.white,
              textAlign: 'center',
            }}
          >
            아래 내용을 꼭 지켜주세요!
          </Text>
          <Spacing height={32} />
          <WritePolicyList />
          <Spacing height={28} />
          <Text
            style={{
              fontSize: 8,
              color: colors.text.lightgray,
              textAlign: 'center',
            }}
          >
            위의 사항을 위반한 게시물은 관리자가 임의로 삭제 조치를 취할 수 있습니다.
          </Text>
          <CommonButton
            title="동의하고 게시글 작성하러 가기"
            onPress={() => {
              setBottomSheetVisible(false);
            }}
            style={{ paddingVertical: 12 }}
            variant="primary"
          />
        </View>
      </CustomBottomSheet>
    </SafeAreaView>
  );
};

export default Write;
