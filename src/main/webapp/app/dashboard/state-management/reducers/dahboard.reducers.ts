import { peaDashboardReducer } from './pea-dashboard.reducers';
import { ActionReducerMap } from '@ngrx/store';
import { DashboardState } from '../state/dashboard.state';

export const dashboardReducer: ActionReducerMap<DashboardState> = {
    peaDashboard: peaDashboardReducer,
};
