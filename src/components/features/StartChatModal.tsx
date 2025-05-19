import React from 'react';
import { Image, Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';

import { createChat } from '@/api/chat';
import SendIcon from '@/assets/icons/send.svg';
import SimpleExitIcon from '@/assets/icons/simple_exit.svg';
import { Spacing } from '@/components/common/Spacing';
import colors from '@/types/colors';
import { showErrorAlert } from '@/utils/errorMessage';
import { markerIcons } from '@/utils/markerIcons';

interface StartChatModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  postId?: number;
  markerIdx?: number;
  title?: string;
}

export const StartChatModal = ({ visible, setVisible, postId, markerIdx, title }: StartChatModalProps) => {
  const [message, setMessage] = React.useState('');
  const startChat = async () => {
    if (!postId) return;
    try {
      await createChat({
        postId,
        content: message,
      });
      setMessage('');
      setVisible(false);
      Toast.show({
        type: 'success',
        text1: '쪽지 전달 완료! ',
        text2: '상대방이 확인할 수 있어요.',
      });
    } catch (error) {
      showErrorAlert('오류', error);
      setMessage('');
      setVisible(false);
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={() => {
        setVisible(false);
        setMessage('');
      }}
    >
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.3)',
        }}
      >
        <View
          style={{
            width: '80%',
            height: 200,
            backgroundColor: colors.background,
            borderRadius: 12,
            paddingVertical: 25,
            paddingHorizontal: 28,
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 4,
          }}
        >
          <Text
            style={{
              fontSize: 10,
              color: colors.text.white,
              fontWeight: 'bold',
              lineHeight: 12,
            }}
          >
            채팅 시작하기
          </Text>
          <Spacing height={25} />
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4,
              height: 24,
              marginBottom: 16,
            }}
          >
            <Image
              source={markerIcons[markerIdx ?? 0].icon}
              style={{
                width: 24,
                height: 24,
              }}
            />
            <Text
              style={{
                fontSize: 12,
                color: colors.text.white,
                fontWeight: 'bold',
              }}
              ellipsizeMode="tail"
            >
              {title}
            </Text>
          </View>
          <TouchableOpacity
            style={{ position: 'absolute', right: 28, top: 25 }}
            onPress={() => {
              setVisible(false);
              setMessage('');
            }}
          >
            <SimpleExitIcon width={16} height={16} />
          </TouchableOpacity>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-end',
              justifyContent: 'flex-end',
              width: '100%',
              gap: 8,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 12,
                paddingTop: 8,
                paddingBottom: 10,
                backgroundColor: colors.backgroundLight,
                borderRadius: 20,
                gap: 8,
                flex: 1,
                justifyContent: 'center',
              }}
            >
              <TextInput
                style={{
                  flex: 1,
                  color: colors.text.white,
                  fontSize: 10,
                  paddingVertical: 0,
                  lineHeight: 12,
                }}
                placeholder="채팅을 입력하세요."
                placeholderTextColor="rgba(255,255,255,0.6)"
                value={message}
                onChangeText={setMessage}
                numberOfLines={1}
                multiline
              />
              <TouchableOpacity
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 999,
                  backgroundColor: message ? colors.yellow.dark : colors.primary.main,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={startChat}
                disabled={!message}
              >
                <SendIcon width={13} height={13} />
              </TouchableOpacity>
            </View>
          </View>
          <Spacing height={20} />
          <Text
            style={{
              fontSize: 10,
              color: colors.text.gray,
            }}
          >
            채팅 목록에서 보낸 내용을 확인할 수 있어요.
          </Text>
        </View>
      </View>
    </Modal>
  );
};

export default StartChatModal;
