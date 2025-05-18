export type LocationType = {
  latitude: number;
  longitude: number;
};

export type InstitutionBounds = {
  bounds: Record<string, InstitutionBoundType>;
};

export type InstitutionBoundType = {
  id: number;
  institutionId: number;
  startLat: number;
  startLon: number;
  endLat: number;
  endLon: number;
  defaultLat: number;
  defaultLon: number;
  createdAt: string;
  updatedAt: string;
};

export type MarkerType = {
  id: number;
  iconIdx: number;
  postId: number;
  latitude: number;
  longitude: number;
  expiresAt: string;
  isWrittenBySelf: boolean;
  isDeactivated: boolean;
  likeCount: number;
  viewCount: number;
  isLikedBySelf: boolean;
};
