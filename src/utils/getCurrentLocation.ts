import * as Location from 'expo-location';
import { Alert } from 'react-native';

import { InstitutionBoundType, LocationType } from '@/types/maps';

type GetCurrentLocationParams = {
  bound: InstitutionBoundType | null;
};

export const getCurrentLocation = async ({
  bound,
}: GetCurrentLocationParams): Promise<{
  location: LocationType | null;
  errorMsg: string | null;
}> => {
  if (!bound) {
    return { location: null, errorMsg: null };
  }

  const { status: fgStatus } = await Location.requestForegroundPermissionsAsync();
  if (fgStatus !== 'granted') {
    Alert.alert(
      '위치 권한 필요',
      '위치 권한을 허용하지 않으면 기본 위치가 사용됩니다.\n설정에서 권한을 변경할 수 있어요.',
      [{ text: '확인' }],
    );
    return {
      location: {
        latitude: bound.defaultLat,
        longitude: bound.defaultLon,
      },
      errorMsg: '위치 권한이 거부되었습니다.',
    };
  }

  try {
    const current = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = current.coords;
    const isInBounds =
      latitude >= Math.min(bound.startLat, bound.endLat) &&
      latitude <= Math.max(bound.startLat, bound.endLat) &&
      longitude >= Math.min(bound.startLon, bound.endLon) &&
      longitude <= Math.max(bound.startLon, bound.endLon);

    return {
      location: isInBounds ? { latitude, longitude } : { latitude: bound.defaultLat, longitude: bound.defaultLon },
      errorMsg: null,
    };
  } catch {
    return {
      location: null,
      errorMsg: '위치 정보를 가져오는 데 실패했습니다.',
    };
  }
};

export default getCurrentLocation;
