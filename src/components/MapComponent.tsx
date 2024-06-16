
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Tooltip,
  ZoomControl,
  ScaleControl,
} from "react-leaflet";
import L, { ControlPosition, LatLngExpression } from "leaflet";
import "leaflet-routing-machine";
import "leaflet-control-geocoder";

import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import { leafletConfig, markerPath } from "@/utils/leafletConfig";
import RoutingMachineController from "./modularMapComponents/RoutingMachineController";

// const markerPath = "/marker-icon.png";

/**
 *
 * @returns JSX.Element
 *
 * map component
 */
const MapComponent: () => JSX.Element = () => {
  return (
    <div className="">
      <MapContainer
        center={leafletConfig.center as LatLngExpression}
        zoom={leafletConfig.zoom}
        minZoom={leafletConfig.minZoom}
        maxZoom={leafletConfig.maxZoom}
        zoomControl={leafletConfig.zoomControl}
        doubleClickZoom={leafletConfig.doubleClickZoom}
        scrollWheelZoom={leafletConfig.scrollWheelZoom}
      >
        <TileLayer
          //   attribution='&copy; <a href="">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ScaleControl
          position={leafletConfig.scaleControlPos as ControlPosition}
        />

        <ZoomControl
          position={leafletConfig.zoomControlPos as ControlPosition}
        />

        <Marker
          position={[51.505, -0.09]}
          icon={
            new Icon({
              iconUrl: markerPath,
              iconSize: [25, 41],
              iconAnchor: [12, 25],
            })
          }
        >
          <Tooltip>Tooltip</Tooltip>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
        <RoutingMachineController />
      </MapContainer>
    </div>
  );
};

export default MapComponent;
