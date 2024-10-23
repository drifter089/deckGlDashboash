const BASE_URL = "http://34.31.13.149:8000/geoserver/GIS_Dashboard/ows";

export const getGeoJsonData = (countryCode) => ({
  buses: `${BASE_URL}?service=WFS&version=1.0.0&request=GetFeature&typeName=GIS_Dashboard%3Abuses_${countryCode.toLowerCase()}&maxFeatures=5000&outputFormat=application%2Fjson`,
  lines: `${BASE_URL}?service=WFS&version=1.0.0&request=GetFeature&typeName=GIS_Dashboard%3Alines_${countryCode.toLowerCase()}&maxFeatures=5000&outputFormat=application%2Fjson`,
});

export const COUNTRY_S_NOM_RANGES = {
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
