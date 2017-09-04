import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ToolbarComponent } from '../../../../../../main/webapp/app/home/toolbar/toolbar.component';

describe('ToolbarComponent', () => {
    let component:ToolbarComponent;
    let fixture:ComponentFixture<ToolbarComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
                declarations: [ToolbarComponent]
            })
            .overrideTemplate(ToolbarComponent, '')
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ToolbarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
