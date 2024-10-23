const BASE_URL = "http://34.31.13.149:8000/geoserver/GIS_Dashboard/ows";

export const getGeoJsonData = (countryCode) => ({
  buses: `${BASE_URL}?service=WFS&version=1.0.0&request=GetFeature&typeName=GIS_Dashboard%3Abuses_${countryCode.toLowerCase()}&maxFeatures=5000&outputFormat=application%2Fjson`,
  lines: `${BASE_URL}?service=WFS&version=1.0.0&request=GetFeature&typeName=GIS_Dashboard%3Alines_${countryCode.toLowerCase()}&maxFeatures=5000&outputFormat=application%2Fjson`,
});

export const COUNTRY_COORDINATES = {
  AU: [-25.2744, 133.7751],
  BR: [-14.2350, -51.9253],
  CO: [4.5709, -74.2973],
  DE: [51.1657, 10.4515],
  IN: [20.5937, 78.9629],
  IT: [41.8719, 12.5674],
  MX: [23.6345, -102.5528],
  NG: [9.0820, 8.6753],
  US: [37.0902, -95.7129],
  ZA: [-30.5595, 22.9375],
};