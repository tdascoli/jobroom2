import { createFeatureSelector, createSelector } from '@ngrx/store';
import { JobPublication } from '../../../shared/job-publication/job-publication.model';

export enum LoadingStatus {
    INITIAL, OK, FAILED
}

export interface JobPublicationDetailState {
    showCancellationSuccess: boolean;
    showCancellationError: boolean;
    jobPublication: JobPublication;
    loadingStatus: LoadingStatus;
}

export const initialState: JobPublicationDetailState = {
    showCancellationSuccess: false,
    showCancellationError: false,
    jobPublication: null,
    loadingStatus: LoadingStatus.INITIAL
};

export const getJobPublicationDetailState = createFeatureSelector<JobPublicationDetailState>('jobPublicationDetail');
export const getShowCancellationSuccess = createSelector(getJobPublicationDetailState,
    (state: JobPublicationDetailState) => state.showCancellationSuccess);
export const getShowCancellationError = createSelector(getJobPublicationDetailState,
    (state: JobPublicationDetailState) => state.showCancellationError);
export const getJobPublication = createSelector(getJobPublicationDetailState,
    (state: JobPublicationDetailState) => state.jobPublication);
export const getLoadingStatus = createSelector(getJobPublicationDetailState,
    (state: JobPublicationDetailState) => state.loadingStatus);
