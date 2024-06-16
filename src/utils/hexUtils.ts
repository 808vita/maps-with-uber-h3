import * as h3 from "h3-js";

/**
 *
 * @param res
 * @param latLng
 * @returns h3index string
 *
 * util to generate h3index from latlng
 *
 * Convert a lat/lng point to a hexagon index at resolution 10
 *
 * 0 (continental) to res 15 (1 square meter). Res 9 is roughly a city block
 *
 * setting default to 11
 */
export const h3indexUtil = (
  latLng: L.LatLng,
  setH3IndexList: (
    value: React.SetStateAction<any[] | [] | [string[]]>
  ) => void,
  res = 11
) => {
  // Convert a lat/lng point to a hexagon index at resolution 10
  // 0 (continental) to res 15 (1 square meter). Res 9 is roughly a city block
  const h3Index: string = h3.latLngToCell(latLng.lat, latLng.lng, res);

  console.log(h3Index, "h3Index");

  setH3IndexList((prev) => [...prev, h3Index]);

  return h3Index;
};

/**
 *
 * @param h3Index
 * @returns [latlng] | h3.CoordPair
 *
 * Get the center of the hexagon
 */
export const hexCenterCoordinatesUtil = (
  h3Index: string,
  setHexCenterCoordinatesList: (
    value: React.SetStateAction<any[] | [] | [L.LatLng[]]>
  ) => void
) => {
  // Get the center of the hexagon
  const hexCenterCoordinates: h3.CoordPair = h3.cellToLatLng(h3Index);

  console.log(hexCenterCoordinates, "hexCenterCoordinates");

  setHexCenterCoordinatesList((prev) => [...prev, hexCenterCoordinates]);

  return hexCenterCoordinates;
};

/**
 *
 * @param h3Index
 * @param hexBoundaryList
 * @param setHexBoundaryList
 *
 * generate hex boundaries [[lat,lng]]
 *
 * store to hexBoundaryList
 *
 *
 */
export const hexBoundaryUtil = (
  h3Index: string,
  setHexBoundaryList: (
    value: React.SetStateAction<any[] | [] | [L.LatLng[]]>
  ) => void
) => {
  // Get the vertices of the hexagon
  const hexBoundary: h3.CoordPair[] = h3.cellToBoundary(h3Index);
  console.log(hexBoundary, "hexBoundary");

  setHexBoundaryList((prev) => [...prev, hexBoundary]);
};
