export class LocalityInputType {
    static LOCALITY = 'locality';
}

export interface Locality {
    city: string;
    zipCode: string;
    communalCode: number;
    cantonCode: string;
    geoPoint: GeoPoint;
}

export interface GeoPoint {
    latitude: number;
    longitude: number;
}
