"use client";
import { LatLngBounds } from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import {
  customIconNormal,
  customIconSelect,
  customIconUrgency,
} from "./CustomIcon";

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
  getMapInstance?: (map: L.Map) => void;
  // test?: (map: String) => void;
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

const Map = ({
  centralPoint,
  otherPoints,
  veterinaryId,
  getMapInstance,
}: MapProps) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const franceBounds = new LatLngBounds([41.333, -5.225], [51.124, 9.662]);
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);

  useEffect(() => {
    if (getMapInstance && mapInstance) {
      getMapInstance(mapInstance);
    }
  }, [getMapInstance, mapInstance]);

  if (getMapInstance && mapInstance) {
    getMapInstance(mapInstance);
  }

  return (
    <MapContainer
      ref={setMapInstance}
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
      <MapZoomHandler veterinaryId={veterinaryId} otherPoints={otherPoints} />
    </MapContainer>
  );
};

export default Map;
