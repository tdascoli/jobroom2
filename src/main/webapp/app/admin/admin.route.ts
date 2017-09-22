import { Routes } from '@angular/router';

import {
    auditsRoute,
    configurationRoute,
    docsRoute,
    gatewayRoute,
    healthRoute,
    logsRoute,
    metricsRoute,
    userDialogRoute,
    userMgmtRoute
} from './';

import { UserRouteAccessService } from '../shared';
import { elasticsearchReindexRoute } from './elasticsearch-reindex/elasticsearch-reindex.route';

const ADMIN_ROUTES = [
    auditsRoute,
    configurationRoute,
    docsRoute,
    healthRoute,
    logsRoute,
    elasticsearchReindexRoute,
    gatewayRoute,
    ...userMgmtRoute,
    metricsRoute
];

export const adminState: Routes = [{
    path: '',
    data: {
        authorities: ['ROLE_ADMIN']
    },
    canActivate: [UserRouteAccessService],
    children: ADMIN_ROUTES
},
    ...userDialogRoute
];
