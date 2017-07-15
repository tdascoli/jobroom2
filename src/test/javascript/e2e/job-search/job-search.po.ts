import { browser, by, element, ElementArrayFinder, ElementFinder } from 'protractor';

export class JobSearchPage {

    navigateTo() {
        return browser.get('/#/job-search');
    }

    occupationAutocomplete() {
        return new OccupationAutocomplete();
    }

}

export class OccupationAutocomplete {
    component: ElementFinder;

    constructor() {
        this.component = element(by.css('jr2-typeahead-multiselect'));
    }

    inputElement(): ElementFinder {
        return this.component.element(by.css('input'));
    }

    tags(): ElementArrayFinder {
        return this.component.all(by.css('span.typeahead-multiselect__tag'));
    }

    deleteFirstTag() {
        this.tags().first().element(by.css('.remove-button')).click();
    }

    suggestBox(): ElementFinder {
        return this.component.element(by.css('ngb-typeahead-window'));
    }

    dropdownItems(): ElementArrayFinder {
        return this.suggestBox().all(by.css('button.dropdown-item'));
    }
}

