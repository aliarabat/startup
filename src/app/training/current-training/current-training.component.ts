import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {MatDialog} from '@angular/material';
import {StopTrainingComponent} from '../stop-training/stop-training.component';
import {TrainingService} from '../../controller/service/training.service';

@Component({
  selector: 'app-current-training',
  templateUrl: './current-training.component.html',
  styleUrls: ['./current-training.component.css']
})
export class CurrentTrainingComponent implements OnInit {

  progress = 0;
  timer: number;

  constructor(public dialog: MatDialog, private trainingService:TrainingService) {
  }

  ngOnInit() {
    this.resumeOrStop();
  }

  onStopTraining() {
    clearInterval(this.timer);
    const dialogRef = this.dialog.open(StopTrainingComponent, {data: {progress: this.progress}});
    dialogRef.afterClosed().subscribe(res => res ? this.trainingService.cancelledExercise(this.progress) : this.resumeOrStop());
  }

  private resumeOrStop() {
    const step=this.trainingService.getCurrentExercise().duration*10;
    this.timer = setInterval(() => {
      this.progress = this.progress + 10;
      if (this.progress > 100) {
        clearInterval(this.timer);
        this.trainingService.completeExercise();
      }
    }, step);
  }
}
