import { Text, View } from 'react-native';

import colors from '@/types/colors';

interface HeadingProps {
  title: string;
  justifyContent?: 'flex-start' | 'center' | 'flex-end';
  alignItems?: 'flex-start' | 'center' | 'flex-end';
}

export const Heading = ({ title, justifyContent = 'flex-start', alignItems = 'flex-start' }: HeadingProps) => {
  const styles = {
    justifyContent,
    alignItems,
  };
  return (
    <View
      style={{
        flex: 1,
        justifyContent: styles.justifyContent,
        alignItems: styles.alignItems,
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
