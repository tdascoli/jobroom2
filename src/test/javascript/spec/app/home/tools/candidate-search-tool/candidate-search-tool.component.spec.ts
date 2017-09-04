import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CandidateSearchToolComponent } from '../../../../../../../main/webapp/app/home/tools/candidate-search-tool/candidate-search-tool.component';

describe('CandidateSearchToolComponent', () => {
    let component:CandidateSearchToolComponent;
    let fixture:ComponentFixture<CandidateSearchToolComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
                declarations: [CandidateSearchToolComponent]
            })
            .overrideTemplate(CandidateSearchToolComponent, '')
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CandidateSearchToolComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
