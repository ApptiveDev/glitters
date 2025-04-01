import { View } from 'react-native';

import CommonInput from '@/components/common/Input';

export function Login() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#404C7A' }}>
      <CommonInput />
    </View>
  );
}

export default Login;
