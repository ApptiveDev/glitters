/* eslint-disable react/require-default-props */
import React from 'react';
import { DimensionValue, StyleSheet, Text, TextInput, TextInputProps, TextStyle, View } from 'react-native';

interface CommonInputProps extends TextInputProps {
  width?: DimensionValue;
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
  onChangeText?: (text: string) => void;
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderBottomWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
    borderRadius: 4,
    boxSizing: 'border-box',
  },
  errerText: {
    color: '#FFA0A0',
    paddingLeft: 8,
    fontSize: 12,
  },
  component: {
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  guideText: {
    color: '#FFF7C1',
    fontSize: 12,
    paddingLeft: 8,
  },
});

const CommonInput = React.forwardRef<TextInput, CommonInputProps>(
  (
    {
      width = '100%',
      height = 40,
      placeholder = '',
      defaultValue = '기본값',
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
      style,
    },
    ref,
  ) => {
    const dynamicStyles: TextStyle = {
      width,
      backgroundColor,
      color: isValid ? '#FFF' : '#8793C2',
      borderColor: disable ? '#FFF' : '#8793C2',
      height,
      fontSize,
      padding,
    };

    return (
      <View style={styles.component}>
        <TextInput
          style={[styles.input, dynamicStyles, style]}
          placeholder={placeholder}
          defaultValue={defaultValue}
          onChangeText={onChangeText}
          ref={ref}
        />
        {isError && (
          <Text style={styles.errerText} disabled={!isError}>
            {errorMessage}
          </Text>
        )}
        {isGuide && <Text style={styles.guideText}>{guideText}</Text>}
      </View>
    );
  },
);

export default CommonInput;
