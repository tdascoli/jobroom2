import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import {
    TypeaheadItemDisplayModel,
    TypeaheadMultiselectComponent,
    TypeaheadMultiselectModel
} from '../../../../../../../../main/webapp/app/shared/input-components';
import { MULTISELECT_FREE_TEXT_VALUE_MIN_LENGTH } from '../../../../../../../../main/webapp/app/app.constants';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';

describe('TypeaheadMultiselectComponent', () => {

    let component: TypeaheadMultiselectComponent;
    let fixture: ComponentFixture<TypeaheadMultiselectComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [NgbTypeaheadModule.forRoot()],
            declarations: [TypeaheadMultiselectComponent],
        })
            .overrideTemplate(TypeaheadMultiselectComponent, '<input [ngbTypeahead]="wrappedItemLoader"/>') // we need only the @ViewChild
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TypeaheadMultiselectComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });

    describe('removeItem', () => {
        it('should remove an existing item', () => {
            // GIVEN
            component.selectedItems = [new TypeaheadMultiselectModel('type', 'code', 'label')];

            // WHEN
            component.removeItem(new TypeaheadMultiselectModel('type', 'code', 'label'));

            // THAN
            expect(component.selectedItems.length).toEqual(0);
        });
    });

    describe('selectFreeText', () => {
        it('should add a new model with type: free-text ', () => {
            // GIVEN
            component.selectedItems = [new TypeaheadMultiselectModel('type', 'code', 'label')];

            // WHEN
            component.inputValue = 'free';
            const freeText = component.selectFreeText();

            // THAN
            const expectedFreeText = new TypeaheadMultiselectModel('free-text', 'free', 'free');
            expect(freeText).toEqual(expectedFreeText);
            expect(component.selectedItems.length).toEqual(2);
            expect(component.selectedItems).toContain(new TypeaheadMultiselectModel('type', 'code', 'label'));
            expect(component.selectedItems).toContain(freeText);
        });

        it('should not allow duplicates', () => {
            // GIVEN
            component.selectedItems = [new TypeaheadMultiselectModel('free-text', 'free text value', 'free text value')];

            // WHEN
            component.inputValue = 'free text value';
            const freeText = component.selectFreeText();

            // THAN
            expect(freeText).toEqual(null);
            expect(component.selectedItems.length).toEqual(1);
            expect(component.selectedItems).toContain(new TypeaheadMultiselectModel('free-text', 'free text value', 'free text value'));
        });

        it('should not allow free text value with length < MULTISELECT_FREE_TEXT_VALUE_MIN_LENGTH', () => {
            // WHEN
            component.inputValue = new Array(MULTISELECT_FREE_TEXT_VALUE_MIN_LENGTH - 1).fill('a').join('');
            const freeText = component.selectFreeText();

            // THAN
            expect(freeText).toEqual(null);
            expect(component.selectedItems.length).toEqual(0);
        });
    });

    describe('selectItem', () => {
        it('should add the selected item to the model', () => {
            // GIVEN
            component.selectedItems = [new TypeaheadMultiselectModel('type', 'code', 'label')];

            // WHEN
            const event = jasmine.createSpyObj('event', ['preventDefault']);
            event.item = { model: new TypeaheadMultiselectModel('type', 'code1', 'label1') };
            component.selectItem(event);

            // THAN
            expect(component.selectedItems.length).toEqual(2);
            expect(component.selectedItems).toContain(new TypeaheadMultiselectModel('type', 'code', 'label'));
            expect(component.selectedItems).toContain(new TypeaheadMultiselectModel('type', 'code1', 'label1'));
        });
    });

    describe('wrappedItemLoader', () => {
        let input$;
        beforeEach(() => {
            input$ = new BehaviorSubject('');
        });

        it('should not load items if the input is shorter than 2 characters', fakeAsync(() => {
            // GIVEN
            component.itemLoader = (value: string) => Observable.of([]);
            spyOn(component, 'itemLoader').and.callThrough();
            component.wrappedItemLoader(input$).subscribe((o: any) => '');

            // WHEN
            input$.next('1');
            tick(201);

            // THAN
            expect(component.itemLoader).not.toHaveBeenCalled();
        }));

        it('should load items if the input is longer than 2 characters (inclusive)', fakeAsync(() => {
            // GIVEN
            component.itemLoader = (value: string) => Observable.of([]);
            spyOn(component, 'itemLoader').and.callThrough();
            component.wrappedItemLoader(input$).subscribe((o: any) => '');

            // WHEN
            input$.next('12');
            tick(201);

            // THAN
            expect(component.itemLoader).toHaveBeenCalledWith('12');
        }));

        it('should filter the already selected values from the loaded items', fakeAsync(() => {
            let loadedItems: Array<any>;

            // GIVEN
            component.selectedItems = [new TypeaheadMultiselectModel('type', 'code', 'label')];
            component.itemLoader = (value: string) => Observable.of([new TypeaheadMultiselectModel('type', 'code', 'label')]);
            component.wrappedItemLoader(input$).subscribe((items: any) => loadedItems = items);

            // WHEN
            input$.next('123');
            tick(201);

            // THAN
            expect(loadedItems.length).toEqual(0);
        }));

        it('should sort the loaded items by the order property', fakeAsync(() => {
            let loadedItems: Array<any>;

            // GIVEN
            component.itemLoader = (value: string) => Observable.of([
                new TypeaheadMultiselectModel('type', 'code0', 'label0', 3),
                new TypeaheadMultiselectModel('type', 'code1', 'label1', 2),
                new TypeaheadMultiselectModel('type', 'code2', 'label2', 0),
                new TypeaheadMultiselectModel('type', 'code3', 'label3', 1)
            ]);
            component.wrappedItemLoader(input$).subscribe((items: any) => loadedItems = items);

            // WHEN
            input$.next('123');
            tick(201);

            // THAN
            expect(loadedItems).toEqual([
                new TypeaheadItemDisplayModel(new TypeaheadMultiselectModel('type', 'code2', 'label2', 0), true, true),
                new TypeaheadItemDisplayModel(new TypeaheadMultiselectModel('type', 'code3', 'label3', 1), false, false),
                new TypeaheadItemDisplayModel(new TypeaheadMultiselectModel('type', 'code1', 'label1', 2), false, false),
                new TypeaheadItemDisplayModel(new TypeaheadMultiselectModel('type', 'code0', 'label0', 3), false, false)
            ]);
        }));

        it('should mark the first items for every type', fakeAsync(() => {
            let loadedItems: Array<any>;

            // GIVEN
            component.itemLoader = (value: string) => Observable.of([
                new TypeaheadMultiselectModel('type0', 'code0', 'label0', 0),
                new TypeaheadMultiselectModel('type0', 'code1', 'label1', 0),
                new TypeaheadMultiselectModel('type1', 'code2', 'label2', 1),
                new TypeaheadMultiselectModel('type1', 'code3', 'label3', 1)
            ]);
            component.wrappedItemLoader(input$).subscribe((items: any) => loadedItems = items);

            // WHEN
            input$.next('123');
            tick(201);

            // THAN
            expect(loadedItems).toEqual([
                new TypeaheadItemDisplayModel(new TypeaheadMultiselectModel('type0', 'code0', 'label0', 0), true, true),
                new TypeaheadItemDisplayModel(new TypeaheadMultiselectModel('type0', 'code1', 'label1', 0), false, false),
                new TypeaheadItemDisplayModel(new TypeaheadMultiselectModel('type1', 'code2', 'label2', 1), false, true),
                new TypeaheadItemDisplayModel(new TypeaheadMultiselectModel('type1', 'code3', 'label3', 1), false, false)
            ]);
        }));
    });
});
