import { BlurView } from 'expo-blur';
import { useMemo, useState } from 'react';
import { Image, Modal, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

import { getPostById } from '@/api/posts';
import CaretLeftIcon from '@/assets/icons/caret_left.svg';
import CaretRightIcon from '@/assets/icons/caret_right.svg';
import MarkerBySelfIcon from '@/assets/icons/marker/marker_by_self.png';
import ExitIcon from '@/assets/icons/simple_exit.svg';
import colors from '@/types/colors';
import { MarkerType } from '@/types/maps';
import { markerIcons } from '@/utils/markerIcons';

interface ClusteredMarkerModalProps {
  setIsListOpen: (isOpen: boolean) => void;
  setIsVisible: (isVisible: boolean) => void;
  isVisible: boolean;
  setPost: (post: any) => void;
  clusterMarkers: MarkerType[];
}

export const ClusteredMarkerModal = ({
  setIsListOpen,
  setIsVisible,
  setPost,
  isVisible,
  clusterMarkers,
}: ClusteredMarkerModalProps) => {
  const [page, setPage] = useState(0);
  const itemsPerPage = 4;
  const totalPages = Math.ceil(clusterMarkers.length / itemsPerPage);

  const paginatedPosts = useMemo(() => {
    const start = page * itemsPerPage;
    return clusterMarkers.slice(start, start + itemsPerPage);
  }, [page, clusterMarkers]);

  const handleLeftPress = () => {
    if (page > 0) {
      setPage((prev) => prev - 1);
    }
  };
  const handleRightPress = () => {
    if (page < Math.ceil(clusterMarkers.length / itemsPerPage) - 1) {
      setPage((prev) => prev + 1);
    }
  };

  const closeModal = () => {
    setIsVisible(false);
    setIsListOpen(false);
    setPage(0);
  };

  const handleListPress = async (item: any) => {
    const post = await getPostById({ postId: item.postId });
    setPost(post);
    setIsVisible(true);
    setIsListOpen(false);
  };

  return (
    <Modal transparent visible={isVisible} onRequestClose={closeModal}>
      <TouchableWithoutFeedback onPress={closeModal}>
        <BlurView
          intensity={20}
          tint="dark"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 15,
            backgroundColor: 'rgba(0,0,0,0.2)',
          }}
        />
      </TouchableWithoutFeedback>
      <View
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: [{ translateX: -0.5 * 320 }, { translateY: -125 }],
          width: 320,
          height: 250,
          backgroundColor: colors.primary.main,
          borderRadius: 12,
          padding: 12,
          zIndex: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
          flexDirection: 'row',
        }}
      >
        <View
          style={{
            width: '100%',
            height: 226,
            backgroundColor: colors.primary.dark,
            borderRadius: 12,
            padding: 40,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            gap: 8,
            paddingHorizontal: 12,
          }}
        >
          <CaretLeftIcon width={24} height={24} onPress={handleLeftPress} />
          <View
            style={{
              flex: 1,
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
              height: 226,
              paddingVertical: 40,
            }}
          >
            {paginatedPosts.map((marker) => (
              <TouchableOpacity
                key={marker.id + marker.title}
                style={{ marginBottom: 12, flexDirection: 'row', alignItems: 'center', gap: 8, width: '100%' }}
                onPress={() => {
                  handleListPress(marker);
                }}
              >
                {marker.isWrittenBySelf ? (
                  <Image source={MarkerBySelfIcon} style={{ width: 24, height: 24 }} />
                ) : (
                  <Image source={markerIcons[marker.markerIdx].icon} style={{ width: 24, height: 24 }} />
                )}
                <Text
                  style={{
                    fontSize: 12,
                    color: colors.text.white,
                    fontWeight: 'bold',
                    flexShrink: 1,
                  }}
                  ellipsizeMode="tail"
                  numberOfLines={1}
                >
                  {marker.title}
                </Text>
              </TouchableOpacity>
            ))}
            <Text
              style={{
                position: 'absolute',
                bottom: 10,
                left: '50%',
                transform: [{ translateX: -0.5 * 30 }],
                fontSize: 10,
                color: colors.text.grayblue,
                textAlign: 'center',
              }}
            >
              {(page + 1).toString().padStart(2, '0')} / {totalPages.toString().padStart(2, '0')}
            </Text>
          </View>
          <CaretRightIcon width={24} height={24} onPress={handleRightPress} />
          <ExitIcon width={16} height={16} onPress={closeModal} style={{ position: 'absolute', top: 16, right: 16 }} />
        </View>
      </View>
    </Modal>
  );
};

export default ClusteredMarkerModal;
