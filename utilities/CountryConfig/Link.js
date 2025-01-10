const BASE_URL = "http://34.31.13.149:8000/geoserver/GIS_Dashboard/ows";


export const toLowerCase = (str) => str.toLowerCase();

export const COUNTRY_COLORS = {
  au: '#E41E3C', // Primary red
  br: '#7C9885', // Secondary green
  co: '#D7E5BE', // Tertiary light green
  de: '#CDDBB5', // Tertiary muted green
  in: '#E3E6DA', // Tertiary light gray-green
  it: '#F5F5DC', // Tertiary beige
  mx: '#E6E6E6', // Neutral light gray
  ng: '#F2F5F3', // Neutral off-white
  us: '#1C1C2C', // Neutral dark
  za: '#7C9885'  // Secondary green (repeated as we need 10 colors)
};

export const COUNTRY_NAMES = {
  au: 'Australia',
  br: 'Brazil',
  co: 'Colombia',
  de: 'Germany',
  in: 'India',
  it: 'Italy',
  mx: 'Mexico',
  ng: 'Nigeria',
  us: 'United States',
  za: 'South Africa'
};

export const getGeoJsonData = (countryCode) => ({
  buses: `${BASE_URL}?service=WFS&version=1.0.0&request=GetFeature&typeName=GIS_Dashboard%3Abuses_${countryCode.toLowerCase()}&maxFeatures=5000&outputFormat=application%2Fjson`,
  lines: `${BASE_URL}?service=WFS&version=1.0.0&request=GetFeature&typeName=GIS_Dashboard%3Alines_${countryCode.toLowerCase()}&maxFeatures=5000&outputFormat=application%2Fjson`,
  countryView: `${BASE_URL}?service=WFS&version=1.0.0&request=GetFeature&typeName=GIS_Dashboard%3A${countryCode.toLowerCase()}_country_view&maxFeatures=10000&outputFormat=application%2Fjson`,
  regions_2021: `${BASE_URL}?service=WFS&version=1.0.0&request=GetFeature&typeName=GIS_Dashboard%3Aregions_${countryCode.toLowerCase()}_2021&maxFeatures=10000&outputFormat=application%2Fjson`,
  regions_2050: `${BASE_URL}?service=WFS&version=1.0.0&request=GetFeature&typeName=GIS_Dashboard%3Aregions_${countryCode.toLowerCase()}_2050&maxFeatures=10000&outputFormat=application%2Fjson`,
});

export const COUNTRY_S_NOM_RANGES = {
  BR: { min: 231.25476357255866, max: 87594.814965592, bussize: 20 },
  AU: { min: 73.73340287820712, max: 19797.41867279861, bussize: 20 },
  MX: { min: 128.47486865142147, max: 23184.127927727168, bussize: 30 },
  IN: { min: 442.40041726924267, max: 255263.7936877715, bussize: 50 },
  ZA: { min: 221.20020863462133, max: 60830.05737452085, bussize: 30 },
  US: { min: 77.08492119085288, max: 47510.006427295666, bussize: 70 },
  CO: { min: 368.66701439103554, max: 13774.740264974147, bussize: 15 },
  NG: { min: 147.46680575641423, max: 13272.012518077277, bussize: 25 },
  IT: { min: 147.46680575641423, max: 20153.796786709947, bussize: 18 },
  DE: { min: 245.7780095940237, max: 46094.54852658827, bussize: 22 },
};

export const LINE_WIDTH_RANGE = {
  BR: { min: 231.25476357255866, max: 87594.814965592 },
  AU: { min: 73.73340287820712, max: 19797.41867279861 },
  MX: { min: 128.47486865142147, max: 23184.127927727168 },
  IN: { min: 442.40041726924267, max: 255263.7936877715 },
  ZA: { min: 221.20020863462133, max: 60830.05737452085 },
  US: { min: 77.08492119085288, max: 47510.006427295666 },
  CO: { min: 368.66701439103554, max: 13774.740264974147 },
  NG: { min: 147.46680575641423, max: 13272.012518077277 },
  IT: { min: 147.46680575641423, max: 20153.796786709947 },
  DE: { min: 245.7780095940237, max: 46094.54852658827 },
};

export const COUNTRY_COORDINATES = {
  // lat long
  AU: [-25.2744, 133.7751],
  BR: [-14.235, -51.9253],
  CO: [4.5709, -74.2973],
  DE: [51.1657, 10.4515],
  IN: [20.5937, 78.9629],
  IT: [41.8719, 12.5674],
  MX: [23.6345, -102.5528],
  NG: [9.082, 8.6753],
  US: [37.0902, -95.7129],
  ZA: [-30.5595, 22.9375],
};

export const COUNTRY_VIEW_CONFIG = {
  AU: { zoom: 3.2, bounds: 80 },
  BR: { zoom: 3.2, bounds: 80 },
  CO: { zoom: 4.8, bounds: 40 },
  DE: { zoom: 4.8, bounds: 30 },
  IN: { zoom: 3.8, bounds: 60 },
  IT: { zoom: 4.5, bounds: 30 },
  MX: { zoom: 4.0, bounds: 50 },
  NG: { zoom: 4.8, bounds: 40 },
  US: { zoom: 2.5, bounds: 100 },
  ZA: { zoom: 4.5, bounds: 50 },
};

export const COUNTRY_BOUNDS = {
  AU: [
    [113.338953078, -43.6345972634],
    [153.569469029, -10.6681857235],
  ],
  BR: [
    [-73.9872354804, -33.7683777809],
    [-34.7299934555, 5.24448639569],
  ],
  CO: [
    [-78.9909352282, -4.29818694419],
    [-66.8763258531, 12.4373031682],
  ],
  DE: [
    [5.98865807458, 47.3024876979],
    [15.0169958839, 54.983104153],
  ],
  IN: [
    [68.1766451354, 7.96553477623],
    [97.4025614766, 35.4940095078],
  ],
  IT: [
    [6.7499552751, 36.619987291],
    [18.4802470232, 47.1153931748],
  ],
  MX: [
    [-118.3649820989, 14.5321824761],
    [-86.7235489749, 32.7187629611],
  ],
  NG: [
    [2.6917863124, 4.2790553552],
    [14.6800013683, 13.8659239771],
  ],
  US: [
    [-178.334698, 18.910361],
    [-66.94524, 71.352561],
  ],
  ZA: [
    [16.3449768409, -34.8191663551],
    [32.830120477, -22.1265453832],
  ],
};

export const COUNTRY_NAMES = {
  AU: "Australia",
  BR: "Brazil",
  CO: "Colombia",
  DE: "Germany",
  IN: "India",
  IT: "Italy",
  MX: "Mexico",
  NG: "Nigeria",
  US: "United States",
  ZA: "South Africa",
};