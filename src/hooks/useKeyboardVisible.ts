import { useEffect, useState } from 'react';
import { Keyboard, KeyboardEvent } from 'react-native';

export const useKeyboardVisible = () => {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const handleKeyboardShow = (e: KeyboardEvent) => {
      setKeyboardVisible(true);
      setKeyboardHeight(e.endCoordinates.height);
    };

    const handleKeyboardHide = () => {
      setKeyboardVisible(false);
      setKeyboardHeight(0);
    };

    const showSub = Keyboard.addListener('keyboardDidShow', handleKeyboardShow);
    const hideSub = Keyboard.addListener('keyboardDidHide', handleKeyboardHide);

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return { isKeyboardVisible, keyboardHeight };
};

export default useKeyboardVisible;
