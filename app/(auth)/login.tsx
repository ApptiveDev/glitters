import { Dimensions, View } from 'react-native';

import { CommonButton } from '@/components/common/Button';
import CommonInput from '@/components/common/Input';
import { useUser } from '@/contexts/UserContext';
import colors from '@/types/colors';

export const Login = () => {
  const { width } = Dimensions.get('window');
  const { user, setUser } = useUser();

  const handleLogin = () => {
    // Handle login logic here
  };
  return (
    <View
      style={{
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <CommonInput
        placeholder="Email"
        style={{
          width: width - 28,
        }}
      />
      <CommonInput
        placeholder="Password"
        secureTextEntry
        style={{
          width: width - 28,
        }}
      />
      <CommonButton
        title="로그인하기"
        style={{
          width: '100%',
          height: 48,
          backgroundColor: colors.yellow.dark,
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 12,
          color: colors.absolute.white,
          marginTop: 20,
          padding: 0,
          borderRadius: 12,
        }}
        onPress={() => {
          // Handle login logic here
        }}
      />
    </View>
  );
};
export default Login;
