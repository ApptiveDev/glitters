/* eslint-disable global-require */
import { ImageSourcePropType } from 'react-native';

import MarkerDefault from '@/assets/icons/marker/marker.png';
import MarkerFestival from '@/assets/icons/marker/marker_festival.png';
import MarkerFriend from '@/assets/icons/marker/marker_friend.png';
import MarkerThanks from '@/assets/icons/marker/marker_thanks.png';

interface MarkerIcon {
  name: string;
  icon: ImageSourcePropType;
  explain: string;
  backgroundColor: string;
  textColor: string;
  src: string;
}

export const markerIcons: MarkerIcon[] = [
  {
    name: 'default',
    icon: MarkerDefault,
    explain: '반짝였어요.',
    backgroundColor: '#FFE9A1',
    textColor: '#495585',
    src: require('@/assets/icons/marker/marker.png'),
  },
  {
    name: 'festival',
    icon: MarkerFestival,
    explain: '대동제 같이 보고 싶어요.',
    backgroundColor: '#303238',
    textColor: '#F7B95B',
    src: require('@/assets/icons/marker/marker_festival.png'),
  },
  {
    name: 'friend',
    icon: MarkerFriend,
    explain: '친구가 되고 싶어요.',
    backgroundColor: '#AAE282',
    textColor: '#495585',
    src: require('@/assets/icons/marker/marker_friend.png'),
  },
  {
    name: 'thanks',
    icon: MarkerThanks,
    explain: '도와주셔서 너무 감사했어요.',
    backgroundColor: '#FF8585',
    textColor: '#495585',
    src: require('@/assets/icons/marker/marker_thanks.png'),
  },
];

export default markerIcons;
