import { createContext, useContext, useMemo, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type LayoutContextType = {
  insetBottom: number;
  setInsetBottom: (insetBottom: number) => void;
  insetTop: number;
  setInsetTop: (insetTop: number) => void;
  safeHeight: number;
  setSafeHeight: (safeHeight: number) => void;
  entireHeight: number;
  setEntireHeight: (entireHeight: number) => void;
};

const LayoutContext = createContext<LayoutContextType | null>(null);

export const LayoutProvider = ({ children }: { children: React.ReactNode }) => {
  const insets = useSafeAreaInsets();
  const [insetBottom, setInsetBottom] = useState(insets.bottom);
  const [insetTop, setInsetTop] = useState(insets.top);
  const { height } = useWindowDimensions();
  const [safeHeight, setSafeHeight] = useState(height - insets.top - insets.bottom);
  const [entireHeight, setEntireHeight] = useState(height);

  const value = useMemo(
    () => ({
      insetBottom,
      setInsetBottom,
      insetTop,
      setInsetTop,
      safeHeight,
      setSafeHeight,
      entireHeight,
      setEntireHeight,
    }),
    [entireHeight, insetBottom, insetTop, safeHeight],
  );

  return <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>;
};

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) throw new Error('Error');
  return context;
};
export default LayoutContext;
