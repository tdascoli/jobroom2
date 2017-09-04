import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { JobPublicationToolComponent } from '../../../../../../../main/webapp/app/home/tools/job-publication-tool/job-publication-tool.component';

describe('JobPublicationToolComponent', () => {
    let component:JobPublicationToolComponent;
    let fixture:ComponentFixture<JobPublicationToolComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
                declarations: [JobPublicationToolComponent]
            })
            .overrideTemplate(JobPublicationToolComponent, '')
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(JobPublicationToolComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
