import { NgModule } from '@angular/core';
import { OccupationService } from './service/occupation.service';
import { JobroomSharedLibsModule } from '../shared-libs.module';
import { LocalityService, NAVIGATOR_TOKEN } from './service/locality.service';
import { ReferenceService } from './service/reference.service';
import { GeoLocationSelectComponent } from './geo-location-select/geo-location-select.component';

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
        LocalityService,
        ReferenceService,
        { provide: NAVIGATOR_TOKEN, useFactory: navigatorFactory }
    ]
})
export class JobSearchSharedModule {
}
