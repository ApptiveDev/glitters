import React from 'react';

import GlitterIcon from '@/assets/icons/glitter.svg';
import { CommonButton } from '@/components/common/Button';

interface CreateGlitterButtonProps {
  onPress: () => void;
  bottom: number;
}

export const CreateGlitterButton = ({ onPress, bottom }: CreateGlitterButtonProps) => {
  return (
    <CommonButton
      title="반짝이 기록하기"
      onPress={onPress}
      variant="maps"
      style={{
        position: 'absolute',
        bottom,
        left: '50%',
        transform: [{ translateX: -70 }],
        borderWidth: 0,
      }}
      fontSize={16}
      buttonIcon={<GlitterIcon width={20} height={20} style={{ marginRight: 3 }} />}
    />
  );
};

export default CreateGlitterButton;
