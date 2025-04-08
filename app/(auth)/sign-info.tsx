import { Text, View } from 'react-native';

import { useUser } from '@/contexts/UserContext';

export const SignInfo = () => {
  const { user } = useUser();
  console.log('user', user);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text>SignInfo</Text>
    </View>
  );
};

export default SignInfo;
