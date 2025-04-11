import { StyleSheet } from 'react-native';

import colors from '@/types/colors';

const styles = StyleSheet.create({
  view: {
    alignItems: 'flex-start',
    gap: 20,
    paddingBottom: 24,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingBottom: 12,
  },
  heading: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    gap: 8,
  },
  element: {
    flex: 1,
    width: '100%',
    gap: 12,
    paddingBottom: 12,
  },
  signText: {
    color: colors.text.white,
    textAlign: 'center',
    marginTop: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.text.white,
  },
});

export default styles;
