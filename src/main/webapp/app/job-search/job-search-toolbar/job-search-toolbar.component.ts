import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'jhi-job-search-toolbar',
    templateUrl: './job-search-toolbar.component.html',
    styles: []
})
export class JobSearchToolbarComponent implements OnInit {
    @Input() total: number;
    term: string;

    constructor(private route: ActivatedRoute, private router: Router) {
    }

    ngOnInit() {
        this.route.queryParams
            .map((params) => params['term'] || '')
            .subscribe((term: string) => this.term = term);
    }

    search() {
        this.router.navigate(['job-search'], { queryParams: { term: this.term } });
    }
}
