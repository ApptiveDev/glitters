import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Slot } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PostProvider } from '@/contexts/PostContext';
import { UserProvider } from '@/contexts/UserContext';
import colors from '@/types/colors';

export const queryClient = new QueryClient();

export const RootLayout = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaView
          edges={['bottom']}
          style={{
            flex: 1,
            backgroundColor: colors.background,
          }}
        >
          <BottomSheetModalProvider>
            <PostProvider>
              <UserProvider>
                <Slot />
              </UserProvider>
            </PostProvider>
          </BottomSheetModalProvider>
        </SafeAreaView>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
};

export default RootLayout;
