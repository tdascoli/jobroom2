import { NgModule } from '@angular/core';
import { OccupationService } from './service/occupation.service';
import { TypeaheadMultiselectComponent } from './typeahead-multiselect/typeahead-multiselect.component';
import { JobroomSharedLibsModule } from '../shared-libs.module';
import { LocalityService, NAVIGATOR_TOKEN } from './service/locality.service';
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
        TypeaheadMultiselectComponent,
        GeoLocationSelectComponent
    ],
    declarations: [
        TypeaheadMultiselectComponent,
        GeoLocationSelectComponent
    ],
    providers: [
        OccupationService,
        LocalityService,
        { provide: NAVIGATOR_TOKEN, useFactory: navigatorFactory }
    ]
})
export class JobSearchSharedModule {
}
