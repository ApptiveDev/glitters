import { StyleSheet } from 'react-native';

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
});

export default styles;
