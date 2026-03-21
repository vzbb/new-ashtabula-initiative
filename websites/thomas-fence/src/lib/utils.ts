import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Haversine formula to calculate distance between two lat/lng points in feet
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 20902231; // Radius of the earth in feet
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in feet
  return d;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

// Calculate area of a polygon in square feet using Shoelace formula
export function calculateArea(points: [number, number][]): number {
  if (points.length < 3) return 0;
  
  // Convert lat/lng to approximate local flat coordinates (feet)
  const lat0 = points[0][0];
  const lon0 = points[0][1];
  
  const flatPoints = points.map(p => {
    const x = calculateDistance(lat0, lon0, lat0, p[1]) * (p[1] > lon0 ? 1 : -1);
    const y = calculateDistance(lat0, lon0, p[0], lon0) * (p[0] > lat0 ? 1 : -1);
    return [x, y];
  });

  let area = 0;
  for (let i = 0; i < flatPoints.length; i++) {
    const j = (i + 1) % flatPoints.length;
    area += flatPoints[i][0] * flatPoints[j][1];
    area -= flatPoints[j][0] * flatPoints[i][1];
  }
  
  return Math.abs(area / 2);
}
