import { queryClient } from 'app/_layout';
import { router } from 'expo-router';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';

import { blockUser } from '@/api/block';
import { deleteChatroom } from '@/api/chat';
import Heart3DIcon from '@/assets/icons/3d/heart_red.svg';
import Scope3DIcon from '@/assets/icons/3d/scope_3d.svg';
import { SlidingSidebar } from '@/components/common/SlidingSidebar';
import { useLayout } from '@/contexts/LayoutContext';
import colors from '@/types/colors';
import { showErrorAlert } from '@/utils/errorMessage';

interface ChatroomSideBarProps {
  title: string;
  peerNickname: string;
  chatroomId: number;
  sidebarVisible: boolean;
  myNickname: string;
  setSidebarVisible: (visible: boolean) => void;
  postId?: number;
  expiresAt?: string;
}

export const ChatroomSideBar = ({
  title,
  peerNickname,
  chatroomId,
  sidebarVisible,
  myNickname,
  setSidebarVisible,
  postId,
  expiresAt,
}: ChatroomSideBarProps) => {
  const { insetTop, insetBottom } = useLayout();

  const handleReportPress = () => {
    router.push({
      pathname: '/report',
      params: {
        chatroomId,
        reportType: 'CHATROOM_REPORT',
      },
    });
  };

  const handleExitPress = () => {
    Alert.alert('채팅방을 나가시겠습니까?', '', [
      {
        text: '취소',
        style: 'cancel',
      },
      {
        text: '확인',
        onPress: async () => {
          await deleteChatroom(chatroomId);
          setSidebarVisible(false);
          router.back();
        },
      },
    ]);
  };

  const goToPostPage = () => {
    if (!postId) {
      Alert.alert('게시글을 찾을 수 없습니다.');
      return;
    }
    router.push({
      pathname: '/post',
      params: {
        postId,
        from: 'chatroom',
      },
    });
  };

  const isExpired = () => {
    const currentDate = new Date();
    const expirationDate = new Date(expiresAt || '');
    return currentDate > expirationDate;
  };

  const handleBlockUser = async () => {
    try {
      Alert.alert('차단하시겠어요?', '한 번 차단한 사용자는 해제할 수 없어요', [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '확인',
          onPress: async () => {
            blockUser({
              blockType: 'chatroom',
              postId: undefined,
              chatroomId,
            });
            Toast.show({
              type: 'success',
              text1: '사용자를 차단했습니다.',
            });
            queryClient.refetchQueries({ queryKey: ['chatRooms'] });
            router.replace('/chatrooms');
          },
        },
      ]);
    } catch (error) {
      showErrorAlert('오류', error);
    }
  };

  return (
    <SlidingSidebar visible={sidebarVisible} onClose={() => setSidebarVisible(false)}>
      <View
        style={{
          height: 180 + insetTop,
          paddingBottom: 32,
          justifyContent: 'flex-end',
          backgroundColor: colors.yellow.dark,
          borderTopLeftRadius: 24,
          borderBottomLeftRadius: 24,
          borderBottomRightRadius: 24,
          paddingHorizontal: 36,
          gap: 12,
        }}
      >
        <Text
          style={{
            color: colors.text.lightblack,
            fontSize: 16,
            fontWeight: 'bold',
          }}
          ellipsizeMode="tail"
          numberOfLines={2}
        >
          {title}
        </Text>
        <TouchableOpacity
          style={{
            width: '100%',
            backgroundColor: isExpired() ? colors.gray.light : colors.yellow.light,
            height: 38,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 8,
          }}
          onPress={goToPostPage}
          disabled={isExpired()}
        >
          <Text style={{ fontSize: 12, color: colors.text.darkgray, fontWeight: 'bold' }}>
            {isExpired() ? '만료된 게시글 입니다.' : '게시글 바로가기'}
          </Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          marginTop: 44,
          paddingHorizontal: 32,
          gap: 24,
        }}
      >
        <Text
          style={{
            color: colors.absolute.white,
            fontSize: 14,
            fontWeight: 'bold',
          }}
        >
          참여자
        </Text>
        <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
          <Scope3DIcon width={44} height={44} />
          <Text
            style={{
              color: colors.absolute.white,
              fontSize: 12,
              fontWeight: 'bold',
            }}
          >
            {peerNickname}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
          <Heart3DIcon width={44} height={44} />
          <Text
            style={{
              color: colors.absolute.white,
              fontSize: 12,
              fontWeight: 'bold',
            }}
          >
            {myNickname}
          </Text>
          <View
            style={{
              width: 20,
              height: 20,
              borderRadius: 999,
              backgroundColor: colors.primary.main,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                color: colors.text.grayblue,
                fontSize: 10,
                fontWeight: 'bold',
              }}
            >
              나
            </Text>
          </View>
        </View>
      </View>
      <View
        style={{
          position: 'absolute',
          bottom: insetBottom + 24,
          flexDirection: 'row',
          alignSelf: 'center',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          paddingHorizontal: 36,
        }}
      >
        <Text
          style={{
            color: colors.text.grayblue,
            fontWeight: 'bold',
            marginVertical: 5,
          }}
          onPress={handleExitPress}
        >
          나가기
        </Text>

        <Text
          style={{
            color: colors.text.grayblue,
            fontWeight: 'bold',
            marginVertical: 5,
          }}
          onPress={handleBlockUser}
        >
          차단하기
        </Text>

        <Text
          style={{
            color: colors.text.grayblue,
            fontWeight: 'bold',
            marginVertical: 5,
          }}
          onPress={handleReportPress}
        >
          신고하기
        </Text>
      </View>
    </SlidingSidebar>
  );
};

export default ChatroomSideBar;
