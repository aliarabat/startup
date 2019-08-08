import {Injectable} from '@angular/core';
import {Exercise} from '../model/exercise.model';
import {Subject, Subscription} from 'rxjs';
import {AngularFirestore} from '@angular/fire/firestore';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TrainingService {

  exerciseChanged = new Subject<Exercise>();
  exercisesChanged = new Subject<Exercise[]>();

  finishedExercisesChanged = new Subject<Exercise[]>();
  private fsSubs: Subscription[] = [];

  private runningExercise: Exercise;

  constructor(private afs: AngularFirestore) {
  }

  private _availableExercises: Exercise[] = [];

  fetchAvailableExercises() {
    this.fsSubs.push(this.afs.collection('availableExercises').snapshotChanges().pipe(map(docArray => {
      return docArray.map(doc => {
        return {
          id: doc.payload.doc.id,
          ...doc.payload.doc.data()
        };
      });
    })).subscribe((exercises: Exercise[]) => {
      this._availableExercises = exercises;
      this.exercisesChanged.next([...this._availableExercises]);
    }));
  }

  startExercise(selectedId: string) {
    this.runningExercise = this._availableExercises.find(ex => ex.id === selectedId);
    this.exerciseChanged.next({...this.runningExercise});
  }

  completeExercise() {
    this.addDataToDatabase({...this.runningExercise, date: new Date(), state: 'Complete'});
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  cancelledExercise(progress: number) {
    this.addDataToDatabase({
      ...this.runningExercise, date: new Date(), state: 'Cancelled', duration: this.runningExercise.duration * (progress / 100),
      calories: this.runningExercise.calories * (progress / 100),
    });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  getCurrentExercise() {
    return {...this.runningExercise};
  }

  fetchCompletedOrCancelledExercises() {
    this.fsSubs.push(this.afs.collection('finishedExercises').snapshotChanges().pipe(map(docArray => {
      return docArray.map(doc => {
          return {
            ...doc.payload.doc.data(),
            id: doc.payload.doc.id
          };
        }
      );
    })).subscribe(
      (exercises: Exercise[]) => {
        this.finishedExercisesChanged.next(exercises);
      }));
  }

  private addDataToDatabase(exercise: Exercise) {
    this.afs.collection('finishedExercises').add(exercise);
  }

  cancelSubscriptions() {
    this.fsSubs.forEach(subs => subs.unsubscribe());
  }

  deleteExercise(id: string) {

    this.afs.doc('/finishedExercises/' + id).delete();
    //this.finishedExercisesChanged([...this]);
  }
}
