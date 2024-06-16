import React, { useEffect, useState } from "react";

import {
  Marker,
  Popup,
  Tooltip,
  useMap,
  useMapEvents,
  Polygon,
} from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet-control-geocoder";

import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import { markerPath } from "@/utils/leafletConfig";
import { routingUtilExported } from "@/utils/routingUtil";
import { geocodingUtilExported } from "@/utils/geocodingUtil";
import * as h3 from "h3-js";
import {
  h3indexUtil,
  hexBoundaryUtil,
  hexCenterCoordinatesUtil,
} from "@/utils/hexUtils";
import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import { booleanPointInPolygonUtil } from "@/utils/booleanPointInPolygonUtil";

// const markerPath = "/marker-icon.png";

/**
 * routeControl2 with current setup is working
 *
 * run operations on this variable to remove waypoints markers, routing points
 *
 */
let routeControl2: L.Routing.Control | null = null;

/**
 *
 * @param props
 * @returns jsx
 *
 * Routing machine
 *
 * holds waypoints & reverseCodedWaypoints states -- currently --might alter later
 *
 * has menu component - trigger routing , clear markers
 *
 * controls map events - double click to place markers ,reverse geocode and then use it routing path
 *
 */
const RoutingMachineController = (props: any) => {
  /**
   * waypoints on double click stored here
   *
   * later used for reverse geocoidng and routing machine
   */
  const [waypoints, setWaypoints] = useState<L.LatLng[] | [] | any[]>([]);

  /**
   * reverse geocoded strings are stored here
   */
  const [reverseCodedWaypoints, setReverseCodedWaypoints] = useState<
    [] | any[] | string[]
  >([]);

  /**
   * routing menu visiblity state
   */
  const [showMenu, setShowMenu] = useState<boolean>(true);

  /**
   * h3index gets stored here
   */
  const [h3IndexList, setH3IndexList] = useState<[] | any[] | string[]>([]);

  /**
   * hexCenterCoordinates gets stored here
   * list of [lat,lng]
   */
  const [hexCenterCoordinatesList, setHexCenterCoordinatesList] = useState<
    [] | any[] | L.LatLng[]
  >([]);

  /**
   * hexBoundary gets stored here
   * list of latlng boundary data
   *  [[lat,lng]]
   */
  const [hexBoundaryList, setHexBoundaryList] = useState<
    [] | any[] | [L.LatLng[]]
  >([]);

  /**
   * polygon boundary gets stored here
   * list of latlng boundary data
   *  [[lat,lng]]
   */
  const [polygonBoundaryList, setPolygonBoundaryList] = useState<
    [] | any[] | [L.LatLng[]]
  >([]);

  const [polygon2HexBoundaryList, setPolygon2HexBoundaryList] = useState<
    [] | any[] | [L.LatLng[]]
  >([]);

  /**
   * polygon2hex visibility
   */
  const [showPolygon2Hex, setShowPolygon2Hex] = useState<boolean>(true);

  /**
   * polygon2hex visibility
   */
  const [drawEditModeActive, setDrawEditModeActive] = useState<boolean>(false);

  /**
   * service mode options for state
   *
   * active - if rect /poly is placed
   *
   * not active - if marker is placed with no rect /poly
   *
   * not set - if no marker or rect / poly are placed
   *
   * confirmed - if rect / poly is placed and markers are placed
   */
  const serviceModeOptions = {
    active: "active",
    confirmed: "confirmed",
    notActive: "notActive",
    notSet: "notSet",
  };
  /**
   * polygon2hex visibility
   */
  const [serviceMode, setServiceMode] = useState<string>(
    serviceModeOptions.notSet
  );

  /**
   * menu visibility handler
   */
  const showMenuHandler = () => {
    setShowMenu((prev) => !prev);
  };

  /**
   * leaflet mapref used for various operations
   */
  const mapRef: L.Map = useMap();

  /**
   * routing util to trigger routing machine path geneartions
   */
  const routingUtil = () => {
    routeControl2 = routingUtilExported(waypoints, mapRef);
  };

  /**
   *
   * @param latLng
   *
   * triggers geocodingUtilExported
   *
   * tries to reverse geocode from latlng and then stores the string value to state
   */
  const geocodingUtil = (latLng: any) => {
    geocodingUtilExported(
      L,
      mapRef,
      latLng,
      reverseCodedWaypoints,
      setReverseCodedWaypoints
    );
  };

  /**
   * clear markers , paths from the map
   */
  const clearUtil = () => {
    mapRef.removeControl(routeControl2 as L.Routing.Control);
  };

  /**
   * reset the waypoint states
   *
   * empty out - waypoints , reversecodedwaypoints , indexlist , hexcenters , hexboundarylist
   */
  const resetWaypointStates = () => {
    setWaypoints([]);
    setReverseCodedWaypoints([]);
    setH3IndexList([]);
    setHexCenterCoordinatesList([]);
    setHexBoundaryList([]);
  };

  /**
   * clearbuttonhandler
   *
   * triggered using clear button from menu
   *
   * on trigger- checks if routeControl2 is not null -> then clears the map using clearutil
   *
   * always resets the waypoints and reverseCodedWaypoints
   */
  const clearButtonHandler = () => {
    if (routeControl2 !== null) clearUtil();

    resetWaypointStates();
  };

  /**
   *
   * @param latLng
   *
   * h3combo util
   *
   * generate h3index from latlng and store to state
   *
   * generate hex center coordiantes and store to state
   *
   * generate hex boundary [[lat,lng]] using h3index string and store to state.
   */
  const h3ComboUtil = (latLng: L.LatLng) => {
    const h3Index: string = h3indexUtil(latLng, setH3IndexList, 11);

    const hexCenterCoordinates: h3.CoordPair = hexCenterCoordinatesUtil(
      h3Index,
      setHexCenterCoordinatesList
    );

    hexBoundaryUtil(h3Index, setHexBoundaryList);
  };

  /**
   *
   * @param e
   *
   * uses latlng from event object and adds it to waypoints state
   *
   * if menu state is false -> sets the menu visibility to true
   *
   * triggers the geocoding util for reverse geocoding latng to stringed address
   */
  const doubleClickEventUtil = (e: L.LeafletMouseEvent | any) => {
    let latLng: L.LatLng = e.latlng;

    setWaypoints([...waypoints, L.latLng(latLng.lat, latLng.lng)]);

    if (!showMenu) {
      showMenuHandler();
    }

    geocodingUtil(latLng);

    h3ComboUtil(latLng);
  };

  /**
   * holds the mapevents
   *
   * double click map event is configured here
   */
  const mapEvents: L.Map = useMapEvents({
    click: (e) => {
      console.log(e);
      console.log(e.layerPoint);
    },
    dblclick: (e) => {
      if (drawEditModeActive) {
        return;
      }

      if (
        serviceMode === serviceModeOptions.active ||
        serviceMode === serviceModeOptions.confirmed
      ) {
        let latLng = e.latlng;
        let polygonBoundary = polygonBoundaryList[0];
        let isInsidePolygon = booleanPointInPolygonUtil(
          latLng,
          polygonBoundary
        );
        console.log(isInsidePolygon, "isInsidePolygon");

        if (isInsidePolygon) {
          doubleClickEventUtil(e);
        }
      } else {
        doubleClickEventUtil(e);
      }
    },
  });

  mapRef.pm.setPathOptions({
    color: "orange",
    // fillColor: "blue",
    fillOpacity: 0.01,
  });

  /**
   *
   * @returns boolean
   *
   * check service mode for confirmed and not active
   *
   * then boolean value is returned
   */
  const displayToolbar = () => {
    let displayBoolean: boolean =
      serviceMode !== serviceModeOptions.confirmed &&
      serviceMode !== serviceModeOptions.notActive;

    return displayBoolean;
  };

  // add Leaflet-Geoman controls with some options to the map
  mapRef.pm.addControls({
    position: "bottomleft",
    drawCircleMarker: false,
    rotateMode: false,
    // drawMarker: waypoints.length > 0 ? false : true,
    drawMarker: false,
    drawPolyline: false,
    drawCircle: false,
    cutPolygon: false,
    drawText: false,

    //conditionally show toolbar options based on polygonBoundaryList state
    drawRectangle: displayToolbar() && polygonBoundaryList.length == 0 && true,
    drawPolygon: displayToolbar() && polygonBoundaryList.length == 0 && true,
    editMode: displayToolbar() && polygonBoundaryList.length == 1 && true,
    dragMode: displayToolbar() && polygonBoundaryList.length == 1 && true,
    removalMode: displayToolbar() && polygonBoundaryList.length == 1 && true,
  });

  const latlngObj2latLngList = (polygonBoundaries: L.LatLng[]) => {
    let latLngList = polygonBoundaries.map((pair) => [pair?.lat, pair?.lng]);
    return latLngList;
  };

  const getHexagonsWithinPolygon = (polygonBoundaries: L.LatLng[], res = 9) => {
    let polygon: number[][] | number[][][] =
      latlngObj2latLngList(polygonBoundaries);

    try {
      const hexagons = h3.polygonToCells(polygon, res);

      // Get the outline of a set of hexagons,
      // do not want geojson - so passing false
      const coordinates = h3.cellsToMultiPolygon(hexagons, false);

      console.log(polygon, "polygon hex");
      console.log(hexagons, "hexagons hex");
      console.log(coordinates, "coordinates hex");

      setPolygon2HexBoundaryList(coordinates);
    } catch (error) {
      console.log(error, "oof");
    }
  };

  //Called when a shape is drawn/finished. Payload includes shape type and the drawn layer.
  // re write polygon state triggered by various events
  mapRef.on("pm:create", (e) => {
    let layer = e.layer;
    console.log(layer, "pm:create -- created layer");
    console.log(Object.keys(layer), "pm:create --keys created layer");
    //@ts-ignore
    console.log(layer?._latlngs?.[0], "pm:create --getlatlngs created layer");

    //@ts-ignore
    let latLngs = layer?._latlngs?.[0];

    setPolygonBoundaryList(() => [latLngs]);

    //Fired when Edit Mode is disabled and a layer is edited and its coordinates have changed.
    layer.on("pm:update", function (e) {
      console.log(layer, "pm:update -- updated layer");
      //@ts-ignore
      latLngs = layer?._latlngs?.[0];

      setPolygonBoundaryList(() => [latLngs]);
    });

    // //Fired when Drag Mode on a layer is disabled.
    // layer.on("pm:dragdisable", function (e) {
    //   console.log(layer, "pm:dragdisable -- dragdisable layer");
    // });

    //Fired when Drag Mode on a layer is disabled.
    layer.on("pm:remove", function (e) {
      console.log(layer, "pm:remove -- remove layer");
      setPolygonBoundaryList(() => []);
    });
  });

  // Fired when Drawing Mode is toggled.
  mapRef.on("pm:globaldrawmodetoggled", (e) => {
    console.log(e, "pm:globaldrawmodetoggled");
    let modeStatus = e?.enabled;
    setShowPolygon2Hex(!modeStatus);

    //tool bar mode active state
    setDrawEditModeActive(modeStatus);
  });

  // 	Fired when Edit Mode is toggled.
  mapRef.on("pm:globaleditmodetoggled", (e) => {
    console.log(e, "pm:globaleditmodetoggled");
    let modeStatus = e?.enabled;
    setShowPolygon2Hex(!modeStatus);
    //tool bar mode active state
    setDrawEditModeActive(modeStatus);
  });

  // 	Fired when Drag Mode is toggled
  mapRef.on("pm:globaldragmodetoggled", (e) => {
    console.log(e, "pm:globaldragmodetoggled");
    let modeStatus = e?.enabled;
    setShowPolygon2Hex(!modeStatus);
    //tool bar mode active state
    setDrawEditModeActive(modeStatus);
  });

  //Fired when Removal Mode is toggled
  mapRef.on("pm:globalremovalmodetoggled", (e) => {
    console.log(e, "pm:globalremovalmodetoggled");
    let modeStatus = e?.enabled;
    setShowPolygon2Hex(!modeStatus);
  });

  //Fired when a layer is removed via Removal Mode
  mapRef.on("pm:remove", (e) => {
    console.log(e, "pm:remove");
    // disable removal mode
    mapRef.pm.disableGlobalRemovalMode();

    //empty out polygon 2 hex state
    setPolygon2HexBoundaryList([]);
  });

  /**
   *
   * @returns boolean
   *
   * check if polygon boudary list and waypoints states are empty
   *
   * return boolean value
   */
  const emptyPolygonWaypointBool = () => {
    let emptyPolygonWaypointBool =
      polygonBoundaryList.length === 0 && waypoints.length === 0;

    return emptyPolygonWaypointBool;
  };

  useEffect(() => {
    console.log(waypoints, "useeffect waypoints");

    if (polygonBoundaryList.length === 0 && waypoints.length > 0) {
      //setting service mode state
      setServiceMode(serviceModeOptions.notActive);
    }
    if (emptyPolygonWaypointBool()) {
      //setting service mode state
      setServiceMode(serviceModeOptions.notSet);
    }

    if (polygonBoundaryList.length > 0 && waypoints.length > 0) {
      //setting service mode state
      setServiceMode(serviceModeOptions.confirmed);
    }

    if (polygonBoundaryList.length > 0 && waypoints.length === 0) {
      //setting service mode state
      setServiceMode(serviceModeOptions.active);
    }

    let geomanLayers = mapRef.pm.getGeomanLayers();
    console.log(geomanLayers, "geomanLayers");
  }, [waypoints]);

  // useEffect(() => {
  //   console.log(reverseCodedWaypoints, "useeffect reverseCodedWaypoints");
  // }, [reverseCodedWaypoints]);

  useEffect(() => {
    console.log(hexBoundaryList, "useeffect hexBoundaryList");
  }, [hexBoundaryList]);

  // useEffect(() => {
  //   console.log(hexCenterCoordinatesList, "useeffect hexCenterCoordinatesList");
  // }, [hexCenterCoordinatesList]);

  // useEffect(() => {
  //   console.log(h3IndexList, "useeffect h3IndexList");
  // }, [h3IndexList]);

  useEffect(() => {
    console.log(polygonBoundaryList, "useeffect polygonBoundaryList");

    if (polygonBoundaryList.length > 0) {
      //get hexagons within polygon
      getHexagonsWithinPolygon(polygonBoundaryList[0]);

      //setting service mode state
      setServiceMode(serviceModeOptions.active);
    }

    if (emptyPolygonWaypointBool()) {
      //setting service mode state

      setServiceMode(serviceModeOptions.notSet);
    }
  }, [polygonBoundaryList]);

  useEffect(() => {
    console.log(polygon2HexBoundaryList, "useeffect polygon2HexBoundaryList");
  }, [polygon2HexBoundaryList]);

  return (
    <>
      <button
        onClick={showMenuHandler}
        className="w-20 h-auto"
        style={{
          position: "absolute",
          background: "#452568",
          zIndex: 600,
          color: "white",
        }}
      >
        <p className="text-4xl align-middle text-center text-lg font-thin ">
          {showMenu
            ? "X"
            : !showMenu && waypoints.length == 0
            ? "R"
            : !showMenu && waypoints.length > 0 && "~R~"}
        </p>
      </button>

      {showMenu && (
        <div
          className="min-h-12 w-screen md:w-1/2"
          style={{
            position: "absolute",
            background: "#fff",
            zIndex: 500,
          }}
        >
          <div className={`p-3 align-middle text-center text-lg font-thin`}>
            {waypoints.length == 0
              ? "Double Click To Mark"
              : waypoints.length == 1
              ? "Need One More Location"
              : "Click Route Button"}
            <hr />
          </div>
          {serviceMode === serviceModeOptions.notSet && (
            <div>
              <div className={`font-thin text-sm md:text-base p-2`}>
                Activate service area bound routing by placing a Rect/ Polygon.
              </div>

              <div className={`font-thin text-sm md:text-base pl-2 pr-2 pb-4`}>
                Or directly place markers to route without service area bounds.
              </div>
            </div>
          )}

          {serviceMode === serviceModeOptions.active && (
            <div>
              <div className={`font-bold text-sm md:text-base p-2`}>
                Service Area Routing Active
              </div>
            </div>
          )}

          {serviceMode === serviceModeOptions.confirmed && (
            <div>
              <div className={`font-bold text-sm md:text-base p-2`}>
                Service Area Routing Active (confirmed)
              </div>
            </div>
          )}

          {serviceMode === serviceModeOptions.notActive && (
            <div>
              <div className={`font-bold text-sm md:text-base p-2`}>
                Normal Routing (No Constrains)
              </div>
            </div>
          )}

          {waypoints.length >= 1 && (
            <div className={`font-thin text-sm md:text-base`}>
              Selected Cordinates:
            </div>
          )}

          {waypoints.map((waypoint: any, idx: any) => (
            <div
              key={`waypoints-${idx}`}
              className="p-2 align-middle text-start text-xs md:text-sm font-thin"
            >
              {/* {`${idx} Lat: ${waypoint.lat} , Lng: ${waypoint.lng}`} */}
              {`${
                reverseCodedWaypoints?.[idx] == undefined
                  ? `~Geocoding Please Wait~ Lat:${waypoint.lat} , Lng:${waypoint.lng}`
                  : reverseCodedWaypoints?.[idx]
              }`}
            </div>
          ))}

          {waypoints.length >= 2 && (
            <div className="text-center">
              <button
                className="bg-emerald-500 pt-2 pb-2 pr-4 pl-4 mt-2 mb-4 w-52"
                onClick={async () => {
                  if (routeControl2 !== null) {
                    clearUtil();
                  }

                  routingUtil();

                  showMenuHandler();
                }}
              >
                <p className="font-thin text-base md:text-xl text-white">
                  Route
                </p>
              </button>
            </div>
          )}

          {waypoints.length >= 1 && (
            <div className="text-center">
              <button
                className="bg-red-300 pt-2 pb-2 pr-4 pl-4 mb-4 w-52"
                onClick={clearButtonHandler}
              >
                <p className="font-thin text-base md:text-xl text-white">
                  Clear
                </p>
              </button>
            </div>
          )}
        </div>
      )}

      {
        // showMenu &&

        waypoints.map((latLng: any, idx: any) => (
          <Marker
            key={`maker-${idx}`}
            position={[latLng.lat, latLng.lng]}
            icon={
              new Icon({
                iconUrl: markerPath,
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                className: "hue-rotate-90",
              })
            }
          >
            <Tooltip permanent={true}>
              {idx === 0
                ? `Starting Point`
                : idx == waypoints?.length - 1
                ? `Final Point`
                : `Point ${idx}`}
            </Tooltip>
            <Popup>
              <h4 className="font-thin text-lg mt-2 mb-2">{`Address:`}</h4>
              {
                <h5 className="font-thin text-sm bg-blue-200 p-2 text-center">
                  {reverseCodedWaypoints?.[idx] == undefined
                    ? "~Geocoding Please Wait~"
                    : reverseCodedWaypoints?.[idx]}
                </h5>
              }
              <br />
              <hr />
              <h4 className="font-thin text-lg mt-2 mb-2">{`Marker LatLng:`}</h4>
              <h5 className="font-thin text-sm bg-blue-200 p-2 text-center">
                {`Lat:${latLng?.lat} , Lng:${latLng?.lng}`}
              </h5>
              <br />
              <hr />
              <h4 className="font-thin text-lg mt-2 mb-2">{`H3 index:`}</h4>
              <h5 className="font-thin text-sm bg-blue-200 p-2 text-center">
                {` ${h3IndexList?.[idx]}`}
              </h5>

              <br />
              <hr />
              <h4 className="font-thin text-lg mt-2 mb-2">{`H3 Center LatLng:`}</h4>
              <h5 className="font-thin text-sm bg-blue-200 p-2 text-center">
                {` ${hexCenterCoordinatesList?.[idx]}`}
              </h5>
              <br />
            </Popup>
          </Marker>
        ))
      }

      {hexBoundaryList?.length > 0 &&
        hexBoundaryList?.map((singileHexCoordinates, idx) => (
          <Polygon
            key={`hex-${idx}`}
            pathOptions={{ color: "red" }}
            positions={
              singileHexCoordinates as
                | L.LatLngExpression[]
                | L.LatLngExpression[][]
                | L.LatLngExpression[][][]
            }
          />
        ))}

      {showPolygon2Hex &&
        polygon2HexBoundaryList?.length > 0 &&
        polygon2HexBoundaryList?.map((singileHexCoordinates, idx) => {
          console.log(singileHexCoordinates, "singileHexCoordinates");
          return (
            <Polygon
              key={`polygon2Hex-${idx}`}
              pathOptions={{ color: "black" }}
              positions={
                singileHexCoordinates as
                  | L.LatLngExpression[]
                  | L.LatLngExpression[][]
                  | L.LatLngExpression[][][]
              }
            >
              <Tooltip>{`Service Area`}</Tooltip>
            </Polygon>
          );
        })}
    </>
  );
};

export default RoutingMachineController;
