import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

import { getActivePost } from '@/api/posts';
import MarkerIcon from '@/assets/icons/marker.svg';
import { useLayout } from '@/contexts/LayoutContext';
import colors from '@/types/colors';
import { showErrorAlert } from '@/utils/errorMessage';

export const RemainPost = () => {
  const [remainingPosts, setRemainingPosts] = useState(0);
  const { insetTop } = useLayout();
  useEffect(() => {
    const fetchActivePost = async () => {
      try {
        const response = await getActivePost();
        if (!response) {
          setRemainingPosts(10);
          return;
        }
        setRemainingPosts(10 - response);
      } catch (error) {
        showErrorAlert('오류', error);
        setRemainingPosts(10);
      }
    };
    fetchActivePost();
  }, []);

  return (
    <View
      style={{
        position: 'absolute',
        top: insetTop + 20,
        right: 24,
        flexDirection: 'row',
        gap: 4,
        alignItems: 'center',
        borderRadius: 999,
        paddingVertical: 4,
        paddingHorizontal: 8,
        width: 65,
        height: 32,
        backgroundColor: colors.text.white,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      }}
    >
      <MarkerIcon width={24} height={24} />
      <Text style={{ fontSize: 12, color: colors.text.black, fontWeight: 'bold' }}>{remainingPosts}</Text>
    </View>
  );
};

export default RemainPost;
