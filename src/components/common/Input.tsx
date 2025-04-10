/* eslint-disable react/require-default-props */
import React from 'react';
import {
  ActivityIndicator,
  DimensionValue,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
} from 'react-native';

import CheckIcon from '@/assets/icons/check.svg';
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
  checked?: boolean;
  loading?: boolean;
  onChangeText?: (text: string) => void;
  secureTextEntry?: boolean;
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
    marginTop: 8,
  },
  component: {
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  guideText: {
    color: colors.guide,
    fontSize: 12,
    position: 'absolute',
    bottom: 14,
    right: 0,
  },
  underline: {
    height: 1,
    alignSelf: 'stretch',
    marginTop: -1,
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
      checked = false,
      loading = false,
      secureTextEntry = false,
      style,
    },
    ref,
  ) => {
    const dynamicStyles: TextStyle = {
      height,
      fontSize,
      backgroundColor: disable ? colors.gray.light : backgroundColor,
      color: isValid ? colors.absolute.white : colors.gray.main,
      paddingHorizontal: padding,
      paddingVertical: 10,
      textAlignVertical: 'center',
    };

    const lineColor = isValid ? colors.absolute.white : colors.gray.main;

    return (
      <View style={styles.component}>
        <TextInput
          ref={ref}
          style={[styles.input, dynamicStyles, style]}
          placeholder={placeholder}
          defaultValue={defaultValue}
          onChangeText={onChangeText}
          placeholderTextColor={colors.primary.main}
          editable={editable}
          secureTextEntry={secureTextEntry}
        />
        {isGuide && !loading && !checked && <Text style={styles.guideText}>{guideText}</Text>}
        {loading && (
          <ActivityIndicator
            size="small"
            color={colors.yellow.dark}
            style={{
              position: 'absolute',
              right: 0,
              width: 16,
              height: 16,
            }}
          />
        )}
        <CheckIcon
          width={16}
          height={16}
          style={{
            position: 'absolute',
            right: 0,
            top: 12,
            opacity: checked && !loading ? 1 : 0,
          }}
        />

        <View style={[styles.underline, { backgroundColor: lineColor }]} />
        {errorMessage &&
          (isError ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : (
            <Text style={[styles.errorText, { color: 'transparent' }]} />
          ))}
      </View>
    );
  },
);

export default CommonInput;
