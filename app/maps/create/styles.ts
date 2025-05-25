import { StyleSheet } from 'react-native';

import colors from '@/types/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: `${colors.background}`,
    justifyContent: 'flex-start',
    paddingTop: 50,
    width: '100%',
  },
  TextInput: {
    width: 100,
    height: 50,
    borderWidth: 1,
    borderColor: `${colors.gray.dark}`,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: `${colors.absolute.white}`,
    flex: 1,
  },
  button: {
    backgroundColor: `${colors.yellow.dark}`,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 20,
    marginBottom: 50,
  },
});

export default styles;
