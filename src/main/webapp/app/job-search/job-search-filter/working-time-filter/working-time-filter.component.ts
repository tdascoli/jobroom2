import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import {
    getFilterWorkingTime,
    JobSearchState,
    WorkingTime,
    WorkingTimeChangedAction
} from '../../state-management';

@Component({
  selector: 'jr2-working-time-filter',
  templateUrl: './working-time-filter.component.html',
  styleUrls: ['./working-time-filter.component.scss']
})
export class WorkingTimeFilterComponent implements OnInit, OnDestroy {

  private workingTime$: Observable<WorkingTime>;
  private subscription: any;
  private min: number;
  private max: number;

  constructor(private store: Store<JobSearchState>) {
      this.workingTime$ = store.select(getFilterWorkingTime);
  }

  ngOnInit() {
      this.subscription = this.workingTime$.subscribe(
          (result) => {
              this.min = result.min;
              this.max = result.max;
          }
      );
  }

  ngOnDestroy() {
      this.subscription.unsubscribe();
  }

  onChangeMin(newValue) {
      const workingTime: WorkingTime = {
          min: newValue,
          max: this.max
      };
      this.dispatchAction(workingTime);
  }

  onChangeMax(newValue) {
      const workingTime: WorkingTime = {
          min: this.min,
          max: newValue
      };
      this.dispatchAction(workingTime);
  }

  dispatchAction(workingTime: WorkingTime) {
      this.store.dispatch(new WorkingTimeChangedAction(workingTime));
  }
}
