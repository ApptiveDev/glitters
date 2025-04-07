import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Slot } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

import { UserProvider } from '@/contexts/UserContext';
import colors from '@/types/colors';

const queryClient = new QueryClient();

export const RootLayout = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaView style={{ flex: 1, backgroundColor: `${colors.background}` }}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <BottomSheetModalProvider>
            <UserProvider>
              <Slot />
            </UserProvider>
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </SafeAreaView>
    </QueryClientProvider>
  );
};

export default RootLayout;
