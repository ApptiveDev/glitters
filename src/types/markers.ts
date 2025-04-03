import { Feature, GeoJsonProperties, Geometry } from 'geojson';

export interface MarkerType {
  id: number;
  postId: number;
  latitude: number;
  longitude: number;
  expiresAt: string;
}

export interface MarkerResponse {
  markers: MarkerType[];
}

export type MapMarker = Feature<Geometry, GeoJsonProperties>;
export type MapMarkers = MapMarker[];
