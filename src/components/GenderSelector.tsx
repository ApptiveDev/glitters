import React from 'react';
import { Pressable, Text, View } from 'react-native';

import colors from '@/types/colors';

interface GenderSelectorProps {
  selected: number;
  onSelect: (gender: number) => void;
  isError?: boolean;
  errorMessage?: string;
}

const GenderSelector = ({ selected, onSelect, isError = false, errorMessage = '' }: GenderSelectorProps) => {
  const genderLabels = ['남성', '여성'];
  return (
    <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start' }}>
      <View style={{ flexDirection: 'row', gap: 12 }}>
        {[0, 1].map((gender) => {
          const isSelected = selected === gender;
          return (
            <Pressable
              key={gender}
              onPress={() => onSelect(gender)}
              style={{
                flex: 1,
                paddingVertical: 16,
                backgroundColor: isSelected ? colors.primary.light : colors.primary.dark,
                borderRadius: 12,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text
                style={{
                  color: isSelected ? colors.absolute.white : colors.primary.main,
                  fontWeight: 'bold',
                  fontSize: 16,
                }}
              >
                {genderLabels[gender]}
              </Text>
            </Pressable>
          );
        })}
      </View>
      {isError && (
        <Text
          style={{
            color: colors.error,
            fontSize: 12,
            marginTop: 8,
            textAlign: 'center',
          }}
        >
          {errorMessage}
        </Text>
      )}
    </View>
  );
};

export default GenderSelector;
