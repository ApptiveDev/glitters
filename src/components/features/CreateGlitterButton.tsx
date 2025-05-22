import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { getPostCreationStatus } from '@/api/posts';
import ClockIcon from '@/assets/icons/clock.svg';
import GlitterIcon from '@/assets/icons/glitter.svg';
import colors from '@/types/colors';
import { showErrorAlert } from '@/utils/errorMessage';

interface CreateGlitterButtonProps {
  onPress: () => void;
  bottom: number;
}

export const CreateGlitterButton = ({ onPress, bottom }: CreateGlitterButtonProps) => {
  const [postCreationStatus, setPostCreationStatus] = React.useState({
    isAvailable: true,
    nextAvailableAt: '',
  });
  const [title, setTitle] = useState('반짝이 기록하기');

  useEffect(() => {
    const fetchPostCreationStatus = async () => {
      try {
        const response = await getPostCreationStatus();
        setPostCreationStatus(response);
      } catch (error) {
        showErrorAlert('오류', error);
      }
    };

    fetchPostCreationStatus();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (!postCreationStatus.isAvailable && postCreationStatus.nextAvailableAt) {
      interval = setInterval(() => {
        const remainingTime = new Date(postCreationStatus.nextAvailableAt).getTime() - new Date().getTime();

        if (remainingTime <= 0) {
          setTitle('반짝이 기록하기');
          setPostCreationStatus((prev) => ({
            ...prev,
            isAvailable: true,
          }));
          clearInterval(interval);
        } else {
          const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
          const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
          setTitle(`${formattedTime} 이후에 작성하기`);
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [postCreationStatus]);

  return (
    <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}>
      <TouchableOpacity
        onPress={onPress}
        style={{
          position: 'absolute',
          bottom,
          borderWidth: 1,
          backgroundColor: postCreationStatus.isAvailable ? colors.background : colors.gray.bright,
          borderColor: colors.gray.light,
          paddingVertical: 8,
          paddingHorizontal: 12,
          borderRadius: 36,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
        }}
        disabled={!postCreationStatus.isAvailable}
      >
        {postCreationStatus.isAvailable ? <GlitterIcon width={24} height={24} /> : <ClockIcon width={20} height={20} />}
        <Text
          style={{
            fontSize: 16,
            fontWeight: 'bold',
            color: postCreationStatus.isAvailable ? colors.yellow.dark : colors.text.darkgray,
          }}
        >
          {title}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default CreateGlitterButton;
