import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { CoachHttpService } from "../../../../../../../../coach-http.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class WorkoutResolve implements Resolve<Observable<WorkoutDetails>> {
  constructor(private http: CoachHttpService) { }

  resolve(route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Observable<WorkoutDetails> {
    let id = route.paramMap.get('id');

    return this.http.getWorkout(+id);
  }
}
