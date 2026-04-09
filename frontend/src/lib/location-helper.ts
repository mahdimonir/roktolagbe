/**
 * OpenRouteService (ORS) Helper
 * Used for Geocoding (Location to Lat/Lng) and Distance calculations.
 * Get your free API key at: https://openrouteservice.org/
 */

const ORS_API_KEY = process.env.NEXT_PUBLIC_ORS_API_KEY;
const BASE_URL = 'https://api.openrouteservice.org';

export interface LocationData {
  name: string;
  lat: number;
  lng: number;
}

/**
 * Convert a text location string (e.g., "Dhaka") into Coordinates
 */
export const geocodeLocation = async (text: string): Promise<LocationData | null> => {
  if (!ORS_API_KEY || !text) return null;

  try {
    const response = await fetch(
      `${BASE_URL}/geocode/search?api_key=${ORS_API_KEY}&text=${encodeURIComponent(text)}&size=1`
    );
    const data = await response.json();

    if (data.features && data.features.length > 0) {
      const feature = data.features[0];
      return {
        name: feature.properties.label || text,
        lng: feature.geometry.coordinates[0],
        lat: feature.geometry.coordinates[1],
      };
    }
    return null;
  } catch (error) {
    console.error('Geocoding Error:', error);
    return null;
  }
};

/**
 * Calculate distance between two points (Haversine formula)
 * Returning approximate KM for proximity sorting.
 */
export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // Earth radius in KM
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};
