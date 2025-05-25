export type ClusterColor = {
  light: string;
  dark: string;
  innerSize: number;
  outerSize: number;
};

export const getClusterColor = (clusterCount: number) => {
  if (clusterCount < 5) {
    return {
      light: '#8793C2',
      dark: '#7D8BC0',
      innerSize: 28,
      outerSize: 40,
    };
  }
  if (clusterCount < 10) {
    return {
      light: '#8793C2',
      dark: '#7282C0',
      innerSize: 38,
      outerSize: 50,
    };
  }
  if (clusterCount < 20) {
    return {
      light: '#8793C2',
      dark: '#6271AA',
      innerSize: 48,
      outerSize: 60,
    };
  }
  return {
    light: '#8793C2',
    dark: '#515F95',
    innerSize: 64,
    outerSize: 80,
  };
};
