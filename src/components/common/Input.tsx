/* eslint-disable react/require-default-props */
import React from 'react';
import { DimensionValue, StyleSheet, Text, TextInput, TextInputProps, TextStyle, View } from 'react-native';

import colors from '@/types/colors';

interface CommonInputProps extends TextInputProps {
  height?: DimensionValue;
  disable?: boolean;
  fontSize?: number;
  padding?: number;
  backgroundColor?: string;
  isValid?: boolean;
  errorMessage?: string;
  isError?: boolean;
  isGuide?: boolean;
  guideText?: string;
  editable?: boolean;
  onChangeText?: (text: string) => void;
}

const styles = StyleSheet.create({
  input: {
    borderBottomWidth: 1,
    paddingLeft: 8,
    borderRadius: 4,
  },
  errorText: {
    color: colors.error,
    paddingLeft: 8,
    fontSize: 12,
  },
  component: {
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  guideText: {
    color: colors.guide,
    fontSize: 12,
    paddingLeft: 8,
  },
});

const CommonInput = React.forwardRef<TextInput, CommonInputProps>(
  (
    {
      height = 48,
      placeholder = '',
      defaultValue = '',
      fontSize = 16,
      padding = 12,
      backgroundColor = 'transparent',
      onChangeText = () => {},
      disable = false,
      isValid = true,
      errorMessage = '',
      isError = false,
      isGuide = false,
      guideText = '',
      editable = true,
      style,
    },
    ref,
  ) => {
    const dynamicStyles: TextStyle = {
      height,
      fontSize,
      backgroundColor,
      color: isValid ? '#FFF' : colors.gray.main,
      borderColor: disable ? '#FFF' : colors.gray.main,
      paddingHorizontal: padding,
      paddingVertical: 10,
      textAlignVertical: 'center',
      borderBottomWidth: 1,
    };

    return (
      <View style={styles.component}>
        <TextInput
          ref={ref}
          style={[styles.input, dynamicStyles, style]}
          placeholder={placeholder}
          defaultValue={defaultValue}
          onChangeText={onChangeText}
          editable={editable}
        />
        {isError && <Text style={styles.errorText}>{errorMessage}</Text>}
        {isGuide && <Text style={styles.guideText}>{guideText}</Text>}
      </View>
    );
  },
);

export default CommonInput;
