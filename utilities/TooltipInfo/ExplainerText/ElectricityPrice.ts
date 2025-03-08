/**
 * Type definition for electricity price information display
 * @typedef {Object} ElectricityPrice_info_type
 * @property {string} full_name - The complete name/title of the price metric
 * @property {string} definition - Detailed explanation of what electricity price represents
 * @property {string} unit - The unit of measurement
 * @property {string} source - The data source or origin of the information
 * @property {string} values - Description of what the numeric values represent
 * @property {string} comparison - Information about how this value compares across scenarios
 */
export type ElectricityPrice_info_type = {
  full_name: string;
  definition: string;
  unit: string;
  source: string;
  values: string;
  comparison: string;
};

export const ElectricityPrice_info: ElectricityPrice_info_type = {
  full_name: "Electricity Price",
  definition:
    "The Electricity Price represents the cost per unit of electrical energy consumed, reflecting the market dynamics, generation costs, and system operations.",
  unit: "€/MWh (euros per megawatt-hour)",
  source:
    "Derived from market prices, generation costs, and system operational data",
  values: "Hourly or average electricity prices",
  comparison:
    "Variation in electricity prices across different time periods, regions, and scenarios.",
};
