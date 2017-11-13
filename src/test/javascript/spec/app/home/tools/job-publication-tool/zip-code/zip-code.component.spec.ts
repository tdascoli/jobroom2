import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { LocalityService } from '../../../../../../../../main/webapp/app/shared/reference-service/locality.service';
import { ZipCodeComponent } from '../../../../../../../../main/webapp/app/home/tools/job-publication-tool/zip-code/zip-code.component';
import { SimpleChange } from '@angular/core';

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
});
