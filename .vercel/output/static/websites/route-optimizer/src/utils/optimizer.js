/**
 * Simple Nearest Neighbor TSP solver
 * @param {Array} points - Array of {lat, lng, id, ...}
 * @param {Object} startPoint - The starting point {lat, lng}
 * @returns {Array} - Optimized array of points
 */
export function optimizeRoute(points, startPoint) {
  if (points.length <= 1) return points;

  const unvisited = [...points];
  const optimized = [];
  let currentPos = startPoint;

  while (unvisited.length > 0) {
    let nearestIdx = 0;
    let minDist = Infinity;

    for (let i = 0; i < unvisited.length; i++) {
      const dist = calculateDistance(currentPos, unvisited[i]);
      if (dist < minDist) {
        minDist = dist;
        nearestIdx = i;
      }
    }

    const nextPoint = unvisited.splice(nearestIdx, 1)[0];
    optimized.push(nextPoint);
    currentPos = nextPoint;
  }

  return optimized;
}

/**
 * Basic Haversine distance or simple Euclidean for MVP
 */
function calculateDistance(p1, p2) {
  const dx = p1.lat - p2.lat;
  const dy = p1.lng - p2.lng;
  return Math.sqrt(dx * dx + dy * dy);
}

export function formatDistance(km) {
  return (km * 0.621371).toFixed(1) + " miles";
}
