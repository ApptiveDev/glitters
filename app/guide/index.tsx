import { Text, View } from 'react-native';

export const Guide = () => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text style={{ color: '#fff' }}>Guide</Text>
    </View>
  );
};

export default Guide;
