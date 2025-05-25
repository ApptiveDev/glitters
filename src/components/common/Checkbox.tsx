import { Ionicons } from '@expo/vector-icons';
import { Text, TouchableOpacity } from 'react-native';

import colors from '@/types/colors';

export const Checkbox = ({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}) => {
  return (
    <TouchableOpacity onPress={() => onChange(!checked)} style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Ionicons name="checkbox" size={24} color={checked ? colors.blueGray.light : colors.primary.dark} />
      <Text style={{ marginLeft: 8, color: colors.text.gray, fontSize: 12 }}>{label}</Text>
    </TouchableOpacity>
  );
};

export default Checkbox;
