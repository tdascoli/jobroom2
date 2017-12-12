export interface JobPublicationSearchRequest {
    page: number;
    size: number;
    jobTitle: string;
    onlineSinceDays: number;
    email: string;
}
