import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1, zIndex: -1 },
  overlay: { position: 'absolute', top: 50, left: 20 },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#404C7A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    left: '50%',
    bottom: 50,
    transform: [{ translateX: -75 }, { translateY: -25 }],
  },
  button: {
    backgroundColor: '#4A90E2',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  contentContainer: {
    padding: 20,
  },
  bottomSheetContainer: {},
  bottomSheetButton: {
    backgroundColor: '#FFE9A1',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 20,
    marginBottom: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomSheetButtonText: {
    color: '#404C7A',
    fontSize: 12,
    fontWeight: 'bold',
  },
  bottomSheetMainText: {
    fontSize: 16,
    color: '#FBFBFB',
  },
  bottomSheetSubText: {
    fontSize: 12,
    color: '#B2B4BF',
  },
});

export default styles;
