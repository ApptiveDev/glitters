import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, View } from 'react-native';
import WebView from 'react-native-webview';

import { getPostById } from '@/api/posts';
import { CreateGlitterButton } from '@/components/features/CreateGlitterButton';
import Loading from '@/components/features/Loading';
import { MapPostBottomSheet } from '@/components/features/MapPostBottomSheet';
import { RemainPost } from '@/components/features/RemainPost';
import { StartChatModal } from '@/components/features/StartChatModal';
import { useLayout } from '@/contexts/LayoutContext';
import { usePost } from '@/contexts/PostContext';
import { GetPostResponseType } from '@/types/post';
import { getCurrentLocation } from '@/utils/getCurrentLocation';
import { getToken } from '@/utils/authStorage';

import styles from './styles';

const MapSearch = () => {
  const [contentHeight, setContentHeight] = useState(300);
  const [sendChatModalVisible, setSendChatModalVisible] = useState(false);
  const [post, setPost] = useState<GetPostResponseType>();
  const [isVisible, setIsVisible] = useState(false);
  const { postId } = useLocalSearchParams();

  const { insetBottom } = useLayout();
  const { bound } = usePost();

  const [currentPosition, setCurrentPosition] = useState<{ latitude: number; longitude: number } | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const webViewRef = useRef<WebView | null>(null);

  useEffect(() => {
    if (!postId) return;
    async function fetchPost() {
      const selectedPost = await getPostById({ postId: Number(postId) });
      if (selectedPost) {
        setPost(selectedPost);
        setIsVisible(true);
        setCurrentPosition({
          latitude: selectedPost.latitude,
          longitude: selectedPost.longitude,
        });
      }
    }
    fetchPost();
  }, [postId]);

  useEffect(() => {
    const fetchToken = async () => {
      const appToken = await getToken();
      if (appToken) {
        setToken(appToken);
      }
    };
    fetchToken();
  }, []);

  const handleButtonPress = () => {
    router.push({
      pathname: '/maps/create',
      params: {
        currentLat: String(bound?.defaultLat),
        currentLon: String(bound?.defaultLon),
      },
    });
  };

  useEffect(() => {
    if (post) setIsVisible(true);
  }, [post]);

  const sendMessage = () => {
    if (token && webViewRef.current) {
      webViewRef.current.postMessage(JSON.stringify({ token }));
    }
  };

  const onMessage = async (event: any) => {
    const { data } = event.nativeEvent;
    try {
      const parsedData = JSON.parse(data);
      if (parsedData.postId) {
        const selectedPost = await getPostById({ postId: parsedData.postId });
        if (selectedPost) {
          setPost(selectedPost);
        }
      }
    } catch {
      Alert.alert('오류', '메시지 데이터를 처리하는 중 오류가 발생했습니다.');
    }
  };

  if (!token) return <Loading />;

  return (
    <View style={styles.container}>
        {token && (
          <WebView
            style={{ flex: 1 }}
            androidLayerType="software"
            pointerEvents={sendChatModalVisible ? 'none' : 'auto'}
            source={{ uri: `https://webview.banjjak.me?token=${token}` }}
            injectedJavaScript={`
              // WebGL 지원 여부 체크
              const canvas = document.createElement('canvas');
              const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
              const webglSupported = !!(window.WebGLRenderingContext && gl);

              // JS 에러 후킹
              console.error = (function(orig) {
                return function(...args) {
                  window.ReactNativeWebView.postMessage(JSON.stringify({ jsError: args.join(" ") }));
                  orig.apply(console, args);
                };
              })(console.error);

              // WebGL 결과 전송
              window.ReactNativeWebView.postMessage(JSON.stringify({ webgl: webglSupported }));

              true;
            `}
            userAgent="Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1"
            onMessage={onMessage}
          />
        )}
        <RemainPost />
        <MapPostBottomSheet
          isVisible={isVisible}
          post={post}
          setPost={setPost}
          setIsVisible={setIsVisible}
          setSendChatModalVisible={setSendChatModalVisible}
          setContentHeight={setContentHeight}
          contentHeight={contentHeight}
        />
        <CreateGlitterButton
          onPress={handleButtonPress}
          bottom={isVisible ? 80 - insetBottom - 12 + contentHeight + 40 : 80 - insetBottom + 24}
        />
        <StartChatModal
          visible={sendChatModalVisible}
          setVisible={setSendChatModalVisible}
          postId={post?.id || 0}
          markerIdx={post?.markerIdx || 0}
          title={post?.title || ''}
        />
    </View>
  );
};

export default MapSearch;
