import { NgModule } from '@angular/core';
import { OccupationService } from '../reference-service/occupation.service';
import { JobroomSharedLibsModule } from '../shared-libs.module';
import { LocalityService, NAVIGATOR_TOKEN } from '../reference-service/locality.service';
import { ReferenceService } from '../reference-service/reference.service';
import { GeoLocationSelectComponent } from './geo-location-select/geo-location-select.component';
import { OccupationPresentationService } from '../reference-service/occupation-presentation.service';

declare const navigator: NavigatorGeolocation;

export function navigatorFactory(): NavigatorGeolocation {
    return navigator;
}

@NgModule({
    imports: [
        JobroomSharedLibsModule
    ],
    exports: [
        GeoLocationSelectComponent
    ],
    declarations: [
        GeoLocationSelectComponent
    ],
    providers: [
        OccupationService,
        OccupationPresentationService,
        LocalityService,
        ReferenceService,
        { provide: NAVIGATOR_TOKEN, useFactory: navigatorFactory }
    ]
})
export class JobSearchSharedModule {
}
