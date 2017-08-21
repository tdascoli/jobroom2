import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { JobService } from '../../entities/job/job.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'jr2-job-detail',
  templateUrl: './job-detail.component.html',
  styles: []
})
export class JobDetailComponent implements OnInit {

  job: any;

  constructor(
      private route: ActivatedRoute,
      private router: Router,
      private jobService: JobService
  ) { }

  ngOnInit() {

      this.job = this.route.paramMap
          .switchMap((params: ParamMap) =>
              this.jobService.find(params.get('id')))
          .subscribe(
              (job: any) => this.job = job,
              (err) => this.goBackToList()
          );
  }

  goBackToList() {
      this.router.navigate(['/job-search']);
  }

}
