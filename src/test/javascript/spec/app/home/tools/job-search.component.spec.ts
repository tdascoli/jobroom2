import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { JobSearchComponent } from '../../../../../../main/webapp/app/home/tools/job-search.component';
import { MockRouter } from '../../../helpers/mock-route.service';
import { Router } from '@angular/router';

describe('JobSearchComponent', () => {
    const mockRouter = new MockRouter();

    let component: JobSearchComponent;
    let fixture: ComponentFixture<JobSearchComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [JobSearchComponent],
            providers: [
                { provide: Router, useValue: mockRouter }
            ]
        })
            .overrideTemplate(JobSearchComponent, '')
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(JobSearchComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
