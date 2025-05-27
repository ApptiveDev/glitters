import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, View } from 'react-native';
import { WebView } from 'react-native-webview';

import { getPostById } from '@/api/posts';
import { CreateGlitterButton } from '@/components/features/CreateGlitterButton';
import Loading from '@/components/features/Loading';
import { MapPostBottomSheet } from '@/components/features/MapPostBottomSheet';
import { RemainPost } from '@/components/features/RemainPost';
import { StartChatModal } from '@/components/features/StartChatModal';
import { useLayout } from '@/contexts/LayoutContext';
import { usePost } from '@/contexts/PostContext';
import { GetPostResponseType } from '@/types/post';
import { getToken } from '@/utils/authStorage';
import { getCurrentLocation } from '@/utils/getCurrentLocation';

import styles from './styles';

const MapSearch = () => {
  const [contentHeight, setContentHeight] = useState(300);
  const [sendChatModalVisible, setSendChatModalVisible] = useState(false);
  const [post, setPost] = useState<GetPostResponseType>();
  const [isVisible, setIsVisible] = useState(false);
  const { postId } = useLocalSearchParams();
  const [token, setToken] = useState<string | null>(null);

  const { insetBottom } = useLayout();
  const { bound } = usePost();
  const webViewRef = useRef<WebView | null>(null);

  const [currentPosition, setCurrentPosition] = useState<{ latitude: number; longitude: number } | null>(null);

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

  const sendMessage = () => {
    if (token && webViewRef.current) {
      webViewRef.current.postMessage(JSON.stringify({ token }));
    }
  };

  const handleButtonPress = () => {
    if (!currentPosition) return;
    router.push({
      pathname: '/maps/create',
      params: {
        currentLat: String(currentPosition.latitude),
        currentLon: String(currentPosition.longitude),
      },
    });
  };

  useEffect(() => {
    if (!bound) return;
    getCurrentLocation({ bound }).then(({ location, errorMsg }) => {
      if (location) setCurrentPosition(location);
      else Alert.alert('위치 정보 오류', errorMsg || '위치 정보를 가져오는 데 실패했습니다.');
    });
  }, [bound]);

  useEffect(() => {
    if (post) setIsVisible(true);
  }, [post]);

  if (!token || !webViewRef) return <Loading />;

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
  return (
    <View style={styles.container}>
      {token && (
        <WebView
          ref={webViewRef}
          source={{ uri: 'https://webview.banjjak.me' }}
          onLoad={sendMessage}
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
        bottom={isVisible ? 96 - insetBottom + 24 + contentHeight + 40 : 120 - insetBottom + 24}
      />
      {/* <ClusteredMarkerModal
        isVisible={isListOpen}
        clusterMarkers={clusterMarkers}
        setPost={setPost}
        setIsVisible={setIsVisible}
        setIsListOpen={setIsListOpen}
      /> */}
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
