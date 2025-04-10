import React from 'react';
import { Pressable, Text, View } from 'react-native';

import colors from '@/types/colors';

interface GenderSelectorProps {
  selected: '남성' | '여성' | '';
  onSelect: (gender: '남성' | '여성') => void;
  isError?: boolean;
  errorMessage?: string;
}

const GenderSelector = ({ selected, onSelect, isError = false, errorMessage = '' }: GenderSelectorProps) => {
  return (
    <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start' }}>
      <View style={{ flexDirection: 'row', gap: 12 }}>
        {['남성', '여성'].map((gender) => {
          const isSelected = selected === gender;
          return (
            <Pressable
              key={gender}
              onPress={() => onSelect(gender as '남성' | '여성')}
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
                {gender}
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
