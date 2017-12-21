import { CancellationReason } from './job-publication.model';

export interface JobCancelRequest {
    id: string;
    accessToken: string;
    cancellationReason: CancellationReason;
}
