import { Feature, GeoJsonProperties, Point } from 'geojson';

import { InstitutionBoundType } from '@/types/maps';

export const mock: Feature<Point, GeoJsonProperties>[] = [
  {
    id: 1,
    geometry: {
      coordinates: [129.082345, 35.231689],
      type: 'Point',
    },
    properties: {
      screenPointX: 10,
      screenPointY: 30,
    },
    type: 'Feature',
  },
  {
    id: 2,
    geometry: {
      coordinates: [129.08201478510563, 35.2317805223302],
      type: 'Point',
    },
    properties: {
      screenPointX: 14,
      screenPointY: 3,
    },
    type: 'Feature',
  },
];

export const isOutOfBound = (latitude: number, longitude: number, bound: InstitutionBoundType | null) => {
  return (
    bound &&
    (latitude < bound.startLat || latitude > bound.endLat || longitude < bound.startLon || longitude > bound.endLon)
  );
};
