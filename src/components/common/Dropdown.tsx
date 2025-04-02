import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

interface DropdownComponentProps {
  data: { label: string; value: string }[];
  value: string | null;
  setValue: (value: string) => void;
}

const styles = StyleSheet.create({
  view: {
    width: 346,
  },
  container: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    borderRadius: 12,
    padding: 36,
    height: 437,
  },
  dropdown: {
    height: 50,
    backgroundColor: '#515F95',
    borderRadius: 12,
    borderColor: '#FBFBFB',
    borderWidth: 1,
    padding: 16,
    color: '#FFF',
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 16,
    color: '#FFF',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: '#FFF',
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  itemContainerStyle: {
    backgroundColor: 'transparent',
  },
  itemTextStyle: {
    fontSize: 14,
    color: '#393939',
  },
});

const DropdownComponent = ({ data, value, setValue }: DropdownComponentProps) => {
  return (
    <View style={styles.view}>
      <Dropdown
        mode="modal"
        dropdownPosition="bottom"
        style={[styles.dropdown]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        containerStyle={styles.container}
        itemContainerStyle={styles.itemContainerStyle}
        itemTextStyle={styles.itemTextStyle}
        activeColor="transparent"
        showsVerticalScrollIndicator
        autoScroll={false}
        data={data}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder="학교를 선택하세요"
        searchPlaceholder="Search..."
        value={value}
        onChange={(item) => {
          setValue(item.value);
        }}
      />
    </View>
  );
};

export default DropdownComponent;
