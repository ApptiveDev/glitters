import React from 'react';
import { SvgProps } from 'react-native-svg';

import FireWork3D from '@/assets/icons/3d/firework.svg';
import Heart3D from '@/assets/icons/3d/heart.svg';
import HeartRed3D from '@/assets/icons/3d/heart_red.svg';
import Marker3D from '@/assets/icons/3d/marker_3d.svg';
import Planet3D from '@/assets/icons/3d/planet_3d.svg';
import PlanetPurple3D from '@/assets/icons/3d/planet_purple_3d.svg';
import Rocket3D from '@/assets/icons/3d/rocket_3d.svg';
import RocketPP from '@/assets/icons/3d/rocket_pp.svg';
import Scope3D from '@/assets/icons/3d/scope_3d.svg';
import Star3D from '@/assets/icons/3d/star.svg';
import Stars3D from '@/assets/icons/3d/stars_3d.svg';
import Twinkle3D from '@/assets/icons/3d/twinkle_3d.svg';

export const threeDIcons: Record<string, React.FC<SvgProps>> = {
  Marker3D,
  Planet3D,
  PlanetPurple3D,
  Rocket3D,
  RocketPP,
  Scope3D,
  Stars3D,
  Twinkle3D,
  Heart3D,
  HeartRed3D,
};

export const festivalIcons: Record<string, React.FC<SvgProps>> = {
  FireWork3D,
  Star3D,
};
