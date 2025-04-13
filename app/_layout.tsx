import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Slot } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { PostProvider } from '@/contexts/PostContext';
import { UserProvider } from '@/contexts/UserContext';

export const queryClient = new QueryClient();

export const RootLayout = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheetModalProvider>
          <PostProvider>
            <UserProvider>
              <Slot />
            </UserProvider>
          </PostProvider>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
};

export default RootLayout;
