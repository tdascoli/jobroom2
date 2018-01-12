import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ElasticsearchReindexModalComponent } from './elasticsearch-reindex-modal.component';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'jhi-elasticsearch-reindex',
    templateUrl: './elasticsearch-reindex.component.html'
})
export class ElasticsearchReindexComponent {

    document$: Observable<string>;

    constructor(private modalService: NgbModal,
                private route: ActivatedRoute) {
        this.document$ = this.route.paramMap
            .map((params: ParamMap) => params.get('document') || 'all');
    }

    showConfirm(document) {
        const ngbModalRef = this.modalService.open(ElasticsearchReindexModalComponent);
        ngbModalRef.componentInstance.document = document
    }
}
