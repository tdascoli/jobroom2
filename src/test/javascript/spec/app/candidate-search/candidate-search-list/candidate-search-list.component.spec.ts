import { CandidateSearchListComponent } from '../../../../../../main/webapp/app/candidate-search/candidate-search-list/candidate-search-list.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { JobroomTestModule } from '../../../test.module';
import { Store } from '@ngrx/store';

describe('CandidateSearchListComponent', () => {
    const mockStore = jasmine.createSpyObj('mockStore', ['dispatch']);

    let component: CandidateSearchListComponent;
    let fixture: ComponentFixture<CandidateSearchListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [JobroomTestModule],
            declarations: [CandidateSearchListComponent],
            providers: [
                { provide: Store, useValue: mockStore },
            ]
        })
            .overrideTemplate(CandidateSearchListComponent, '')
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CandidateSearchListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
