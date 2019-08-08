import {Component, OnDestroy, OnInit} from '@angular/core';
import {TrainingService} from '../../controller/service/training.service';
import {NgForm} from '@angular/forms';
import {Subscription} from 'rxjs';
import {Exercise} from '../../controller/model/exercise.model';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  exercises: Exercise[];
  exercisesSubscription: Subscription;

  constructor(private trainingService: TrainingService) {
  }

  ngOnInit() {
    this.trainingService.fetchAvailableExercises();
    this.exercisesSubscription=this.trainingService.exercisesChanged.subscribe(exercises=>(this.exercises=exercises));
  }

  onStartTraining(f: NgForm) {
    this.trainingService.startExercise(f.value.exercise);
  }
  ngOnDestroy(){
    this.exercisesSubscription.unsubscribe();
  }
}
