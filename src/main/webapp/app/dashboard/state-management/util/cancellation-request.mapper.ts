import { JobCancelRequest } from '../../../shared/job-publication/job-publication-cancel-request';
import { CancellationReason } from '../../../shared/job-publication/job-publication.model';
import { CancellationData } from '../../dialogs/cancellation-data';

interface CancellationReasonForm {
    positionOccupied: boolean;
    occupiedWith: {
        jobCenter: boolean;
        privateAgency: boolean;
        self: boolean
    }
}

export function createJobPublicationCancellationRequest(cancellationData: CancellationData): JobCancelRequest {
    const { id, accessToken, cancellationReason } = cancellationData;
    return {
        id,
        accessToken,
        cancellationReason: getCancellationReason(cancellationReason)
    } as JobCancelRequest;
}

function getCancellationReason(cancellationReasonForm: CancellationReasonForm): CancellationReason {
    if (!cancellationReasonForm.positionOccupied) {
        return CancellationReason.POSITION_NOT_OCCUPIED;
    }

    if (cancellationReasonForm.occupiedWith.self) {
        return CancellationReason.POSITION_OCCUPIED_SELF;
    }

    if (cancellationReasonForm.occupiedWith.jobCenter
        && cancellationReasonForm.occupiedWith.privateAgency) {
        return CancellationReason.POSITION_OCCUPIED_BOTH;
    }

    if (cancellationReasonForm.occupiedWith.jobCenter) {
        return CancellationReason.POSITION_OCCUPIED_JOB_CENTER;
    }

    return CancellationReason.POSITION_OCCUPIED_PRIVATE_AGENCY;
}
