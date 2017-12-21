import { CancellationReason } from '../../../../../../../main/webapp/app/shared/job-publication/job-publication.model';
import { createJobPublicationCancellationRequest } from '../../../../../../../main/webapp/app/dashboard/state-management/util/cancellation-request.mapper';
import { CancellationData } from '../../../../../../../main/webapp/app/dashboard/dialogs/cancellation-data';

describe('createJobPublicationCancelRequest', () => {

    it('should return POSITION_NOT_OCCUPIED cancellationReason', () => {
        // GIVEN
        const cancellationData: CancellationData = {
            id: 'id',
            accessToken: 'token',
            cancellationReason: {
                positionOccupied: false,
                occupiedWith: {
                    jobCenter: false,
                    privateAgency: false,
                    self: false
                }
            }
        };

        // WHEN
        const cancelRequest = createJobPublicationCancellationRequest(cancellationData);

        // THEN
        expect(cancelRequest.cancellationReason).toEqual(CancellationReason.POSITION_NOT_OCCUPIED);
    });

    it('should return POSITION_OCCUPIED_SELF cancellationReason', () => {
        // GIVEN
        const cancellationData: CancellationData = {
            id: 'id',
            accessToken: 'token',
            cancellationReason: {
                positionOccupied: true,
                occupiedWith: {
                    jobCenter: false,
                    privateAgency: false,
                    self: true
                }
            }
        };

        // WHEN
        const cancelRequest = createJobPublicationCancellationRequest(cancellationData);

        // THEN
        expect(cancelRequest.cancellationReason).toEqual(CancellationReason.POSITION_OCCUPIED_SELF);
    });

    it('should return POSITION_OCCUPIED_BOTH cancellationReason', () => {
        // GIVEN
        const cancellationData: CancellationData = {
            id: 'id',
            accessToken: 'token',
            cancellationReason: {
                positionOccupied: true,
                occupiedWith: {
                    jobCenter: true,
                    privateAgency: true,
                    self: false
                }
            }
        };

        // WHEN
        const cancelRequest = createJobPublicationCancellationRequest(cancellationData);

        // THEN
        expect(cancelRequest.cancellationReason).toEqual(CancellationReason.POSITION_OCCUPIED_BOTH);
    });

    it('should return POSITION_OCCUPIED_JOB_CENTER cancellationReason', () => {
        // GIVEN
        const cancellationData: CancellationData = {
            id: 'id',
            accessToken: 'token',
            cancellationReason: {
                positionOccupied: true,
                occupiedWith: {
                    jobCenter: true,
                    privateAgency: false,
                    self: false
                }
            }
        };

        // WHEN
        const cancelRequest = createJobPublicationCancellationRequest(cancellationData);

        // THEN
        expect(cancelRequest.cancellationReason).toEqual(CancellationReason.POSITION_OCCUPIED_JOB_CENTER);
    });

    it('should return POSITION_OCCUPIED_PRIVATE_AGENCY cancellationReason as default', () => {
        // GIVEN
        const cancellationData: CancellationData = {
            id: 'id',
            accessToken: 'token',
            cancellationReason: {
                positionOccupied: true,
                occupiedWith: {
                    jobCenter: false,
                    privateAgency: false,
                    self: false
                }
            }
        };

        // WHEN
        const cancelRequest = createJobPublicationCancellationRequest(cancellationData);

        // THEN
        expect(cancelRequest.cancellationReason).toEqual(CancellationReason.POSITION_OCCUPIED_PRIVATE_AGENCY);
    });
});
