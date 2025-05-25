import { router } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Animated, Easing, SafeAreaView, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SvgProps } from 'react-native-svg';

import { createMarker } from '@/api/markers';
import CaretLeftIcon from '@/assets/icons/caret_left.svg';
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
import colors from '@/types/colors';
import { showErrorAlert } from '@/utils/errorMessage';
import { markerIcons } from '@/utils/markerIcons';
import { festivalIcons, threeDIcons } from '@/utils/threeDIcons';

export const Write = () => {
  const { formFields, setFieldValue } = useFormFields();
  const { post } = usePost();
  const [bottomSheetVisible, setBottomSheetVisible] = useState(true);
  const [contentHeight, setContentHeight] = useState(300);
  const { safeHeight, insetBottom } = useLayout();

  const translateY = useRef(new Animated.Value(0)).current;

  const [randomIndex, setRandomIndex] = useState(0);

  const RandomIcon = useMemo(() => {
    if (markerIcons[post?.markerIdx ?? 0].name === 'festival') {
      const iconsArray = Object.values(festivalIcons) as React.FC<SvgProps>[];
      const index = Math.floor(Math.random() * 2);
      setRandomIndex(index);
      return iconsArray[index];
    }
    const iconsArray = Object.values(threeDIcons) as React.FC<SvgProps>[];
    const index = Math.floor(Math.random() * iconsArray.length);
    setRandomIndex(index);
    return iconsArray[index];
  }, [post?.markerIdx]);

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

  const handleButtonPress = async () => {
    try {
      if (!post) {
        return;
      }

      const data = await createMarker({
        title: formFields.title.value,
        content: formFields.content.value,
        address: post.address,
        latitude: post.latitude,
        longitude: post.longitude,
        iconIdx: randomIndex,
        markerIdx: post.markerIdx,
      });
      const { postId } = data;
      router.replace({
        pathname: './complete',
        params: { iconIndex: randomIndex, postId, markerIdx: post.markerIdx },
      });
    } catch (error) {
      showErrorAlert('오류', error);
    }
  };

  const onTitleChangeText = (text: string) => {
    setFieldValue('title', text, (val) => val.length >= 2 && val.length <= 63);
  };

  const onContentChangeText = (text: string) => {
    setFieldValue('content', text, (val) => val.length >= 2 && val.length <= 255);
  };

  const handleBackPress = () => {
    Alert.alert('작성을 취소하시겠습니까?', '지금까지 작성한 내용이 삭제됩니다.', [
      {
        text: '취소',
        style: 'cancel',
      },
      {
        text: '확인',
        onPress: () => router.back(),
      },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background, height: safeHeight - 120 + insetBottom }}>
      <Spacing height={12} />
      <View style={{ position: 'relative', width: '100%', height: 48, justifyContent: 'center' }}>
        <Heading title="반짝이 기록하기" alignItems="center" />
        <CaretLeftIcon
          style={{ position: 'absolute', left: 24, top: '50%', transform: [{ translateY: -12 }] }}
          onPress={handleBackPress}
        />
      </View>
      <ScrollView>
        <KeyboardScrollContainer paddingTop={12}>
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
          <Text style={{ fontSize: 10, color: colors.text.lightgray }}>
            한 번 작성된 반짝이는 수정할 수 없어요. 24시간 동안만 유지됩니다.
          </Text>
          <Spacing height={12} />
          <View
            style={{
              width: '100%',
              paddingBottom: insetBottom + 120,
            }}
          >
            <CommonButton
              title="등록하기"
              onPress={handleButtonPress}
              variant={formFields.title.isValid && formFields.content.isValid ? 'primary' : 'disable'}
              style={{}}
            />
          </View>
        </KeyboardScrollContainer>
      </ScrollView>
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
