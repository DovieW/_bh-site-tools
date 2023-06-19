import countriesJson from '../data/countries.json';

export interface Country {
  code: string;
  label: string;
}

export function getCountryByCode(code: string): Country | undefined {
  return Countries.find((country) => country.code === code);
}

export const Countries: Country[] = countriesJson;