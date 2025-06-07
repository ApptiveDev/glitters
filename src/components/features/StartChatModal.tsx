import React, { useRef } from 'react';
import {
  Dimensions,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import { Portal } from 'react-native-paper';
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

const StartChatModalComponent = ({ visible, setVisible, postId, markerIdx, title }: StartChatModalProps) => {
  const messageRef = useRef('');

  const startChat = async () => {
    if (!postId) return;
    try {
      await createChat({ postId, content: messageRef.current });
      messageRef.current = '';
      setVisible(false);
      Toast.show({
        type: 'success',
        text1: '쪽지 전달 완료!',
        text2: '상대방이 확인할 수 있어요.',
      });
    } catch (error) {
      showErrorAlert('오류', error);
      messageRef.current = '';
      setVisible(false);
    }
  };

  if (!visible) return null;

  return (
    <Portal>
      <TouchableWithoutFeedback onPress={() => setVisible(false)}>
        <View
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'rgba(0,0,0,0.3)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={{ width: '80%' }}
          >
            <TouchableWithoutFeedback>
              <View
                style={{
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
                <Text style={{ fontSize: 14, color: colors.text.white, fontWeight: 'bold' }}>
                  첫 쪽지 보내기
                </Text>
                <Spacing height={25} />
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, height: 24, marginBottom: 16 }}>
                  <Image source={markerIcons[markerIdx ?? 0].icon} style={{ width: 24, height: 24 }} />
                  <Text style={{ fontSize: 12, color: colors.text.white, fontWeight: 'bold' }} numberOfLines={1} ellipsizeMode="tail">
                    {title}
                  </Text>
                </View>
                <TouchableOpacity
                  style={{ position: 'absolute', right: 28, top: 25 }}
                  onPress={() => {
                    setVisible(false);
                    messageRef.current = '';
                  }}
                >
                  <SimpleExitIcon width={16} height={16} />
                </TouchableOpacity>

                <View style={{ flexDirection: 'row', alignItems: 'flex-end', width: '100%', gap: 8 }}>
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
                    }}
                  >
                    <TextInput
                      key={visible ? 'open' : 'closed'}
                      style={{
                        flex: 1,
                        color: colors.text.white,
                        fontSize: 10,
                        paddingVertical: 0,
                        lineHeight: 12,
                      }}
                      placeholder="보내고 싶은 말을 입력하세요."
                      placeholderTextColor="rgba(255,255,255,0.6)"
                      defaultValue={messageRef.current}
                      onChangeText={text => {
                        messageRef.current = text;
                      }}
                      multiline
                    />
                    <TouchableOpacity
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 999,
                        backgroundColor: messageRef.current ? colors.yellow.dark : colors.primary.main,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                      onPress={startChat}
                      disabled={!messageRef.current}
                    >
                      <SendIcon width={13} height={13} />
                    </TouchableOpacity>
                  </View>
                </View>
                <Spacing height={20} />
                <Text style={{ fontSize: 10, color: colors.text.gray }}>
                  쪽지함에서 보낸 내용을 확인할 수 있어요.
                </Text>
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Portal>
  );
};

export const StartChatModal = React.memo(StartChatModalComponent);
