const API_BASE_URL = "/api/geography";

export const toLowerCase = (str) => str.toLowerCase();

export const COUNTRY_COLORS = {
  br: "#D41E3C", // Bright red
  co: "#E4351F", // Red-orange
  de: "#E42D4F", // Deep pink
  in: "#E41F2A", // Pure red
  it: "#D82836", // Cherry red
  mx: "#C1272D", // Dark red
  ng: "#FF1E3C", // Vivid red
  us: "#E63946", // American red
  za: "#DC143C", // Crimson
};

export const getGeoJsonData = (countryCode) => {
  const code = countryCode.toLowerCase();
  return {
    buses: `${API_BASE_URL}/buses/${code}`,
    lines: `${API_BASE_URL}/lines/${code}`,
    countryView: `${API_BASE_URL}/countryView/${code}`,
    regions: `${API_BASE_URL}/regions/${code}`,
    regions_2021: `${API_BASE_URL}/regions/${code}?year=2021`,
    regions_2050: `${API_BASE_URL}/regions/${code}?year=2050`,
  };
};

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

// Country configurations for bus sizes
export const COUNTRY_BUS_CONFIGS = {
  US: { minRadius: 1000, maxRadius: 40000, zoomBase: 1.2 },
  MX: { minRadius: 5000, maxRadius: 25000, zoomBase: 1.2 },
  BR: { minRadius: 15000, maxRadius: 35000, zoomBase: 1.2 },
  DE: { minRadius: 4000, maxRadius: 15000, zoomBase: 1.2 },
  CO: { minRadius: 5000, maxRadius: 10000, zoomBase: 1.2 },
  AU: { minRadius: 3000, maxRadius: 10000, zoomBase: 1.1 },
  IN: { minRadius: 2500, maxRadius: 20000, zoomBase: 1.2 },
  ZA: { minRadius: 5000, maxRadius: 20000, zoomBase: 1.2 },
  IT: { minRadius: 3000, maxRadius: 5000, zoomBase: 1.2 },
  NG: { minRadius: 3000, maxRadius: 5000, zoomBase: 1.2 },
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

export function normalizeSnom(value, country, zoomLevel) {
  const zoomFactor = Math.pow(1.5, 7 - zoomLevel);
  const minLineWidth = 10 * zoomFactor;
  const maxLineWidth = 500 * zoomFactor;

  if (value < 1000) {
    return minLineWidth + (maxLineWidth - minLineWidth) * 0.2;
  } else if (value < 5000) {
    return minLineWidth + (maxLineWidth - minLineWidth) * 0.4;
  } else if (value < 15000) {
    return minLineWidth + (maxLineWidth - minLineWidth) * 0.6;
  } else if (value < 30000) {
    return minLineWidth + (maxLineWidth - minLineWidth) * 0.8;
  } else {
    return maxLineWidth;
  }
}