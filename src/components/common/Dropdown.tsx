import React, { useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import colors from '@/types/colors';

interface DropdownItem {
  label: string;
  value: string;
}

interface CustomDropdownProps {
  data: DropdownItem[];
  value: string | null;
  setValue: (val: string) => void;
  placeholder?: string;
  style?: object;
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    zIndex: 10,
  },
  selector: {
    width: '100%',
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FBFBFB',
  },
  placeholderText: {
    color: '#aaa',
    fontSize: 16,
  },
  selectedText: {
    color: 'white',
    fontSize: 16,
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  bottomList: {
    backgroundColor: 'white',
    paddingVertical: 52,
    paddingHorizontal: 44,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: 400,
  },
  item: {
    padding: 16,
  },
  itemText: {
    fontSize: 16,
    color: '#000',
  },
});

const CustomDropdown = ({ data, value, setValue, placeholder = '학교를 선택하세요.', style }: CustomDropdownProps) => {
  const [open, setOpen] = useState(false);
  const selectedLabel = data.find((item) => item.value === value)?.label;

  const handleSelect = (val: string) => {
    setValue(val);
    setOpen(false);
  };

  return (
    <View style={(styles.wrapper, style)}>
      <TouchableOpacity style={styles.selector} onPress={() => setOpen(true)}>
        <Text style={value ? styles.selectedText : styles.placeholderText}>{selectedLabel || placeholder}</Text>
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade">
        <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
          <View style={styles.bottomList}>
            <FlatList
              data={data}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.item} onPress={() => handleSelect(item.value)}>
                  <Text style={styles.itemText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

export default CustomDropdown;
