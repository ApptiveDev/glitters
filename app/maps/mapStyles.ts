import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#404C7A' },
  map: { flex: 1 },
  overlay: { position: 'absolute', top: 50, left: 20 },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#404C7A',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;
