export class LocalityInputType {
    static LOCALITY = 'locality';
    static CANTON = 'canton';
}

export interface LocalitySuggestion {
    city: string;
    communalCode: number;
    cantonCode: string;
}

export interface GeoPoint {
    latitude: number;
    longitude: number;
}

export interface CantonSuggestion {
    code: string;
    name: string;
}

export interface LocalityAutocomplete {
    localities: LocalitySuggestion[];
    cantons: CantonSuggestion[];
}
