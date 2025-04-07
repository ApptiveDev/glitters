import styles from 'app/maps/styles';
import { ActivityIndicator, Text, View } from 'react-native';

import colors from '@/types/colors';

const Loading = () => {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={colors.absolute.white} />
      <Text style={{ color: 'white' }}>위치 정보를 불러오는 중...</Text>
    </View>
  );
};

export default Loading;
