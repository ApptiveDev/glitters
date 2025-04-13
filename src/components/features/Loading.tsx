import styles from 'app/maps/styles';
import { ActivityIndicator, View } from 'react-native';

import { CommonButton } from '@/components/common/Button';
import { Spacing } from '@/components/common/Spacing';
import colors from '@/types/colors';

const Loading = () => {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={colors.absolute.white} />
      <Spacing height={20} />
      <CommonButton
        title="지도를 불러오는 중이에요..."
        variant="maps"
        onPress={() => {}}
        style={{
          borderWidth: 1,
          borderColor: colors.yellow.dark,
        }}
      />
    </View>
  );
};

export default Loading;
