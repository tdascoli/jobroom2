import { LOCALE_ID, NgModule } from '@angular/core';
import { Title } from '@angular/platform-browser';

import {
    FindLanguageFromKeyPipe,
    JhiAlertComponent,
    JhiAlertErrorComponent,
    JhiLanguageHelper,
    JobroomSharedLibsModule
} from './';
import {
    RangeInputComponent,
    MultiselectComponent,
    TypeaheadMultiselectComponent,
    TypeaheadSingleselectComponent
} from './input-components';

@NgModule({
    imports: [
        JobroomSharedLibsModule
    ],
    declarations: [
        FindLanguageFromKeyPipe,
        JhiAlertComponent,
        JhiAlertErrorComponent,
        TypeaheadMultiselectComponent,
        RangeInputComponent,
        MultiselectComponent,
        TypeaheadSingleselectComponent
    ],
    providers: [
        JhiLanguageHelper,
        Title,
        {
            provide: LOCALE_ID,
            useValue: 'de'
        },
    ],
    exports: [
        JobroomSharedLibsModule,
        FindLanguageFromKeyPipe,
        JhiAlertComponent,
        JhiAlertErrorComponent,
        TypeaheadMultiselectComponent,
        RangeInputComponent,
        MultiselectComponent,
        TypeaheadSingleselectComponent
    ]
})
export class JobroomSharedCommonModule {
}
