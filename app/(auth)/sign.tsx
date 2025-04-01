import { View } from 'react-native';

import DropdownComponent from '@/components/common/Dropdown';

export function Sign() {
  return (
    <View style={{ flex: 1, backgroundColor: '#404C7A' }}>
      <View style={{ width: '100%', height: '100%', backgroundColor: '#404C7A', marginTop: 100, alignItems: 'center' }}>
        <DropdownComponent />
        {/* <CommonInput width={346} /> */}
      </View>
    </View>
  );
}

export default Sign;
