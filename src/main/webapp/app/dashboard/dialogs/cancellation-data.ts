export interface CancellationData {
    id: string,
    accessToken: string,
    cancellationReason: {
        positionOccupied: boolean;
        occupiedWith: {
            jobCenter: boolean;
            privateAgency: boolean;
            self: boolean
        }
    }
}
