import Constants from 'expo-constants';

const fetchNearestPlaceName = async (lat: number, lng: number) => {
  const GOOGLE_API_KEY = Constants.expoConfig?.extra?.googleApiKey;
  const radius = 30;
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&language=ko&key=${GOOGLE_API_KEY}`;

  const res = await fetch(url);
  const data = await res.json();

  if (data.results && data.results.length > 0) {
    return data.results[1];
  }

  return null;
};

export default fetchNearestPlaceName;
