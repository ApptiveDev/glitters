import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import colors from '@/types/colors';

interface TextAreaProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  maxLength?: number;
  numberOfLines?: number;
  multiline?: boolean;
  height?: number;
  errorMessage?: string;
  isError?: boolean;
  editable?: boolean;
}

const styles = StyleSheet.create({
  container: {
    minHeight: 50,
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 20,
    color: colors.text.white,
    textAlignVertical: 'top',
    paddingTop: 16,
  },
});

export const CustomTextArea = ({
  value,
  onChangeText,
  placeholder = '내용을 입력하세요.',
  maxLength = 255,
  numberOfLines = 10,
  multiline = false,
  height = 50,
  errorMessage = '',
  isError = false,
  editable = true,
}: TextAreaProps) => {
  return (
    <View style={{ width: '100%' }}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        maxLength={maxLength}
        numberOfLines={numberOfLines}
        multiline={multiline}
        textAlignVertical="top"
        placeholderTextColor={colors.gray.main}
        style={{ ...styles.container, height }}
        editable={editable}
      />
      {isError ? (
        <Text style={{ color: colors.error, marginTop: 4, fontSize: 12, marginLeft: 12 }}>{errorMessage}</Text>
      ) : (
        <Text style={{ marginTop: 4 }}>{}</Text>
      )}
    </View>
  );
};

export default CustomTextArea;
