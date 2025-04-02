import { useMemo, useState } from 'react';
import { View } from 'react-native';

import DropdownComponent from '@/components/common/Dropdown';
import { schoolList } from '@/utils/mocks';

export const Sign = () => {
  const memoizedList = useMemo(() => schoolList, []);
  const [value, setValue] = useState<string | null>(null);
  console.log('value', value);
  return (
    <View style={{ flex: 1, backgroundColor: '#404C7A' }}>
      <View style={{ width: '100%', height: '100%', backgroundColor: '#404C7A', marginTop: 100, alignItems: 'center' }}>
        <DropdownComponent data={memoizedList} value={value} setValue={setValue} />
        {/* <CommonInput width={346} /> */}
      </View>
    </View>
  );
};

export default Sign;
