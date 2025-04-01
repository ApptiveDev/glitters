import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

const data = [
  { label: '부산대학교', value: '@pnu.ac.kr' },
  { label: 'Item 2', value: '2' },
  { label: 'Item 3', value: '3' },
  { label: 'Item 4', value: '4' },
  { label: 'Item 5', value: '5' },
  { label: 'Item 6', value: '6' },
  { label: 'Item 7', value: '7' },
  { label: 'Item 8', value: '8' },
  { label: 'Item 8', value: '8' },
  { label: 'Item 8', value: '8' },
];

const DropdownComponent = () => {
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);


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
        activeColor='transparent'
        showsVerticalScrollIndicator={true}
        autoScroll={false}
        data={data}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? 'Select item' : '...'}
        searchPlaceholder="Search..."
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={item => {
          setValue(item.value);
          setIsFocus(false);
        }}
      />
    </View>
  );
};

export default DropdownComponent;

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