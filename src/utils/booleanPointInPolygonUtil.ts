/**
 *
 * @param latLng
 * @param polygonBoundary
 * @returns boolean
 *
 * check if a latlng exists inside polygon
 *
 * returns boolean
 *
 * uses ray casting
 *
 */
export const booleanPointInPolygonUtil = (
  latLng: L.LatLng,
  polygonBoundary: L.LatLng[]
) => {
  let polyPoints = polygonBoundary;

  let x = latLng.lat;
  let y = latLng.lng;

  let inside = false;
  for (let i = 0, j = polyPoints.length - 1; i < polyPoints.length; j = i++) {
    let xi = polyPoints[i].lat;
    let yi = polyPoints[i].lng;
    let xj = polyPoints[j].lat;
    let yj = polyPoints[j].lng;

    let intersect =
      yi > y != yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }

  return inside;
};
