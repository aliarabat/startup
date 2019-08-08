import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {Exercise} from '../../controller/model/exercise.model';
import {TrainingService} from '../../controller/service/training.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-past-trainings',
  templateUrl: './past-trainings.component.html',
  styleUrls: ['./past-trainings.component.css']
})
export class PastTrainingsComponent implements OnInit, AfterViewInit, OnDestroy {

  displayedColumns = ['date', 'name', 'duration', 'calories', 'state', 'actions'];
  datasource = new MatTableDataSource<Exercise>();
  finishedExecisesSubscription: Subscription;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private trainingService: TrainingService) {
  }

  ngOnInit() {
    this.finishedExecisesSubscription = this.trainingService.finishedExercisesChanged.subscribe(res => {
      this.datasource.data = res;
    });
    this.trainingService.fetchCompletedOrCancelledExercises();
  }

  ngOnDestroy() {
    this.finishedExecisesSubscription.unsubscribe();
  }

  ngAfterViewInit() {
    this.datasource.sort = this.sort;
    this.datasource.paginator = this.paginator;
  }

  doFilter(filterValue: string) {
    this.datasource.filter = filterValue.trim().toLowerCase();
  }

  deleteExercise(id: string) {
    this.trainingService.deleteExercise(id);
  }
}
