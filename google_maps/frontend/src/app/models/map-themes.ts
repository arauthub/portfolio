export interface MapTheme {
  id: string;
  name: string;
  description: string;
  accentColor: string;
  styles: google.maps.MapTypeStyle[];
}

export const MAP_THEMES: MapTheme[] = [
  {
    id: 'cyberpunk',
    name: 'Cyberpunk Neon',
    description: 'High-contrast neon cyan water, dark matrix grid & glowing roads',
    accentColor: '#38bdf8',
    styles: [
      { elementType: 'geometry', stylers: [{ color: '#090d16' }] },
      { elementType: 'labels.text.stroke', stylers: [{ color: '#090d16' }] },
      { elementType: 'labels.text.fill', stylers: [{ color: '#38bdf8' }] },
      { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#f43f5e' }] },
      { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#67e8f9' }] },
      { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#132338' }] },
      { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1e293b' }] },
      { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#0284c7' }] },
      { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#2563eb' }] },
      { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#38bdf8' }] },
      { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#1e1b4b' }] },
      { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0369a1' }] },
      { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#bae6fd' }] }
    ]
  },
  {
    id: 'aubergine',
    name: 'Aubergine Nocturne',
    description: 'Deep violet, dark luxury tones with golden points of interest',
    accentColor: '#a855f7',
    styles: [
      { elementType: 'geometry', stylers: [{ color: '#1d2c4d' }] },
      { elementType: 'labels.text.fill', stylers: [{ color: '#8ec3b9' }] },
      { elementType: 'labels.text.stroke', stylers: [{ color: '#1a3646' }] },
      { featureType: 'administrative.country', elementType: 'geometry.stroke', stylers: [{ color: '#4b6878' }] },
      { featureType: 'landscape.man_made', elementType: 'geometry.stroke', stylers: [{ color: '#334e87' }] },
      { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#283d6a' }] },
      { featureType: 'poi.park', elementType: 'geometry.fill', stylers: [{ color: '#023e58' }] },
      { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#304a7d' }] },
      { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#98a5be' }] },
      { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#2c6675' }] },
      { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0e1626' }] }
    ]
  },
  {
    id: 'silver',
    name: 'Minimalist Silver',
    description: 'Clean, modern high-key aesthetic for clear data visualization',
    accentColor: '#64748b',
    styles: [
      { elementType: 'geometry', stylers: [{ color: '#f5f5f5' }] },
      { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
      { elementType: 'labels.text.fill', stylers: [{ color: '#616161' }] },
      { elementType: 'labels.text.stroke', stylers: [{ color: '#f5f5f5' }] },
      { featureType: 'administrative.land_parcel', elementType: 'labels.text.fill', stylers: [{ color: '#bdbdbd' }] },
      { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#eeeeee' }] },
      { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#e5e5e5' }] },
      { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
      { featureType: 'road.arterial', elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
      { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#dadada' }] },
      { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#c9c9c9' }] }
    ]
  },
  {
    id: 'retro',
    name: 'Retro Warm Sepia',
    description: 'Vintage cartography palette with warm terracotta and sage',
    accentColor: '#f59e0b',
    styles: [
      { elementType: 'geometry', stylers: [{ color: '#ebe3cd' }] },
      { elementType: 'labels.text.fill', stylers: [{ color: '#523735' }] },
      { elementType: 'labels.text.stroke', stylers: [{ color: '#f5f1e6' }] },
      { featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{ color: '#c9b2a6' }] },
      { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#dfd2ae' }] },
      { featureType: 'poi.park', elementType: 'geometry.fill', stylers: [{ color: '#a5b076' }] },
      { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#f5f1e6' }] },
      { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#f8c967' }] },
      { featureType: 'water', elementType: 'geometry.fill', stylers: [{ color: '#b9d3c2' }] }
    ]
  },
  {
    id: 'monochrome_dark',
    name: 'Stealth Dark',
    description: 'Ultra dark OLED black with subtle charcoal boundaries',
    accentColor: '#10b981',
    styles: [
      { elementType: 'geometry', stylers: [{ color: '#121212' }] },
      { elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
      { elementType: 'labels.text.stroke', stylers: [{ color: '#121212' }] },
      { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#9e9e9e' }] },
      { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#1b1b1b' }] },
      { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#181f18' }] },
      { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#242424' }] },
      { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#2f3542' }] },
      { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0d1117' }] }
    ]
  }
];

