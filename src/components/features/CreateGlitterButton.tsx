import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';

import { getPostCreationStatus } from '@/api/posts';
import GlitterIcon from '@/assets/icons/glitter.svg';
import { CommonButton } from '@/components/common/Button';
import colors from '@/types/colors';

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
        const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
        Alert.alert('오류', errorMessage);
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
          const formattedTime = `${minutes.toString().padStart(2, '0')}분 ${seconds.toString().padStart(2, '0')}초`;
          setTitle(`${formattedTime}`);
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [postCreationStatus]);

  return (
    <CommonButton
      title={title}
      onPress={onPress}
      variant="maps"
      style={{
        position: 'absolute',
        bottom,
        left: '50%',
        transform: [{ translateX: -70 }],
        borderWidth: 0,
        backgroundColor: !postCreationStatus.isAvailable && colors.gray.main,
      }}
      fontSize={16}
      disabled={!postCreationStatus.isAvailable}
      buttonIcon={<GlitterIcon width={20} height={20} style={{ marginRight: 3 }} />}
    />
  );
};

export default CreateGlitterButton;
