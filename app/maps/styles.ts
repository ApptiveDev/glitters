import { StyleSheet } from 'react-native';

import colors from '@/types/colors';

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', position: 'relative' },
  map: { flex: 1 },
  overlay: { position: 'absolute', top: 50, left: 20 },
  loadingContainer: {
    flex: 1,
    backgroundColor: `${colors.background}`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#4A90E2',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: `${colors.absolute.white}`,
    fontSize: 16,
  },
  contentContainer: {
    padding: 20,
  },
  bottomSheetContainer: {},
  bottomSheetButton: {
    backgroundColor: `${colors.yellow.dark}`,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 20,
    marginBottom: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomContentView: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 24,
    height: 200,
    backgroundColor: 'transparent',
  },
  bottomSheetButtonText: {
    color: `${colors.background}`,
    fontSize: 12,
    fontWeight: 'bold',
  },
  bottomSheetMainText: {
    fontSize: 20,
    color: colors.text.white,
    fontWeight: 'bold',
  },
  bottomSheetSubText: {
    fontSize: 12,
    color: '#B2B4BF',
    textDecorationLine: 'underline',
  },
});

export default styles;
