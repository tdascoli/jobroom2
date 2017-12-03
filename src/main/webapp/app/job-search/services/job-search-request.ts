export interface JobSearchRequest {
    keywords: Array<string>;
    occupationCodes: Array<OccupationCode>;
    localities: Array<string>;
    regions: Array<string>;
    cantons: Array<string>;
    permanent: boolean;
    workingTimeMin: number;
    workingTimeMax: number;
    sort: string;
    companyName: string;
    onlineSince: number;
    page: number;
    size: number;
}

export interface OccupationCode {
    type: string,
    code: number
}
