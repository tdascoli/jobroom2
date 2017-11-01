export interface JobSearchRequest {
    keywords: Array<string>;
    occupations: Array<string>;
    classifications: Array<string>;
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
