import { StyleSheet } from 'react-native';

const mapStyles = StyleSheet.create({
  matchParent: {
    flex: 1,
  },
  customCalloutText: {
    color: 'black',
    fontSize: 16,
  },
  calloutContainerStyle: {
    backgroundColor: 'white',
    width: 60,
    height: 40,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    padding: 36,
    alignItems: 'center',
    zIndex: 100,
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  button: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    backgroundColor: '#354BA5',
    padding: 10,
    borderRadius: 8,
    zIndex: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default mapStyles;
