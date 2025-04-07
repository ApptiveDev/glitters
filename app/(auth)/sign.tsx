import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { Dimensions, View } from 'react-native';

import { getSchoolList } from '@/api/sign';
import DropdownComponent from '@/components/common/Dropdown';
import CommonInput from '@/components/common/Input';
import colors from '@/types/colors';
import { SchoolListResponse } from '@/types/sign';

import styles from './styles';

export const Sign = () => {
  const [domain, setDomain] = useState<string | null>(null);
  const [value, setValue] = useState<string>('');
  const [valid, setValid] = useState<boolean>(false);
  const { width } = Dimensions.get('window');

  const { data } = useQuery<SchoolListResponse>({
    queryKey: ['school_list'],
    queryFn: () => getSchoolList(),
    enabled: true,
  });

  const formattedList = useMemo(() => {
    const list = data?.institutions;
    return list?.map((item) => ({
      label: item.name,
      value: item.emailDomain,
    }));
  }, [data]);

  const onChangeText = (text: string) => {
    setValue(text);
    if (text.length > 0) {
      setValid(true);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: `${colors.background}` }}>
      <View style={styles.view}>
        <DropdownComponent data={formattedList || []} value={domain} setValue={setDomain} />
        {domain && (
          <View style={styles.inputContainer}>
            <CommonInput
              style={{ width: width / 2 - 28 }}
              placeholder="이메일을 입력하세요"
              isValid={valid}
              defaultValue=""
              value={value}
              onChangeText={onChangeText}
            />
            <CommonInput style={{ width: width / 2 - 28 }} defaultValue={domain} editable={false} />
          </View>
        )}
      </View>
    </View>
  );
};

export default Sign;
