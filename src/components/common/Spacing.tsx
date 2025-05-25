import { View } from 'react-native';

interface SpacingProps {
  height: number;
}

export const Spacing = ({ height }: SpacingProps) => {
  return (
    <View
      style={{
        height,
        width: '100%',
      }}
    />
  );
};
export default Spacing;
