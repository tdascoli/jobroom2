import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { LocalityService } from '../../../../../../../../main/webapp/app/shared/reference-service/locality.service';
import { ZipCodeComponent } from '../../../../../../../../main/webapp/app/home/tools/job-publication-tool/zip-code/zip-code.component';
import { SimpleChange } from '@angular/core';
import { LocalityAutocomplete } from '../../../../../../../../main/webapp/app/shared/reference-service/locality-autocomplete';

describe('ZipCodeComponent', () => {
    let component: ZipCodeComponent;
    let fixture: ComponentFixture<ZipCodeComponent>;

    const mockLocalityService = jasmine.createSpyObj('mockLocalityService',
        ['fetchSuggestions']);

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [ReactiveFormsModule],
            declarations: [ZipCodeComponent],
            providers: [
                {
                    provide: LocalityService,
                    useValue: mockLocalityService
                }
            ]
        })
            .overrideTemplate(ZipCodeComponent, '')
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ZipCodeComponent);
        component = fixture.componentInstance;
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });

    it('should create single field for Switz', () => {
        // GIVEN
        component.controlName = 'zip';
        component.group = new FormGroup({});

        // WHEN
        component.ngOnChanges({
            switzSelected: new SimpleChange(null, true, true)
        });

        // THEN
        const zipControl = component.group.get('zip');
        expect(zipControl).toBeDefined();
        expect(zipControl instanceof FormControl).toBeTruthy();
    });

    it('should create zip and city fields for other countries', () => {
        // GIVEN
        component.controlName = 'zip';
        component.group = new FormGroup({});

        // WHEN
        component.ngOnChanges({
            switzSelected: new SimpleChange(null, false, true)
        });

        // THEN
        const zipControl = component.group.get('zip');
        expect(zipControl).toBeDefined();
        expect(zipControl instanceof FormGroup).toBeTruthy();
        expect(zipControl.get('zip')).toBeDefined();
        expect(zipControl.get('city')).toBeDefined();
    });

    describe('localityResultMapper', () => {
        it('should map zipCode, city and communalCode properties of the localities', () => {
            // GIVEN
            const localityAutocomplete: LocalityAutocomplete = {
                'localities': [
                    {
                        'city': 'Zürich',
                        'communalCode': 261,
                        'cantonCode': 'ZH',
                        'regionCode': 'ZH12',
                        'zipCode': '8037'
                    }
                ],
                'cantons': [
                    { 'name': 'Zürich', 'code': 'ZH' }
                ]
            };

            // WHEN
            const result = ZipCodeComponent.localityResultMapper(localityAutocomplete);

            // THEN
            expect(result).toEqual([
                {
                    'zip': '8037',
                    'city': 'Zürich',
                    'communalCode': 261
                }
            ])
        });

        it('should sort the localities first by city and then by zip', () => {
            // GIVEN
            const localityAutocomplete: LocalityAutocomplete = {
                'localities': [{
                    'city': 'Bern',
                    'communalCode': 351,
                    'cantonCode': 'BE',
                    'regionCode': 'BE01',
                    'zipCode': '3004'
                }, {
                    'city': 'Allmendingen b. Bern',
                    'communalCode': 630,
                    'cantonCode': 'BE',
                    'regionCode': 'BE01',
                    'zipCode': '3112'
                }, {
                    'city': 'Wohlen b. Bern',
                    'communalCode': 360,
                    'cantonCode': 'BE',
                    'regionCode': 'BE01',
                    'zipCode': '3033'
                }, {
                    'city': 'Bern',
                    'communalCode': 351,
                    'cantonCode': 'BE',
                    'regionCode': 'BE01',
                    'zipCode': '3006'
                }], 'cantons': [{ 'name': 'Bern / Berne', 'code': 'BE' }]
            };

            // WHEN
            const result = ZipCodeComponent.localityResultMapper(localityAutocomplete);

            // THEN
            expect(result).toEqual([
                {
                    'zip': '3112',
                    'city': 'Allmendingen b. Bern',
                    'communalCode': 630
                },
                {
                    'zip': '3004',
                    'city': 'Bern',
                    'communalCode': 351,
                },
                {
                    'zip': '3006',
                    'city': 'Bern',
                    'communalCode': 351,
                },
                {
                    'zip': '3033',
                    'city': 'Wohlen b. Bern',
                    'communalCode': 360,
                }
            ])
        });
    })
});
