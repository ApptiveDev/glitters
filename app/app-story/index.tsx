/* eslint-disable global-require */
import { useRef } from 'react';
import { Animated, useWindowDimensions, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { PageIndicator } from 'react-native-page-indicator';

import AppStart from '@/components/features/AppStart';
import { useLayout } from '@/contexts/LayoutContext';
import colors from '@/types/colors';

const pages = [
  {
    index: 0,
    src: require('@/assets/images/story/1.png'),
  },
  {
    index: 1,
    src: require('@/assets/images/story/2.png'),
  },
  {
    index: 2,
    src: require('@/assets/images/story/3.png'),
  },
];

export const AppStory = () => {
  const { width, height } = useWindowDimensions();
  const { insetBottom } = useLayout();
  const scrollX = useRef(new Animated.Value(0)).current;
  const animatedCurrent = useRef(Animated.divide(scrollX, width)).current;

  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width,
        height,
        backgroundColor: colors.backgroundmypage,
        paddingBottom: insetBottom,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Animated.ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
          useNativeDriver: true,
        })}
      >
        {pages.map((page) => (
          <View
            key={page.index}
            style={{
              width,
              height,
              backgroundColor: colors.absolute.white,
            }}
          >
            <FastImage
              source={page.src}
              style={{
                flex: 1,
                width: '100%',
                height: '100%',
              }}
              resizeMode={FastImage.resizeMode.cover}
            />
          </View>
        ))}
        <AppStart />
      </Animated.ScrollView>
      <PageIndicator
        count={4}
        variant="beads"
        color={colors.backgroundLight}
        activeColor={colors.yellow.main}
        scale={1.2}
        current={animatedCurrent}
      />
    </View>
  );
};

export default AppStory;
