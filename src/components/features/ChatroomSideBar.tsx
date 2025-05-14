import { router } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';

import Scope3DIcon from '@/assets/icons/3d/scope_3d.svg';
import { SlidingSidebar } from '@/components/common/SlidingSidebar';
import { useLayout } from '@/contexts/LayoutContext';
import colors from '@/types/colors';

interface ChatroomSideBarProps {
  title: string;
  peerNickname: string;
  chatroomId: number;
  sidebarVisible: boolean;
  setSidebarVisible: (visible: boolean) => void;
}

export const ChatroomSideBar = ({
  title,
  peerNickname,
  chatroomId,
  sidebarVisible,
  setSidebarVisible,
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
    router.back();
  };

  return (
    <SlidingSidebar visible={sidebarVisible} onClose={() => setSidebarVisible(false)}>
      <View
        style={{
          height: 206,
          paddingTop: insetTop + 32,
          backgroundColor: colors.yellow.dark,
          borderTopRightRadius: 24,
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
            backgroundColor: colors.yellow.light,
            paddingHorizontal: 60,
            height: 38,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: 12, color: colors.text.darkgray, fontWeight: 'bold' }}>게시글 바로가기</Text>
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
      </View>
      <Text
        style={{
          position: 'absolute',
          bottom: insetBottom + 10,
          left: 36,
          color: colors.text.grayblue,
          fontWeight: 'bold',
        }}
        onPress={handleReportPress}
      >
        신고하기
      </Text>
      <Text
        style={{
          position: 'absolute',
          bottom: insetBottom + 10,
          right: 36,
          color: colors.text.grayblue,
          fontWeight: 'bold',
        }}
        onPress={handleExitPress}
      >
        나가기
      </Text>
    </SlidingSidebar>
  );
};

export default ChatroomSideBar;
