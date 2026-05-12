export type RegionKey = 'north-america' | 'central-south-america' | 'europe' | 'middle-east-africa' | 'asia-pacific' | 'australia-new-zealand';

export interface RegionGroup {
  key: RegionKey;
  label: string;
  labelEs: string;
  cities: Array<any>;
}

const COUNTRY_TO_REGION: Record<string, RegionKey> = {
  'USA': 'north-america',
  'Canada': 'north-america',
  'Colombia': 'central-south-america',
  'Argentina': 'central-south-america',
  'Brazil': 'central-south-america',
  'Peru': 'central-south-america',
  'Chile': 'central-south-america',
  'Mexico': 'central-south-america',
  'Germany': 'europe',
  'Ireland': 'europe',
  'France': 'europe',
  'Spain': 'europe',
  'United Kingdom': 'europe',
  'Italy': 'europe',
  'Sweden': 'europe',
  'Switzerland': 'europe',
  'China': 'asia-pacific',
  'Egypt': 'middle-east-africa',
  'Bahrain': 'middle-east-africa',
  'Saudi Arabia': 'middle-east-africa',
  'Israel': 'middle-east-africa',
  'South Africa': 'middle-east-africa',
  'Australia': 'australia-new-zealand',
  'New Zealand': 'australia-new-zealand',
  'Japan': 'asia-pacific',
  'South Korea': 'asia-pacific',
  'India': 'asia-pacific',
  'Singapore': 'asia-pacific',
  'Indonesia': 'asia-pacific',
  'Hong Kong': 'asia-pacific',
  'Taiwan': 'asia-pacific',
  'Thailand': 'asia-pacific',
  'Philippines': 'asia-pacific',
  'Malaysia': 'asia-pacific',
};

const REGION_ORDER: RegionKey[] = [
  'north-america',
  'central-south-america',
  'europe',
  'middle-east-africa',
  'asia-pacific',
  'australia-new-zealand',
];

const REGION_LABELS: Record<RegionKey, { en: string; es: string }> = {
  'north-america': { en: 'North America', es: 'América del Norte' },
  'central-south-america': { en: 'Central & South America', es: 'América Central y del Sur' },
  'europe': { en: 'Europe', es: 'Europa' },
  'middle-east-africa': { en: 'Middle East & Africa', es: 'Medio Oriente y África' },
  'asia-pacific': { en: 'Asia Pacific', es: 'Asia Pacífico' },
  'australia-new-zealand': { en: 'Australia & New Zealand', es: 'Australia y Nueva Zelanda' },
};

export function groupCitiesByRegion(cities: Array<any>): RegionGroup[] {
  const grouped: Record<RegionKey, Array<any>> = {
    'north-america': [],
    'central-south-america': [],
    'europe': [],
    'middle-east-africa': [],
    'asia-pacific': [],
    'australia-new-zealand': [],
  };

  for (const city of cities) {
    const region = COUNTRY_TO_REGION[city.country] || 'europe';
    grouped[region].push(city);
  }

  // Sort alphabetically within each region
  for (const key of REGION_ORDER) {
    grouped[key].sort((a, b) => a.name.localeCompare(b.name));
  }

  return REGION_ORDER
    .map(key => ({
      key,
      label: REGION_LABELS[key].en,
      labelEs: REGION_LABELS[key].es,
      cities: grouped[key],
    }));
}
