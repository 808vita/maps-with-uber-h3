import L from "leaflet";

import Line from "leaflet-routing-machine/src/line";

/**
 *
 * @param L
 * @param waypoints
 * @param mapRef
 * @returns L.Routing.Control
 *
 * routing util which uses routing to generates paths
 */
export const routingUtilExported = (waypoints: any[], mapRef: L.Map) => {
  let routeControl: L.Routing.Control = L.Routing.control({
  //   router: L.Routing.osrmv1({
  //     serviceUrl: 'https://routing.openstreetmap.de/routed-car/route/v1',
  // }),
    waypoints: waypoints,
    // routeWhileDragging: true,
    // showAlternatives: false,
    addWaypoints: false,

    //@ts-ignore
    draggableWaypoints: false,

    //show collapsable button on all view ports
    collapsible: true,

    //return falsey value to disable placing markers
    createMarker: function (p1: any, p2: any) {},
    routeLine(route, options) {
      /**
       * ['name', 'coordinates', 'instructions', 'summary', 'waypointIndices', 'inputWaypoints', 'waypoints', 'properties', 'routesIndex']
       */
      console.log(route, "route");
      console.log(options, "options");
      console.log(Object.keys(route), "route keys");
      Object.keys(route).map((key) => console.log(route[key], key));

      return new Line(route, options);
    },

    //@ts-ignore
    geocoder: L.Control.Geocoder.nominatim(),
  }).addTo(mapRef);
  console.log(`oof ${waypoints.length}`);

  return routeControl;
};
