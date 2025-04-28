import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

import { InstitutionBound, LocationType } from '@/types/maps';

type UseCurrentLocationProps = {
  bound: InstitutionBound;
};

export const useCurrentLocation = ({ bound }: UseCurrentLocationProps) => {
  const [location, setLocation] = useState<LocationType | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('위치 권한이 거부되었습니다.');
        setLocation({
          latitude: bound.defaultLat,
          longitude: bound.defaultLon,
        });
        Alert.alert(
          '위치 권한 필요',
          '위치 권한을 허용하지 않으면 기본 위치가 사용됩니다.\n설정에서 권한을 변경할 수 있어요.',
          [{ text: '확인' }],
        );
        setLoading(false);
        return;
      }

      try {
        const current = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = current.coords;
        const isInBounds =
          latitude >= Math.min(bound.startLat, bound.endLat) &&
          latitude <= Math.max(bound.startLat, bound.endLat) &&
          longitude >= Math.min(bound.startLon, bound.endLon) &&
          longitude <= Math.max(bound.startLon, bound.endLon);

        if (!isInBounds) {
          setLocation({
            latitude: bound.defaultLat,
            longitude: bound.defaultLon,
          });
        } else {
          setLocation({
            latitude,
            longitude,
          });
        }
      } catch {
        setErrorMsg('위치 정보를 가져오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    })();
  }, [bound.defaultLat, bound.defaultLon, bound.endLat, bound.endLon, bound.startLat, bound.startLon]);

  return { location, errorMsg, loading };
};

export default useCurrentLocation;
