import { Feature, GeoJsonProperties, Point } from 'geojson';

const mock: Feature<Point, GeoJsonProperties>[] = [
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

export default mock;
