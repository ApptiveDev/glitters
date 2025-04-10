import { Text, View } from 'react-native';

import colors from '@/types/colors';

export const Heading = ({ title }: { title: string }) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
      }}
    >
      <Text
        style={{
          fontSize: 20,
          fontWeight: 'bold',
          color: colors.text.white,
        }}
      >
        {title}
      </Text>
    </View>
  );
};

export default Heading;
