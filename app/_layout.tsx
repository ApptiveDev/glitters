import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Slot } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { Provider as PaperProvider } from 'react-native-paper';

import { LayoutProvider, useLayout } from '@/contexts/LayoutContext';
import { PostProvider } from '@/contexts/PostContext';
import { UserProvider } from '@/contexts/UserContext';
import { useNotificationListener } from '@/hooks/useNotificationListener';
import colors from '@/types/colors';

export const queryClient = new QueryClient();

const InnerLayout = () => {
  const { insetTop } = useLayout();

  return (
    <>
      <Slot />
      <Toast topOffset={insetTop || 60} />
    </>
  );
};

export const RootLayout = () => {
  useNotificationListener();
  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaView
          edges={['bottom']}
          style={{
            flex: 1,
            backgroundColor: colors.background,
          }}
        >
          <BottomSheetModalProvider>
            <LayoutProvider>
              <PostProvider>
                <UserProvider>
                  <InnerLayout />
                </UserProvider>
              </PostProvider>
            </LayoutProvider>
          </BottomSheetModalProvider>
        </SafeAreaView>
      </GestureHandlerRootView>
      </PaperProvider>
    </QueryClientProvider>
  );
};

export default RootLayout;
