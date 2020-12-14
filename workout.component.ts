import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CoachNavigationService } from "../../../../../../../../coach-navigation.service";
import { ActivatedRoute } from "@angular/router";
import { MeasurementTypeTitle } from "../../../../../../../../../common/wodmode.data";
import { MatDialog } from "@angular/material";
import { MovementsComponent } from "./movements/movements.component";
import { takeWhile, tap } from "rxjs/operators";
import { CalendarStaticStorageService } from "../../../../calendar-static-storage.service";
import { DialogData } from "./movements/movements";
import { WorkoutMovementsService } from "./workout-movements.service";

@Component({
  selector: 'workout',
  templateUrl: './workout.component.html',
  styleUrls: ['./workout.component.scss'],
})
export class WorkoutComponent implements OnInit {
  @ViewChild('input', { static: true }) inputTitle: ElementRef;

  public editMode: boolean = false;

  public workout: CreationCustomWorkout = {
    wt_id: 0,
    workout_type: '',
    ms_id: 0,
    measurement: '',
    set_nums: 1,
    workout: '',
    workout_description: '',
    movements: [],
  };

  public workoutType: WorkoutType = {} as any;
  public readonly measurementTypes = MeasurementTypeTitle;
  public readonly scoring = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

  constructor(
    public navigation: CoachNavigationService,
    public workoutsStorage: CalendarStaticStorageService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private movementsService: WorkoutMovementsService,
  ) { }

  ngOnInit(): void {
    this.route.data
      .subscribe((data: CustomWorkoutRouteData) => {
        this.workoutType = data.workoutType;

        this.workout.wt_id = data.workoutType.id;
        this.workout.workout_type = data.workoutType.title;
      });
  }

  public openMovementSelection(): void {
    this.dialog.open(MovementsComponent, {
      data: {
        movements: this.workoutsStorage.movements,
        selectedMovements: this.workout.movements,
      } as DialogData
    })
      .afterClosed()
      .pipe(
        takeWhile(result => !!result),
        tap((movementsIds: number[]) => {
          let movements: Movement[] = [];

          if (movementsIds) {
            movements = this.workoutsStorage.movements.filter(item => movementsIds.includes(+item.m_id));
          }

          this.workout.movements = movements;
        })
      )
      .subscribe()
      ;
  }

  public handleDescription(): void {
    const parsedMovements = this.movementsService.parseText(this.workout.workout_description);
    const mergedMovements = this.movementsService.mergeMovements(this.workout.movements, parsedMovements);

    this.workout.movements = mergedMovements;
  }

  public removeMovement(index: number): void {
    this.workout.movements.splice(index, 1);
  }

  public editTitle(): void {
    this.editMode = true;
    setTimeout(() => this.inputTitle.nativeElement.focus());
  }
}
