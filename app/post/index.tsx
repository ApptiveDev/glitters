import { queryClient } from 'app/_layout';
import { BlurView } from 'expo-blur';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { SvgProps } from 'react-native-svg';

import { addLike, deleteMarker } from '@/api/markers';
import { getPostById } from '@/api/posts';
import HeartIcon from '@/assets/icons/3d/heart_red.svg';
import LeftCaretIcon from '@/assets/icons/caret_left.svg';
import EyeIcon from '@/assets/icons/eye.svg';
import GlitterIcon from '@/assets/icons/glitter.svg';
import GlitterBlueIcon from '@/assets/icons/glitter_blue.svg';
import { CommonButton } from '@/components/common/Button';
import { Spacing } from '@/components/common/Spacing';
import { CustomTextArea } from '@/components/common/TextArea';
import colors from '@/types/colors';
import { GetPostResponseType } from '@/types/post';
import { threeDIcons } from '@/utils/threeDIcons';

export const PostPage = () => {
  const [post, setPost] = useState<GetPostResponseType | null>(null);
  const { postId } = useLocalSearchParams();
  const [overrideButtonText, setOverrideButtonText] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await getPostById({ postId: Number(postId) });
        setPost(response);
      } catch (error) {
        const errorMessage = (error as any)?.response?.data?.message || '알 수 없는 오류가 발생했습니다.';
        Alert.alert('오류', errorMessage);
      }
    };

    fetchPost();
  }, [postId]);

  const PostIcon = useMemo(() => {
    if (post?.iconIdx == null) return HeartIcon;

    const iconsArray = Object.values(threeDIcons) as React.FC<SvgProps>[];
    const index = Number(post.iconIdx);

    return iconsArray[index] ?? HeartIcon;
  }, [post?.iconIdx]);

  console.log('Post:', post);

  const getButtonText = (isWrittenBySelf: boolean, isLikedBySelf: boolean) => {
    if (isWrittenBySelf) {
      return '당신의 반짝이가 이 글을 읽고 있을 지도 몰라요.';
    }
    if (isLikedBySelf) {
      return '  마음에 들어온 반짝이에요';
    }
    return '  이 반짝이가 마음에 들어요';
  };

  const handleConfirmDelete = async () => {
    if (!post?.id) return;
    try {
      await deleteMarker(post?.id);
      await queryClient.invalidateQueries({ queryKey: ['markers'] });
      Alert.alert('삭제 완료', '반짝이가 삭제되었어요.');
    } catch {
      Alert.alert('삭제 중 문제가 발생했어요.');
    }
  };

  const goToReportPage = () => {
    router.push({
      pathname: '/report',
      params: {
        postId: post?.id,
        reportType: 'POST_REPORT',
      },
    });
  };

  const handleDeletePost = () => {
    if (post?.isWrittenBySelf) {
      Alert.alert('삭제하시겠어요?', '삭제된 반짝이는 다시 복구되지 않아요', [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '확인',
          onPress: () => handleConfirmDelete,
        },
      ]);
    } else {
      Alert.alert('신고하시겠어요?', '', [
        {
          text: '확인',
          onPress: goToReportPage,
        },
      ]);
    }
  };

  const onPressBottomButton = async () => {
    if (!post) return;
    if (post?.isWrittenBySelf) {
      Alert.alert('내가 쓴 글이에요.');
    } else {
      setOverrideButtonText(' 반짝반짝');
      await addLike(post.id);
      setTimeout(() => {
        setOverrideButtonText(null);
      }, 1000);
      setPost((prev) =>
        prev
          ? {
              ...prev,
              isLikedBySelf: true,
              likeCount: prev.likeCount + 1,
            }
          : null,
      );
    }
  };

  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
        }}
      >
        <LeftCaretIcon width={24} height={24} style={{}} onPress={() => router.back()} />
        <Text style={{ fontSize: 12, color: colors.text.lightgray, marginLeft: 4 }}>돌아가기</Text>
      </View>
      <Spacing height={24} />
      <View style={{ padding: 20, backgroundColor: colors.backgrounddark, borderRadius: 8, width: '100%' }}>
        <Text style={{ fontSize: 12, fontWeight: 'bold', color: colors.text.white }}>{post?.address}</Text>
      </View>
      <Spacing height={32} />
      <Text numberOfLines={2} style={{ fontSize: 24, fontWeight: 'bold', color: colors.text.white, lineHeight: 32 }}>
        {post?.title}
      </Text>
      <Spacing height={16} />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
          gap: 12,
          marginBottom: 8,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <GlitterIcon width={20} height={20} />
          <Text style={{ color: colors.text.white, marginLeft: 4, fontSize: 12 }}>{post?.likeCount}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <EyeIcon width={20} height={20} />
          <Text style={{ color: colors.text.white, marginLeft: 4, fontSize: 12 }}>{post?.viewCount}</Text>
        </View>
      </View>
      <View
        style={{
          position: 'relative',
          width: '100%',
          marginVertical: 80,
        }}
      >
        <BlurView
          intensity={15}
          tint="dark"
          style={{
            backgroundColor: 'rgba(74, 87, 137, 0.2)',
            width: '100%',
            borderRadius: 8,
            overflow: 'hidden',
            borderWidth: 1,
            borderColor: 'rgba(251, 251, 251, 0.2)',
            zIndex: 10,
          }}
        >
          <CustomTextArea
            value={post?.content || ''}
            multiline
            onChangeText={() => {}}
            height={184}
            numberOfLines={10}
            editable={false}
          />
        </BlurView>
        <View
          style={{
            position: 'absolute',
            left: '50%',
            transform: [{ translateX: -200 }, { translateY: -200 }],
            top: '50%',
            flexDirection: 'row',
            alignItems: 'center',
            zIndex: 1,
          }}
        >
          <PostIcon width={400} height={400} />
        </View>
      </View>
      <Spacing height={32} />
      <CommonButton
        title={overrideButtonText ?? getButtonText(post?.isWrittenBySelf ?? false, post?.isLikedBySelf ?? false)}
        variant={overrideButtonText === ' 반짝반짝' || post?.isLikedBySelf ? 'primary' : 'view'}
        onPress={() => onPressBottomButton()}
        buttonIcon={overrideButtonText === ' 반짝반짝' || post?.isLikedBySelf ? <GlitterBlueIcon /> : <GlitterIcon />}
        disabled={overrideButtonText === ' 반짝반짝' || post?.isLikedBySelf}
        fontSize={12}
      />
      <Spacing height={16} />
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 12, color: colors.text.lightgray }} onPress={handleDeletePost}>
          {post?.isWrittenBySelf ? '게시글 삭제하기' : '게시글 신고하기'}
        </Text>
      </View>
    </View>
  );
};

export default PostPage;
