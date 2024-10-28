import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Créez un nouvel objet `L.Icon` avec les URLs des icônes
export const customIconNormal = new L.Icon({
    iconUrl: '/icon_map/icon_1x.png',
    iconRetinaUrl: '/icon_map/icon_2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

export const customIconUrgency = new L.Icon({
    iconUrl: '/icon_map/icon_h24-1x.png',
    iconRetinaUrl: '/icon_map/icon_h24-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});


export const customIconSelect = new L.Icon({
    iconUrl: '/icon_map/icon_select_3x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [35, 51],
    iconAnchor: [17, 46],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});


