import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

import { createMarker } from '@/api/markers';

import styles from './styles';

export const Write = () => {
  const [text, setText] = useState<string>('');
  const [content, setContent] = useState<string>('');

  const usePostMutation = () => {
    return useMutation({
      mutationFn: createMarker,
    });
  };

  const { mutate } = usePostMutation();

  const handleButtonPress = async () => {
    try {
      await mutate({
        title: text,
        content,
        address: '부산광역시 금정구 부산대학로 63',
        addressDetail: '부산대학교',
        isDeactivated: false,
        latitude: 35.123456,
        longitude: 129.123456,
      });
      router.replace('/maps');
    } catch (error) {
      console.error('Error creating marker:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Write</Text>
      <TextInput
        style={{ height: 40, padding: 5, color: 'white', backgroundColor: 'black' }}
        placeholder="Type here to translate!"
        onChangeText={(newText) => setText(newText)}
        defaultValue={text}
      />
      <TextInput
        style={{ height: 40, padding: 5, color: 'white', backgroundColor: 'black' }}
        placeholder="Type here to translate!"
        onChangeText={(newContent) => setContent(newContent)}
        defaultValue={content}
      />
      <TouchableOpacity style={styles.button} onPress={handleButtonPress}>
        <Text>반짝이 기록하기</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Write;
