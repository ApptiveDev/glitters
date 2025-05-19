import { router } from 'expo-router';
import { Alert, Text, TouchableOpacity, View } from 'react-native';

import { deleteChatroom } from '@/api/chat';
import Heart3DIcon from '@/assets/icons/3d/heart_red.svg';
import Scope3DIcon from '@/assets/icons/3d/scope_3d.svg';
import { SlidingSidebar } from '@/components/common/SlidingSidebar';
import { useLayout } from '@/contexts/LayoutContext';
import colors from '@/types/colors';

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
      },
    });
  };

  const isExpired = () => {
    const currentDate = new Date();
    const expirationDate = new Date(expiresAt || '');
    return currentDate > expirationDate;
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
            paddingHorizontal: 60,
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
          채팅 참여자
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
      <Text
        style={{
          position: 'absolute',
          bottom: insetBottom + 10,
          left: 36,
          color: colors.text.grayblue,
          fontWeight: 'bold',
        }}
        onPress={handleExitPress}
      >
        나가기
      </Text>
      <Text
        style={{
          position: 'absolute',
          bottom: insetBottom + 10,
          right: 36,
          color: colors.text.grayblue,
          fontWeight: 'bold',
        }}
        onPress={handleReportPress}
      >
        신고하기
      </Text>
    </SlidingSidebar>
  );
};

export default ChatroomSideBar;
