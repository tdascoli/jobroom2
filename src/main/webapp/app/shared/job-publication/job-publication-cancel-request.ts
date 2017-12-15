export interface JobCancellationRequest {
    id: string;
    accessToken: string
    positionOccupied: boolean;
    occupiedWithJobCenter: boolean;
    occupiedWithPrivateAgency: boolean;
    selfOccupied: boolean;
}
