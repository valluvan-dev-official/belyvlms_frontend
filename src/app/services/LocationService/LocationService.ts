import { api } from "../AuthenticationService/AuthenticationService";

export interface Country {
  id: number;
  name: string;
  iso_code_2: string;
  phone_code: string;
  value: string;
  label: string;
}

export interface State {
  id: number;
  name: string;
  state_code: string;
  value: string;
  label: string;
  country_code: string;
}

export interface City {
  id: number;
  name: string;
  value: string;
  label: string;
  state_name: string;
  country_code: string;
}

// Enterprise-grade In-Memory Cache
// Prevents redundant network calls during the user session
let countriesCache: Country[] | null = null;
const statesCache: Record<string, State[]> = {};
const citiesCache: Record<string, City[]> = {};

export const getCountries = async (): Promise<Country[]> => {
  if (countriesCache) return countriesCache;
  
  try {
    const res = await api.get("locations/countries/");
    countriesCache = res.data;
    return res.data;
  } catch (error) {
    console.error("Failed to fetch countries", error);
    throw error;
  }
};

export const getStates = async (countryCode: string): Promise<State[]> => {
  if (statesCache[countryCode]) return statesCache[countryCode];

  try {
    const res = await api.get("locations/states/", { params: { country: countryCode } });
    statesCache[countryCode] = res.data;
    return res.data;
  } catch (error) {
    console.error(`Failed to fetch states for ${countryCode}`, error);
    throw error;
  }
};

export const getCities = async (stateName: string): Promise<City[]> => {
  // CRITICAL: Must pass state NAME (label), not code
  if (citiesCache[stateName]) return citiesCache[stateName];

  try {
    const res = await api.get("locations/cities/", { params: { state: stateName } });
    citiesCache[stateName] = res.data;
    return res.data;
  } catch (error) {
    console.error(`Failed to fetch cities for ${stateName}`, error);
    throw error;
  }
};
