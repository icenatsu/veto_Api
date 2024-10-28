import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {
  customIconNormal,
  customIconUrgency,
  customIconSelect,
} from "./CustomIcon";
import { LatLngBounds } from "leaflet";

type MapProps = {
  centralPoint?: {
    id: number | undefined;
    lat: number;
    lng: number;
    clinicName: string;
    cityName: string;
    isOpen24Hours: boolean;
  };
  otherPoints?: {
    id: number | undefined;
    lat: number;
    lng: number;
    clinicName: string;
    cityName: string;
    isOpen24Hours: boolean;
  }[];
  veterinaryId?: number;
};

// Composant MapZoomHandler pour gérer le zoom
const MapZoomHandler = ({ veterinaryId, otherPoints }: MapProps) => {
  const map = useMap();

  useEffect(() => {
    const franceBounds = new LatLngBounds([41.333, -5.225], [51.124, 9.662]);
    if (veterinaryId && otherPoints) {
      // Zoomer sur le point sélectionné si un ID est fourni
      const point = otherPoints.find((p: any) => p.id === veterinaryId);
      
      if (point) {
        map.flyTo([point.lat, point.lng], 15, { duration: 2 }); // Zoom niveau 15, ajustez si nécessaire
      }
    } else {
      // Recentrer sur la France si aucun ID n'est sélectionné      
      map.fitBounds(franceBounds); // Utilisation de fitBounds pour afficher toute la France

    }
  }, [veterinaryId, otherPoints, map]);

  return null;
};

const Map = ({ centralPoint, otherPoints, veterinaryId }: MapProps) => {
  const franceBounds = new LatLngBounds([41.333, -5.225], [51.124, 9.662]);

  return (
    <MapContainer
      center={
        centralPoint
          ? [centralPoint.lat, centralPoint.lng]
          : [46.603354, 1.888334]
      }
      zoom={centralPoint ? 20 : 6}
      {...(!centralPoint && { bounds: franceBounds })}
      style={{ height: "100%", width: "100%" }}
      className="z-40 rounded-xl"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      {centralPoint && (
        <Marker
          position={[centralPoint.lat, centralPoint.lng]}
          icon={
            centralPoint.isOpen24Hours ? customIconUrgency : customIconNormal
          }
        >
          <Popup>
            {centralPoint.clinicName}: {centralPoint.lat}, {centralPoint.lng},{" "}
            {centralPoint.cityName}
          </Popup>
        </Marker>
      )}
      {otherPoints?.map((point, index) => (
        <Marker
          key={index}
          position={[point.lat, point.lng]}
          icon={
            point.id === veterinaryId
              ? customIconSelect
              : point.isOpen24Hours
              ? customIconUrgency
              : customIconNormal
          }
        >
          <Popup>
            {point.clinicName}: {point.lat}, {point.lng}, {point.cityName}
          </Popup>
        </Marker>
      ))}
      <MapZoomHandler
        veterinaryId={veterinaryId}
        otherPoints={otherPoints}
      />
    </MapContainer>
  );
};

export default Map;
