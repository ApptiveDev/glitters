import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, Easing, SafeAreaView, Text } from 'react-native';

import { createMarker } from '@/api/markers';
import Heart from '@/assets/icons/heart.svg';
import { CommonButton } from '@/components/common/Button';
import { Heading } from '@/components/common/Heading';
import { KeyboardScrollContainer } from '@/components/common/KeyboardScrollContainer';
import { Spacing } from '@/components/common/Spacing';
import TextArea from '@/components/common/TextArea';
import { usePost } from '@/contexts/PostContext';
import { useFormFields } from '@/hooks/useFormFields';
import colors from '@/types/colors';

export const Write = () => {
  const { formFields, setFieldValue } = useFormFields();
  const { post } = usePost();

  const translateY = useRef(new Animated.Value(0)).current;

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
        isDeactivated: false,
        latitude: post.latitude,
        longitude: post.longitude,
      });
      router.replace('./complete');
    } catch (error) {
      console.error('Error creating marker:', error);
    }
  };

  const onTitleChangeText = (text: string) => {
    setFieldValue('title', text, (val) => val.length >= 2 && val.length <= 63);
  };

  const onContentChangeText = (text: string) => {
    setFieldValue('content', text, (val) => val.length >= 2 && val.length <= 255);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <KeyboardScrollContainer>
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
        />
        <Animated.View style={{ transform: [{ translateY }] }}>
          <Heart width={216} height={216} />
        </Animated.View>
        <TextArea
          value={formFields.content.value}
          maxLength={255}
          numberOfLines={4}
          multiline
          height={278}
          onChangeText={onContentChangeText}
          placeholder="내용을 입력하세요."
          isError={!formFields.content.isValid && formFields.content.isTouched}
          errorMessage="내용은 2자 이상 255자 이하로 입력해주세요."
        />
        <Spacing height={8} />
        <Text style={{ fontSize: 10, color: colors.text.lightgray }}>
          한 번 작성된 반짝이는 수정할 수 없어요. 24시간 동안만 유지됩니다.
        </Text>
        <CommonButton
          title="등록하기"
          onPress={handleButtonPress}
          variant={formFields.title.isValid && formFields.content.isValid ? 'primary' : 'disable'}
          style={{ marginTop: 16 }}
        />
      </KeyboardScrollContainer>
    </SafeAreaView>
  );
};

export default Write;
