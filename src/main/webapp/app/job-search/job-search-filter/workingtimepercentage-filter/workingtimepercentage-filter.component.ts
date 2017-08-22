import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import {
    getFilterWorkingtimepercentage,
    JobSearchState,
    Workingtimepercentage,
    WorkingtimepercentageChangedAction
} from '../../state-management';

@Component({
  selector: 'jr2-workingtimepercentage-filter',
  templateUrl: './workingtimepercentage-filter.component.html',
  styleUrls: ['./workingtimepercentage-filter.component.scss']
})
export class WorkingtimepercentageFilterComponent implements OnInit {

  private workingtimepercentage$: Observable<Workingtimepercentage>;
  private min: number;
  private max: number;

  constructor(private store: Store<JobSearchState>) {
      this.workingtimepercentage$ = store.select(getFilterWorkingtimepercentage);
  }

  ngOnInit() {
      this.workingtimepercentage$.subscribe(
          (result) => {
              this.min = result.min;
              this.max = result.max;
          }
      );
  }

  onChangeMin(newValue) {
      const workingtimepercentage: Workingtimepercentage = {
          min: newValue,
          max: this.max
      };
      this.dispatchAction(workingtimepercentage);
  }

  onChangeMax(newValue) {
      const workingtimepercentage: Workingtimepercentage = {
          min: this.min,
          max: newValue
      };
      this.dispatchAction(workingtimepercentage);
  }

  dispatchAction(workingtimepercentage: Workingtimepercentage) {
      this.store.dispatch(new WorkingtimepercentageChangedAction(workingtimepercentage));
  }
}
