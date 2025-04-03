import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { getSchoolList } from '@/api/sign';
import DropdownComponent from '@/components/common/Dropdown';
import CommonInput from '@/components/common/Input';
import { SchoolListResponse } from '@/types/sign';

const styles = StyleSheet.create({
  view: {
    flex: 1,
    alignItems: 'center',
    padding: 100,
    gap: 20,
  },
});

export const Sign = () => {
  const [domain, setDomain] = useState<string | null>(null);
  const [value, setValue] = useState<string>('');
  const [valid, setValid] = useState<boolean>(false);

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
    setValid(text.endsWith(domain || ''));
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#404C7A' }}>
      <View style={styles.view}>
        <DropdownComponent data={formattedList || []} value={domain} setValue={setDomain} />
        {domain && (
          <CommonInput width={346} defaultValue={domain} isValid={valid} value={value} onChangeText={onChangeText} />
        )}
      </View>
    </View>
  );
};

export default Sign;
