import { queryClient } from 'app/_layout';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import React, { useMemo } from 'react';
import { Alert, Text, View } from 'react-native';
import { SvgProps } from 'react-native-svg';

import { addLike, deleteMarker } from '@/api/markers';
import HeartIcon from '@/assets/icons/3d/heart.svg';
import BubbleIcon from '@/assets/icons/bubble.svg';
import EyeIcon from '@/assets/icons/eye.svg';
import GlitterIcon from '@/assets/icons/glitter.svg';
import GlitterBlueIcon from '@/assets/icons/glitter_blue.svg';
import CustomBottomSheet from '@/components/common/BottomSheet';
import { CommonButton } from '@/components/common/Button';
import { CustomTextArea } from '@/components/common/TextArea';
import colors from '@/types/colors';
import { GetPostResponseType } from '@/types/post';
import { markerIcons } from '@/utils/markerIcons';
import { festivalIcons, threeDIcons } from '@/utils/threeDIcons';

interface MapPostBottomSheetProps {
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
  setSendChatModalVisible: (isVisible: boolean) => void;
  post: GetPostResponseType | undefined;
  setPost: React.Dispatch<React.SetStateAction<GetPostResponseType | undefined>>;
  setContentHeight: React.Dispatch<React.SetStateAction<number>>;
  contentHeight: number;
}

export const MapPostBottomSheet = ({
  isVisible,
  setIsVisible,
  setSendChatModalVisible,
  post,
  setPost,
  setContentHeight,
  contentHeight,
}: MapPostBottomSheetProps) => {
  const PostIcon = useMemo(() => {
    if (post?.iconIdx == null) return HeartIcon;

    if (markerIcons[post?.markerIdx].name === 'festival') {
      const iconsArray = Object.values(festivalIcons) as React.FC<SvgProps>[];
      const index = Number(post.iconIdx);
      return iconsArray[index];
    }
    const iconsArray = Object.values(threeDIcons) as React.FC<SvgProps>[];
    const index = Number(post.iconIdx);

    return iconsArray[index] ?? HeartIcon;
  }, [post?.iconIdx, post?.markerIdx]);

  const onPressBottomButton = async ({ isWrittenBySelf, postId }: { isWrittenBySelf: boolean; postId: number }) => {
    if (!isWrittenBySelf) {
      await addLike(postId);
      setPost((prev) =>
        prev
          ? {
              ...prev,
              isLikedBySelf: true,
              likeCount: prev.likeCount + 1,
            }
          : undefined,
      );
    }
  };

  const handleConfirmDelete = async (postId: number) => {
    try {
      setIsVisible(false);
      setPost(undefined);

      await deleteMarker(postId);
      await queryClient.invalidateQueries({ queryKey: ['markers'] });

      router.replace('/maps');
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

  const handleDeletePost = (postId: number, isWrittenBySelf: boolean) => {
    if (isWrittenBySelf) {
      Alert.alert('삭제하시겠어요?', '삭제된 반짝이는 다시 복구되지 않아요', [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '확인',
          onPress: () => handleConfirmDelete(postId),
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

  return (
    <CustomBottomSheet isVisible={isVisible} height={contentHeight} onClose={() => setIsVisible(false)}>
      <View
        onLayout={(e) => {
          const measuredHeight = e.nativeEvent.layout.height;
          setContentHeight(measuredHeight);
        }}
        style={{ paddingTop: 16, gap: 12, alignItems: 'center', position: 'relative' }}
      >
        <PostIcon
          width={292}
          height={292}
          style={{
            position: 'absolute',
            top: 40,
            zIndex: 0,
          }}
        />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', width: '100%' }}>
          <Text style={{ fontSize: 24, color: 'white', fontWeight: 'bold', flexShrink: 1, marginBottom: 8 }}>
            {post?.title}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'center',
              gap: 12,
              marginBottom: 8,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <GlitterIcon width={16} height={16} />
              <Text style={{ color: colors.text.white, marginLeft: 4 }}>{post?.likeCount}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <EyeIcon width={16} height={16} />
              <Text style={{ color: colors.text.white, marginLeft: 4 }}>{post?.viewCount}</Text>
            </View>
          </View>
        </View>
        <BlurView
          intensity={20}
          tint="dark"
          style={{
            backgroundColor: 'rgba(74, 87, 137, 0.2)',
            width: '100%',
            borderRadius: 8,
            overflow: 'hidden',
            borderWidth: 1,
            borderColor: 'rgba(251, 251, 251, 0.2)',
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
        {!post?.isWrittenBySelf ? (
          <View style={{ flexDirection: 'row', gap: 8, width: '100%' }}>
            <CommonButton
              title=""
              variant={post?.isLikedBySelf ? 'primary' : 'view'}
              onPress={() =>
                onPressBottomButton({
                  isWrittenBySelf: post?.isWrittenBySelf ?? false,
                  postId: post?.id ?? 0,
                })
              }
              buttonIcon={post?.isLikedBySelf ? <GlitterBlueIcon /> : <GlitterIcon />}
              disabled={post?.isLikedBySelf}
              style={{
                flex: 1,
              }}
            />
            <CommonButton
              title="  채팅하기"
              variant="view"
              onPress={() => setSendChatModalVisible(true)}
              buttonIcon={<BubbleIcon />}
              style={{
                flex: 6,
              }}
            />
          </View>
        ) : (
          <CommonButton
            title="  당신의 반짝이가 이 글을 읽고 있을 지도 몰라요"
            variant="view"
            onPress={() => {
              Alert.alert('내가 쓴 글이에요.');
            }}
            buttonIcon={<GlitterIcon />}
            fontSize={12}
          />
        )}
        <View
          style={{
            flexDirection: 'row',
            gap: 8,
          }}
        >
          <Text
            style={{ fontSize: 12, color: colors.text.lightgray }}
            onPress={() => handleDeletePost(post?.id ?? 0, post?.isWrittenBySelf ?? false)}
          >
            {post?.isWrittenBySelf ? '게시글 삭제하기' : '게시글 신고하기'}
          </Text>
        </View>
      </View>
    </CustomBottomSheet>
  );
};

export default MapPostBottomSheet;
