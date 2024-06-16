/**
 *
 * @param L
 * @param mapRef
 * @param latLng
 * @param reverseCodedWaypoints
 * @param setReverseCodedWaypoints
 *
 * geocoding util takes in latlngs and generates stringed address - reverse geocoding
 *
 * stringed addresses are stored to reverseCodedWaypoints state
 */
export const geocodingUtilExported = (
  L: any,
  mapRef: any,
  latLng: any,
  reverseCodedWaypoints: any[],
  setReverseCodedWaypoints: any
) => {
  // trying geocoding -- this works
  //@ts-ignore
  let geocoder = new L.Control.Geocoder.nominatim();

  // let scalingAccuracy = mapRef.options.crs.scale(mapRef.getZoom())
  let scalingAccuracy = mapRef?.options.crs.scale(20);
  console.log(scalingAccuracy, "scalingAccuracy");

  let reverseCodedValue = "";

  geocoder.reverse(latLng, scalingAccuracy, function (results: any) {
    let address = "";
    if (results?.length > 0) {
      let reverseCoded = results[0];
      console.log(reverseCoded, "reverseCoded");
      address = reverseCoded.name;
    }

    if (address != "") {
      reverseCodedValue = address;
      setReverseCodedWaypoints([...reverseCodedWaypoints, reverseCodedValue]);
    }

    if (address == "") {
      // latlng address fallback - if returns empty string set lat lng template string
      reverseCodedValue = `Lat: ${latLng.lat} , Lng: ${latLng.lng}`;
      setReverseCodedWaypoints([...reverseCodedWaypoints, reverseCodedValue]);
    }

    if (address != "") {
      /**
       * geocoding string address to coordinates
       */
      geocoder.geocode(address, function (results: any) {
        console.log(results);
        if (results?.length > 0) {
          let latLngoof = new L.LatLng(
            results[0].center.lat,
            results[0].center.lng
          );
          console.log(results);
          console.log(latLngoof, "latLngoof");
        }
      });
    }
  });
};
